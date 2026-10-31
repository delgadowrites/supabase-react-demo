import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'

export default function App() {
  // session: null when logged out, an object when logged in
  const [session, setSession] = useState(null)

  useEffect(() => {
    // On page load: is someone already signed in?
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Keep listening: update whenever someone signs in or out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Stop listening if this component is removed
    return () => subscription.unsubscribe()
  }, [])

  // Logged out: show the sign-in form
  if (!session) return <Auth />

  // Logged in: show the profile page
  return <Account key={session.user.id} session={session} />
}