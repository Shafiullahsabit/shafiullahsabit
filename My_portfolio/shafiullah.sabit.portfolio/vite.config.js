import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // Expose the public Supabase URL/key to the client even if only the
  // server-side names were added in Vercel. Never prefix the service role key.
  envPrefix: [
    'VITE_',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
  ],
})
