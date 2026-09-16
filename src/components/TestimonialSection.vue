<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsap'
import { testimonial } from '../data/site'

const root = ref(null)

useGsapContext(root, (ctx, gsap) => {
  // The quote resolves word by word as it enters — slow enough to read as
  // deliberate, fast enough not to hold the reader up.
  gsap.to('[data-word]', {
    opacity: 1,
    y: 0,
    duration: 0.55,
    stagger: 0.016,
    ease: 'power2.out',
    scrollTrigger: { trigger: root.value, start: 'top 72%', once: true }
  })

  gsap.to('[data-reveal]', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 60%', once: true }
  })
})

const words = testimonial.quote.split(' ')
</script>

<template>
  <section id="customers" ref="root" class="section quote">
    <div class="shell quote__inner">
      <blockquote class="quote__text display-md">
        <span v-for="(word, i) in words" :key="i" class="quote__word"><span data-word>{{ word }}</span>&nbsp;</span>
      </blockquote>

      <figcaption class="quote__by" data-reveal>
        <span class="quote__name">{{ testimonial.name }}</span>
        <span class="quote__org">{{ testimonial.org }}</span>
      </figcaption>
    </div>
  </section>
</template>

<style scoped>
.quote__inner { max-width: 74ch; }

.quote__text { margin: 0; font-weight: 500; letter-spacing: -0.025em; line-height: 1.32; }

.quote__text::before {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  margin-bottom: var(--s-8);
  background: var(--brand);
}

.quote__word { display: inline-block; overflow: hidden; }

/* Resting state for the per-word entrance; the guard keeps the quote readable
   if GSAP never runs. */
.js-ready .quote__word > span { display: inline-block; opacity: 0; transform: translateY(0.5em); }

.quote__by { display: flex; align-items: center; gap: var(--s-3); margin-top: var(--s-8); }

.quote__name { font-size: 14px; font-weight: 600; }

.quote__org {
  padding-left: var(--s-3);
  border-left: 1px solid var(--hairline-strong);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--ink-subtle);
}

@media (prefers-reduced-motion: reduce) {
  .js-ready .quote__word > span { opacity: 1; transform: none; }
}
</style>
