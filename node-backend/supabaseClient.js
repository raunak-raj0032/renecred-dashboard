import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('❌ Missing SUPABASE_URL in .env file')
}
if (!supabaseKey) {
  throw new Error('❌ Missing SUPABASE_KEY or SUPABASE_ANON_KEY in .env file')
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('✅ Supabase client initialized successfully')
