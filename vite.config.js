import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // In development, proxy /api to local backend
  // In production (Vercel), /api routes are handled by serverless functions automatically
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
