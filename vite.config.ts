import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages alt klasörde (/edc-site/) yayınlanır; yerelde ve kendi alan adında "/" kullanılır.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/edc-site/' : '/',
})
