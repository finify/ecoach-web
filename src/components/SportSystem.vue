<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BrandMark from './BrandMark.vue'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../composables/useGsap'
import { sportIcons } from '../data/sportIcons'

/**
 * A fixed layer of sports icons that drifts across the page as you scroll,
 * then gathers into orbit around the eCoach mark at the end.
 *
 * The layer sits behind `main` (z-index 0 vs 1), so icons show against the
 * canvas and are occluded by any painted panel — they read as depth rather
 * than as clutter on top of the content.
 *
 * It is positioned relative to the viewport, and the orbit section is pinned
 * while the gathering happens. That is what lets the icons converge on the
 * centre of the screen and land exactly on the mark: while pinned, the
 * section's centre and the viewport's centre are the same point.
 *
 * Coupled to OrbitSection.vue by the `#orbit` id, queried on mount.
 */

const layer = ref(null)
const centre = ref(null)
const iconEls = ref([])

let ticker = null
const triggers = []

/** Deterministic per-icon jitter, so trajectories vary but never reshuffle. */
const rnd = (i, seed) => {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return v - Math.floor(v)
}

onMounted(() => {
  // The whole system is decoration. With reduced motion we render nothing
  // rather than freezing ten icons mid-flight across the copy.
  if (prefersReducedMotion() || !layer.value) return

  const orbitEl = document.querySelector('#orbit')
  if (!orbitEl) return

  layer.value.style.opacity = '1'

  // Per-icon drift trajectory, as viewport fractions.
  const paths = sportIcons.map((_, i) => ({
    x0: 0.08 + rnd(i, 1) * 0.84,
    x1: 0.08 + rnd(i, 2) * 0.84,
    y0: rnd(i, 3) * 1.1 - 0.05,
    y1: rnd(i, 4) * 1.1 - 0.05,
    waves: 1 + Math.floor(rnd(i, 5) * 3),
    amp: 0.05 + rnd(i, 6) * 0.13,
    phase: rnd(i, 7) * Math.PI * 2,
    spin: (rnd(i, 8) - 0.5) * 540,
    scale: 0.75 + rnd(i, 9) * 0.5
  }))

  // Orbit geometry: an inner and an outer ring, so it reads as a system
  // rather than a single ring of evenly spaced dots.
  const rings = sportIcons.map((_, i) => ({
    inner: i % 3 === 0,
    angle: (i / sportIcons.length) * Math.PI * 2,
    speed: 0.16 + (i % 3) * 0.05
  }))

  let drift = 0     // 0..1 across the page above the orbit section
  let capture = 0   // 0..1 as the icons gather
  let fade = 1

  // Refresh order matters here. The ecosystem scroller pins earlier on the
  // page and its spacer adds ~1 viewport of height; if this pin measures
  // itself first it lands that much too early. Left at the default priority,
  // ScrollTrigger refreshes pins in document order and gets it right.
  triggers.push(ScrollTrigger.create({
    trigger: orbitEl,
    start: 'top top',
    end: () => `+=${window.innerHeight * 1.6}`,
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress
      // Gather over the first third, hold the orbit for most of the pin so it
      // is actually worth watching, then release at the very end so nothing
      // is left hanging over the footer.
      capture = gsap.utils.clamp(0, 1, p / 0.32)
      fade = 1 - gsap.utils.clamp(0, 1, (p - 0.9) / 0.1)
    }
  }))

  // Drift spans everything above the orbit section. `endTrigger` lets
  // ScrollTrigger resolve that position itself — reading `orbitEl.offsetTop`
  // returns 0, because pinning re-parents the section inside a pin-spacer.
  triggers.push(ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    endTrigger: orbitEl,
    end: 'top top',
    scrub: true,
    invalidateOnRefresh: true,
    // Refreshes last, because its end depends on where every pin above it
    // finally settled.
    refreshPriority: -1,
    onUpdate: (self) => { drift = self.progress }
  }))

  ticker = (time, deltaMs) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cx = vw / 2
    const cy = vh / 2
    const base = Math.min(vw, vh)
    const tight = vw < 700
    const dt = Math.min(deltaMs, 50) / 1000

    for (let i = 0; i < iconEls.value.length; i++) {
      const el = iconEls.value[i]
      if (!el) continue
      const p = paths[i]
      const ring = rings[i]

      // --- drifting position ---
      const dx = (p.x0 + (p.x1 - p.x0) * drift
        + Math.sin(drift * Math.PI * 2 * p.waves + p.phase) * p.amp) * vw
      const dy = (p.y0 + (p.y1 - p.y0) * drift) * vh

      // --- orbital position (elliptical, for a sense of tilt) ---
      // Narrow screens get proportionally wider rings and a rounder ellipse:
      // the limiting dimension there is width, and there is vertical room to
      // spare, so a squashed orbit would just pile the icons onto the mark.
      ring.angle += ring.speed * dt
      const radius = base * (tight
        ? (ring.inner ? 0.24 : 0.4)
        : (ring.inner ? 0.17 : 0.29))
      const squash = tight ? 0.78 : 0.46
      const ox = cx + Math.cos(ring.angle) * radius
      const oy = cy + Math.sin(ring.angle) * radius * squash

      const k = capture
      gsap.set(el, {
        x: dx + (ox - dx) * k,
        y: dy + (oy - dy) * k,
        rotation: (drift * p.spin) * (1 - k),
        scale: p.scale + k * (1.25 - p.scale),
        opacity: (0.26 + k * 0.72) * fade
      })
    }

    if (centre.value) {
      gsap.set(centre.value, {
        opacity: capture * fade,
        scale: 0.82 + capture * 0.18
      })
    }
  }

  gsap.ticker.add(ticker)
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  if (ticker) gsap.ticker.remove(ticker)
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <div ref="layer" class="sport-layer" aria-hidden="true">
    <div ref="centre" class="sport-centre">
      <span class="sport-centre__halo" />
      <BrandMark class="sport-centre__mark" animated />
    </div>

    <!-- eslint-disable vue/no-v-html -- static geometry authored in sportIcons.js -->
    <svg
      v-for="(icon, i) in sportIcons"
      :key="icon.id"
      :ref="(el) => (iconEls[i] = el)"
      class="sport-icon"
      viewBox="0 0 24 24"
      v-html="icon.svg"
    />
  </div>
</template>

<style scoped>
.sport-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0; /* raised once the system is wired up, to avoid a flash at 0,0 */
}

.sport-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: clamp(30px, 4.4vw, 46px);
  height: clamp(30px, 4.4vw, 46px);
  /* Every icon is drawn as strokes, so one rule colours the whole set. */
  fill: none;
  stroke: var(--brand-bright);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  /* Anchor transforms on the icon's own centre so rotation and orbit agree. */
  margin: calc(clamp(30px, 4.4vw, 46px) / -2);
  will-change: transform, opacity;
}

.sport-centre {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  translate: -50% -50%;
  opacity: 0;
}

.sport-centre__mark { width: clamp(76px, 13vw, 128px); }

.sport-centre__halo {
  position: absolute;
  width: clamp(200px, 34vw, 340px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 160, 111, 0.3), transparent 68%);
}
</style>
