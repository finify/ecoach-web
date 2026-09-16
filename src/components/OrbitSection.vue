<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsap'
import { sportIcons } from '../data/sportIcons'

/**
 * The anchor for SportSystem's finale. This section is pinned (by SportSystem,
 * which finds it via `#orbit`) while the drifting icons gather around the
 * eCoach mark.
 *
 * The middle of the section is deliberately left empty: the orbit renders in a
 * fixed layer *behind* `main`, so anything painted here would occlude it.
 */
const root = ref(null)

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%', once: true }
  })
})
</script>

<template>
  <section id="orbit" ref="root" class="orbit">
    <div class="shell orbit__inner">
      <header class="orbit__head">
        <span class="eyebrow" data-reveal>One platform</span>
        <h2 class="display-lg" data-reveal>Every sport, in orbit</h2>
      </header>

      <!-- middle intentionally empty — the orbit shows through from behind -->

      <footer class="orbit__foot">
        <p class="orbit__note" data-reveal>
          From football to swimming, 50+ organisations run their learning,
          compliance and membership on the same core.
        </p>
        <ul class="orbit__legend" data-reveal>
          <li v-for="icon in sportIcons.slice(0, 6)" :key="icon.id">{{ icon.label }}</li>
        </ul>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.orbit { position: relative; height: 100vh; min-height: 620px; }

.orbit__inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-block: clamp(48px, 9vh, 96px);
  text-align: center;
}

.orbit__head h2 { margin-top: var(--s-4); }

.orbit__foot { display: grid; gap: var(--s-6); justify-items: center; }

.orbit__note { max-width: 46ch; font-size: 14.5px; line-height: 1.6; color: var(--ink-subtle); }

.orbit__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.orbit__legend li {
  padding: 4px 11px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-tertiary);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
}
</style>
