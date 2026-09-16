import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves a project site from /<repo>/, so assets need that prefix.
// The Actions workflow sets BASE_PATH; local dev and user/organisation pages use '/'.
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap'] }
      }
    }
  }
})
