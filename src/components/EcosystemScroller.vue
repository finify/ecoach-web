<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsap'
import { ecosystem } from '../data/site'

const root = ref(null)
const track = ref(null)

useGsapContext(root, (ctx, gsap) => {
  const mm = gsap.matchMedia()

  // Horizontal-on-scroll only where there is room for it. Below 900px the
  // track stays a normal swipeable row — hijacking scroll on a phone costs
  // more than the effect is worth.
  mm.add('(min-width: 900px)', () => {
    const distance = () => track.value.scrollWidth - root.value.offsetWidth

    const tween = gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'center center',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    return () => tween.kill()
  })

  gsap.to('[data-reveal]', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 80%', once: true }
  })
})
</script>

<template>
  <section id="blocks" ref="root" class="scroller">
    <div class="shell">
      <header class="scroller__head">
        <span class="eyebrow" data-reveal>Seamlessly integrated. Infinitely flexible.</span>
        <h2 class="display-lg" data-reveal>Your platform, your way</h2>
        <p class="lead" data-reveal>
          Unlike competitors who offer separate systems, eCoach delivers a unified platform where
          every block works together. Start with just the LMS or choose the full ecosystem — blocks
          integrate seamlessly when you're ready to expand.
        </p>
      </header>
    </div>

    <div class="scroller__viewport">
      <ul ref="track" class="scroller__track">
        <li v-for="(item, i) in ecosystem" :key="item.title" class="block-card">
          <span class="block-card__index">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="headline">{{ item.title }}</h3>
          <ul class="block-card__lines">
            <li v-for="line in item.lines" :key="line">{{ line }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.scroller { padding-block: clamp(64px, 11vw, 128px); overflow: hidden; }

.scroller__head { max-width: 62ch; }
.scroller__head h2 { margin: var(--s-4) 0 var(--s-6); }

.scroller__viewport { margin-top: clamp(40px, 6vw, 72px); }

.scroller__track {
  display: flex;
  gap: var(--s-6);
  margin: 0;
  padding-inline: var(--gutter);
  list-style: none;
  width: max-content;
}

.block-card {
  flex: none;
  width: min(84vw, 360px);
  display: flex;
  flex-direction: column;
  padding: var(--s-8);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  transition: background-color var(--d-base) var(--ease-out),
              border-color var(--d-base) var(--ease-out);
}

.block-card:hover { background: var(--surface-2); border-color: var(--brand-line); }

.block-card__index {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--brand-bright);
}

.block-card h3 { margin: var(--s-6) 0 var(--s-6); }

.block-card__lines { display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }

.block-card__lines li {
  position: relative;
  padding-left: var(--s-6);
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--ink-subtle);
}

/* A chalk tick, echoing the markings on the brand mark. */
.block-card__lines li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 10px;
  height: 1px;
  background: var(--brand-line);
}

/* Below the pin breakpoint the row becomes a normal swipe. */
@media (max-width: 899px) {
  .scroller__viewport {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .scroller__viewport::-webkit-scrollbar { display: none; }
  .block-card { scroll-snap-align: center; }
}

@media (min-width: 900px) {
  .scroller__track { padding-inline: max(var(--gutter), calc((100vw - var(--maxw)) / 2 + var(--gutter))); }
}
</style>
