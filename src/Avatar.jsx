import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// url: the file's path in storage. size: pixels. onUpload: what to do after uploading
export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null) // a temporary browser link to the image
  const [uploading, setUploading] = useState(false)

  // Whenever the stored path changes, download that image
  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    // Get the file from the avatars bucket
    const { data, error } = await supabase.storage.from('avatars').download(path)
    if (error) {
      console.log('Error downloading image:', error.message)
      return
    }
    // Turn the downloaded file into a link the <img> tag can show
    setAvatarUrl(URL.createObjectURL(data))
  }

  async function uploadAvatar(event) {
    setUploading(true)
    const file = event.target.files?.[0] // the file the user picked
    if (!file) {
      alert('You must select an image to upload.')
      setUploading(false)
      return
    }

    // Give the file a random name, keeping its extension (like .png)
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`

    // Upload it to the avatars bucket
    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (error) {
      alert(error.message)
    } else {
      onUpload(event, filePath) // tell Account to save the new path
    }
    setUploading(false)
  }

  return (
    <div>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" style={{ height: size, width: size }} />
      ) : (
        <div style={{ height: size, width: size, background: '#ccc' }} />
      )}
      {/* Clicking this label opens the hidden file picker below */}
      <label htmlFor="single" style={{ cursor: 'pointer', textDecoration: 'underline' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </label>
      <input
        style={{ visibility: 'hidden', position: 'absolute' }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  )
}