import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'

// GitHub Pages serves a project site from /<repo>/, so assets need that prefix.
// The Actions workflow sets BASE_PATH; local dev and user/organisation pages use '/'.
const base = process.env.BASE_PATH || '/'

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))

/**
 * Every URL to prerender. Derived from the migrated content and the block
 * list, so adding an article or a block automatically adds its page.
 */
function routesToPrerender() {
  const posts = read('./src/content/posts.json')
  const blocks = readFileSync(new URL('./src/data/blockPages.js', import.meta.url), 'utf8')
  const slugs = [...blocks.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1])

  return [
    '/', '/what-we-do', '/platform', '/case-studies', '/testimonials',
    '/team', '/news', '/contact', '/cookie-policy',
    '/404', // rendered by the catch-all route; copied to dist/404.html at deploy
    ...slugs.map((s) => `/platform/${s}`),
    ...posts.map((p) => `/news/${p.slug}`)
  ]
}

export default defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      // Split GSAP out for the browser bundle only. During the SSG pass it is
      // an external, and Rollup refuses to put externals in a manual chunk.
      output: isSsrBuild ? {} : { manualChunks: { gsap: ['gsap'] } }
    }
  },
  ssgOptions: {
    // Nested writes /news/slug/index.html, which GitHub Pages serves for both
    // /news/slug and /news/slug/ without relying on extension guessing.
    dirStyle: 'nested',
    formatting: 'minify',
    includedRoutes: routesToPrerender
  }
}))
