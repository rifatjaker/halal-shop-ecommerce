import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base must match the GitHub Pages project path
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_BASE || '/',
})
