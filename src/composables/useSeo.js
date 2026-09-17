import { computed, unref } from 'vue'
import { useHead } from '@unhead/vue'

const SITE = 'eCoach'
const ORIGIN = 'https://finify.github.io/ecoach-web'

/**
 * Per-route title and meta.
 *
 * Built on @unhead/vue (which vite-ssg already depends on) rather than poking
 * at `document`, so the tags are baked into the prerendered HTML as well as
 * updated on client-side navigation. A crawler that never runs the JS still
 * sees the right title.
 */
export function useSeo(input = {}) {
  const title = computed(() => {
    const t = unref(input.title)
    if (!t) return SITE
    return t.includes(SITE) ? t : `${t} — ${SITE}`
  })
  const description = computed(() => unref(input.description) || '')
  const image = computed(() => {
    const src = unref(input.image)
    return src ? `${ORIGIN}/${String(src).replace(/^\//, '')}` : `${ORIGIN}/media/product/dashboard.webp`
  })

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: unref(input.type) || 'website' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  })
}
