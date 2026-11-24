import { createClient } from '@neon/neon-js'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL

if (!authUrl || !dataApiUrl) {
  throw new Error('Missing Neon Auth or Data API URL. Run neon env pull and configure the VITE_NEON_* variables.')
}

export const neon = createClient({
  auth: { url: authUrl },
  dataApi: { url: dataApiUrl }
})
