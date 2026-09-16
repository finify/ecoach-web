<script setup>
import { ref } from 'vue'
import BrandMark from './BrandMark.vue'
import { useGsapContext } from '../composables/useGsap'

const root = ref(null)

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.07,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 80%', once: true }
  })
})
</script>

<template>
  <section id="contact" ref="root" class="section cta">
    <div class="shell">
      <div class="cta__card">
        <BrandMark class="cta__mark" animated />
        <h2 class="display-lg" data-reveal>Build the platform your sport deserves</h2>
        <p class="lead" data-reveal>
          Book a walkthrough and one of the team will show you the blocks in action, mapped to how
          your organisation actually works.
        </p>
        <div class="cta__actions" data-reveal>
          <a class="btn btn--primary btn--lg" href="https://e-coach.co.uk/get-in-touch/">
            Book your walkthrough
            <span class="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a class="btn btn--ghost btn--lg" href="#builder">Estimate your savings</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta__card {
  position: relative;
  overflow: hidden;
  padding: clamp(40px, 7vw, 80px) var(--gutter);
  text-align: center;
  background:
    radial-gradient(90% 120% at 50% 0%, rgba(0, 160, 111, 0.16), transparent 62%),
    var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-2xl);
}

.cta__mark { width: 54px; margin: 0 auto var(--s-6); }

.cta__card h2 { max-width: 20ch; margin-inline: auto; }

.cta__card .lead { max-width: 54ch; margin: var(--s-6) auto 0; }

.cta__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-3); margin-top: var(--s-8); }
</style>
