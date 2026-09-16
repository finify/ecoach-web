import { onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Users who asked for less motion get the end state, never the journey. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Runs `build(ctx, gsap)` inside a gsap.context scoped to `scopeRef`, so every
 * tween and ScrollTrigger it creates is reverted together on unmount. Skipped
 * entirely when reduced motion is on — the CSS resting state is already the
 * final state, so elements simply appear.
 */
export function useGsapContext(scopeRef, build) {
  let ctx

  onMounted(() => {
    if (prefersReducedMotion() || !scopeRef.value) return
    ctx = gsap.context((self) => build(self, gsap), scopeRef.value)
  })

  onBeforeUnmount(() => ctx?.revert())
}

/**
 * The house reveal: rise + fade as the element enters, staggered across
 * siblings. `ease-out` because it is an entrance, and entrances never
 * start slow.
 */
export function revealOnScroll(targets, options = {}) {
  const {
    y = 24,
    duration = 0.7,
    stagger = 0.08,
    start = 'top 85%',
    trigger
  } = options

  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: trigger || targets,
      start,
      once: true
    }
  })
}

export { gsap, ScrollTrigger }
