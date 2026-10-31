import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Avatar from './Avatar'

export default function Account({ session }) {
  // Form values, plus a loading flag while we talk to Supabase
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null) // used in Step 6

  // On load: fetch this user's profile row
  useEffect(() => {
    let ignore = false // prevents updating state after the page changes

    async function getProfile() {
      setLoading(true)
      const { user } = session

      // Find the one profile whose id matches the signed-in user
      const { data, error } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single() // expect exactly one row

      if (!ignore) {
        if (error) {
          console.warn(error) // shows in the browser Console
        } else if (data) {
          setUsername(data.username ?? '') // ?? '' turns null into empty text
          setWebsite(data.website ?? '')
          setAvatarUrl(data.avatar_url)
        }
      }
      setLoading(false)
    }

    getProfile()
    return () => { ignore = true }
  }, [session])

  // On submit or after an upload: save the profile row
  async function updateProfile(event, newAvatarPath) {
    event.preventDefault()
    setLoading(true)
    const { user } = session

    // Use the new avatar path if one was just uploaded, otherwise keep the current one
    const avatarPath = newAvatarPath ?? avatarUrl

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarPath,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)
    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarPath) // tells Avatar to download the new image
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile}>
      <Avatar
        url={avatarUrl}
        size={150}
        onUpload={(event, url) => updateProfile(event, url)}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          required
          value={username}
          minLength={3}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Update'}
      </button>
      <button type="button" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
    </form>
  )
}