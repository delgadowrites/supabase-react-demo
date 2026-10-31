// Load the Supabase library
import { createClient } from '@supabase/supabase-js'

// Read the URL and key from .env.local (Vite only exposes names starting with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Create one client the whole app shares
export const supabase = createClient(supabaseUrl, supabasePublishableKey)