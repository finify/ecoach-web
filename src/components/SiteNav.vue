<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BrandMark from './BrandMark.vue'
import { nav, asset } from '../data/site'

const scrolled = ref(false)
const menuOpen = ref(false)

const onScroll = () => { scrolled.value = window.scrollY > 24 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const go = (href) => {
  menuOpen.value = false
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <header class="nav" :class="{ 'nav--solid': scrolled }">
    <div class="nav__inner shell">
      <a class="lockup" href="#top" aria-label="eCoach — home" @click.prevent="go('#top')">
        <BrandMark class="lockup__mark" animated />
        <img class="lockup__word" :src="asset('media/brand/wordmark.png')" alt="eCoach" />
      </a>

      <nav class="nav__links" aria-label="Primary">
        <a v-for="item in nav" :key="item.href" :href="item.href" @click.prevent="go(item.href)">
          {{ item.label }}
        </a>
      </nav>

      <div class="nav__actions">
        <a class="btn btn--primary" href="#contact" @click.prevent="go('#contact')">
          Book a walkthrough
          <span class="btn__arrow" aria-hidden="true">→</span>
        </a>
        <button
          class="nav__burger"
          :aria-expanded="menuOpen"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <span :class="{ 'is-open': menuOpen }" />
        </button>
      </div>
    </div>

    <div class="nav__sheet" :class="{ 'is-open': menuOpen }">
      <div class="nav__sheet-inner">
        <a v-for="item in nav" :key="item.href" :href="item.href" @click.prevent="go(item.href)">
          {{ item.label }}
        </a>
      </div>
    </div>
  </header>
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

.lockup { display: flex; align-items: center; gap: 10px; }
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

.nav__sheet {
  display: grid;
  overflow: hidden;
  grid-template-rows: 0fr;
  background: rgba(5, 8, 7, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: grid-template-rows var(--d-slow) var(--ease-drawer);
}

.nav__sheet.is-open { grid-template-rows: 1fr; border-bottom: 1px solid var(--hairline); }

/* The single wrapper is the one collapsing row; it must be able to shrink
   below its content height, hence min-height: 0 plus overflow hidden. */
.nav__sheet-inner { min-height: 0; overflow: hidden; }

.nav__sheet a {
  display: block;
  padding: 14px var(--gutter);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.02em;
  border-top: 1px solid var(--hairline);
}

.nav__sheet a:first-child { border-top: none; }

@media (min-width: 900px) {
  .nav__links { display: flex; }
  .nav__actions .btn { display: inline-flex; }
  .nav__burger { display: none; }
  .nav__sheet { display: none; }
}
</style>
