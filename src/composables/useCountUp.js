import { ref } from 'vue'
import { gsap, prefersReducedMotion } from './useGsap'

/**
 * Counts a number up when it scrolls into view. Returns a reactive display
 * value and a registrar for the element that triggers it.
 */
export function useCountUp(target, { duration = 1.6 } = {}) {
  const display = ref(0)

  const attach = (el) => {
    if (!el) return
    if (prefersReducedMotion()) {
      display.value = target
      return
    }
    const counter = { n: 0 }
    gsap.to(counter, {
      n: target,
      duration,
      ease: 'power2.out',
      // Fires as soon as the number is on screen — a stat sitting in the
      // first viewport should never be caught reading zero.
      scrollTrigger: { trigger: el, start: 'top 98%', once: true },
      onUpdate: () => { display.value = Math.round(counter.n) }
    })
  }

  return { display, attach }
}
