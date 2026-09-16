import { createApp } from 'vue'
import App from './App.vue'
import './styles/tokens.css'

/**
 * Marks that scripting is available. Every scroll-reveal resting state is
 * scoped to `.js-ready`, so without JS the page renders fully visible instead
 * of leaving content stuck at opacity 0.
 */
document.documentElement.classList.add('js-ready')

createApp(App).mount('#app')
