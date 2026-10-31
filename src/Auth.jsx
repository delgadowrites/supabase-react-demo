// React's state tool, plus our shared Supabase client
import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  // loading: true while the email is sending. email: what the user typed
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  // Runs when the form is submitted
  const handleLogin = async (event) => {
    event.preventDefault() // stop the page from reloading
    setLoading(true)

    // Ask Supabase Auth to email a magic link to this address
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  // What shows on the page
  return (
    <div>
      <h1>Supabase + React</h1>
      <p>Sign in via magic link with your email below</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? 'Sending...' : 'Send magic link'}
        </button>
      </form>
    </div>
  )
}