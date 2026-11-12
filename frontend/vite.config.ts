import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allow the temporary Cloudflare tunnel host used to open the app inside Telegram
    allowedHosts: ['.trycloudflare.com'],
    // the Mini App calls the backend through the same origin (works through the tunnel too)
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
