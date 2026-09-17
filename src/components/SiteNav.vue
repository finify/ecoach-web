<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import BrandMark from './BrandMark.vue'
import { gsap, prefersReducedMotion } from '../composables/useGsap'
import { useRouter } from 'vue-router'
import { nav, asset } from '../data/site'

const router = useRouter()
const scrolled = ref(false)
const menuOpen = ref(false)
const panel = ref(null)

let tl = null
let desktop = null

const onScroll = () => { scrolled.value = window.scrollY > 24 }
const onKey = (e) => { if (e.key === 'Escape' && menuOpen.value) menuOpen.value = false }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)

  // A menu left open while the viewport grows past the breakpoint would be
  // stranded off-screen with the body still locked.
  desktop = window.matchMedia('(min-width: 900px)')
  desktop.addEventListener('change', (e) => { if (e.matches) menuOpen.value = false })

  if (prefersReducedMotion()) return

  // The panel parks off-screen via a CSS `translateX(100%)`, which GSAP reads
  // back as a plain `x: 390px`. Without this normalising set, tweening
  // `xPercent` to 0 leaves that pixel offset in place and the panel never
  // moves. Handing GSAP the transform in its own terms makes it the sole
  // owner from here on.
  gsap.set(panel.value, { xPercent: 100, x: 0 })

  // Built once and scrubbed with play/reverse rather than rebuilt per toggle,
  // so an interrupted open reverses from wherever it got to instead of
  // snapping to the end first.
  tl = gsap.timeline({ paused: true })
    .to(panel.value, { xPercent: 0, duration: 0.5, ease: 'expo.out' })
    .fromTo(
      '[data-menu-label]',
      { yPercent: 115 },
      { yPercent: 0, duration: 0.55, stagger: 0.055, ease: 'expo.out' },
      0.12
    )
    .fromTo(
      '[data-menu-index]',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, stagger: 0.055, ease: 'power2.out' },
      0.2
    )
    .fromTo(
      '[data-menu-foot]',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'expo.out' },
      0.34
    )
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  tl?.kill()
  document.body.style.overflow = ''
})

watch(menuOpen, (open) => {
  // Stop the page behind the overlay from scrolling under it.
  document.body.style.overflow = open ? 'hidden' : ''
  if (!tl) return
  open ? tl.play() : tl.reverse()
})

// Router navigation handles the scrolling now (see scrollBehavior in main.js);
// this just gets the panel out of the way first so the two don't fight.
const close = () => { menuOpen.value = false }
</script>

<template>
  <header class="nav" :class="{ 'nav--solid': scrolled || menuOpen }">
    <div class="nav__inner shell">
      <RouterLink class="lockup" to="/" aria-label="eCoach — home" @click="close">
        <BrandMark class="lockup__mark" animated />
        <img class="lockup__word" :src="asset('media/brand/wordmark.png')" alt="eCoach" />
      </RouterLink>

      <nav class="nav__links" aria-label="Primary">
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="nav__actions">
        <RouterLink class="btn btn--primary" to="/contact">
          Book a walkthrough
          <span class="btn__arrow" aria-hidden="true">→</span>
        </RouterLink>
        <button
          class="nav__burger"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <span :class="{ 'is-open': menuOpen }" />
        </button>
      </div>
    </div>
  </header>

  <!-- Sits below the header in z-order, so the logo and the burger-turned-X
       stay visible on top of it and the burger doubles as the close control. -->
  <div
    id="mobile-menu"
    ref="panel"
    class="menu"
    :class="{ 'is-open': menuOpen }"
    :inert="!menuOpen"
  >
    <div class="menu__glow" aria-hidden="true" />
    <BrandMark class="menu__watermark" animated aria-hidden="true" />

    <nav class="menu__nav" aria-label="Mobile">
      <RouterLink
        v-for="(item, i) in nav"
        :key="item.to"
        class="menu__item"
        :to="item.to"
        @click="close"
      >
        <span class="menu__index" data-menu-index>{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="menu__mask">
          <span class="menu__label" data-menu-label>{{ item.label }}</span>
        </span>
        <span class="menu__chevron" aria-hidden="true">→</span>
      </RouterLink>
    </nav>

    <div class="menu__foot">
      <RouterLink class="btn btn--primary menu__cta" to="/contact" data-menu-foot @click="close">
        Book a walkthrough
        <span class="btn__arrow" aria-hidden="true">→</span>
      </RouterLink>
      <p class="menu__tagline" data-menu-foot>Sporting excellence for all.</p>
    </div>
  </div>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  transition: background-color var(--d-base) var(--ease-out),
              border-color var(--d-base) var(--ease-out);
  border-bottom: 1px solid transparent;
}

.nav--solid {
  background: rgba(5, 8, 7, 0.72);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border-bottom-color: var(--hairline);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  height: 68px;
}

.lockup { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
.lockup__mark { width: 30px; }
/* The wordmark artwork is black; on this canvas it needs to read white. */
.lockup__word { width: 92px; filter: brightness(0) invert(1); }

.nav__links { display: none; gap: var(--s-6); }

.nav__links a {
  position: relative;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-muted);
  transition: color var(--d-base) var(--ease-out);
}

.nav__links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 1px;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--d-base) var(--ease-out);
}

.nav__links a:hover { color: var(--ink); }
.nav__links a:hover::after { transform: scaleX(1); }

/* vue-router adds these; the active page keeps its underline drawn. */
.nav__links a.router-link-active { color: var(--ink); }
.nav__links a.router-link-active::after { transform: scaleX(1); }

.nav__actions { display: flex; align-items: center; gap: var(--s-3); }
.nav__actions .btn { display: none; }

.nav__burger { width: 40px; height: 40px; display: grid; place-items: center; }

.nav__burger span,
.nav__burger span::before,
.nav__burger span::after {
  content: '';
  display: block;
  width: 20px;
  height: 1.5px;
  background: var(--ink);
  border-radius: 2px;
  transition: transform var(--d-base) var(--ease-out), opacity var(--d-fast) var(--ease-out);
}

.nav__burger span { position: relative; }
.nav__burger span::before { position: absolute; top: -6px; }
.nav__burger span::after { position: absolute; top: 6px; }

.nav__burger span.is-open { background: transparent; }
.nav__burger span.is-open::before { transform: translateY(6px) rotate(45deg); }
.nav__burger span.is-open::after { transform: translateY(-6px) rotate(-45deg); }

/* ==========================================================================
   Full-screen menu
   ========================================================================== */

.menu {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  /* dvh, so the panel matches the viewport as mobile browser chrome hides. */
  height: 100dvh;
  padding: calc(68px + var(--s-8)) var(--gutter) var(--s-12);
  overflow: hidden;
  background: var(--canvas);
  transform: translateX(100%);
  pointer-events: none;
}

.menu.is-open { pointer-events: auto; }

.menu__glow {
  position: absolute;
  inset: auto -30% -30% -30%;
  height: 70%;
  background: radial-gradient(50% 50% at 50% 100%, rgba(0, 160, 111, 0.28), transparent 70%);
  pointer-events: none;
}

.menu__watermark {
  position: absolute;
  right: -14%;
  top: 16%;
  width: 78%;
  opacity: 0.07;
  pointer-events: none;
}

/* Auto margins above and below split the free space evenly, which optically
   centres the links while still pinning the footer to the bottom edge. */
.menu__nav {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-block: auto;
}

.menu__item {
  display: flex;
  align-items: baseline;
  gap: var(--s-4);
  padding: var(--s-4) 0;
  border-bottom: 1px solid var(--hairline);
}

.menu__item:first-child { border-top: 1px solid var(--hairline); }

.menu__index {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--brand-bright);
}

/* Each label rises out of its own clipping box — the same masked reveal the
   hero headline uses, so the menu feels part of the same system. */
.menu__mask { flex: 1; overflow: hidden; padding-bottom: 0.08em; }

.menu__label {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 11vw, 2.75rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.menu__chevron {
  font-size: 18px;
  color: var(--ink-tertiary);
  transition: transform var(--d-base) var(--ease-out), color var(--d-base) var(--ease-out);
}

.menu__item:active .menu__chevron { transform: translateX(4px); color: var(--brand-bright); }

.menu__foot { position: relative; display: grid; gap: var(--s-6); }

.menu__cta { width: 100%; padding: 15px 26px; font-size: 15px; }

.menu__tagline {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--brand-bright);
}

/* Without JS or with reduced motion the panel still has to open and close;
   these rules do it without any transform animation. */
@media (prefers-reduced-motion: reduce) {
  .menu { transition: none; }
  .menu.is-open { transform: translateX(0); }
}

@media (min-width: 900px) {
  .nav__links { display: flex; }
  .nav__actions .btn { display: inline-flex; }
  .nav__burger { display: none; }
  .menu { display: none; }
}
</style>
