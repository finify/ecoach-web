import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './styles/tokens.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    // Without this the router builds links from the domain root, so every
    // internal link 404s under a GitHub Pages project path.
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, top: 92, behavior: 'smooth' }
      return { top: 0 }
    }
  },
  ({ isClient }) => {
    // Scroll-reveal resting states are scoped to this class, so a page without
    // scripting renders fully visible rather than stuck at opacity 0.
    if (isClient) document.documentElement.classList.add('js-ready')
  }
)
