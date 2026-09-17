<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsap'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' }
})

const root = ref(null)

useGsapContext(root, (ctx, gsap) => {
  gsap.from('[data-hero-in]', {
    opacity: 0,
    y: 18,
    duration: 0.75,
    stagger: 0.07,
    ease: 'expo.out'
  })
})
</script>

<template>
  <header ref="root" class="page-hero">
    <div class="page-hero__glow" aria-hidden="true" />
    <div class="shell">
      <span v-if="eyebrow" class="eyebrow" data-hero-in>{{ eyebrow }}</span>
      <h1 class="display-lg" data-hero-in>{{ title }}</h1>
      <p v-if="lead" class="lead page-hero__lead" data-hero-in>{{ lead }}</p>
      <div v-if="$slots.actions" class="page-hero__actions" data-hero-in>
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-hero {
  position: relative;
  padding-block: clamp(120px, 16vh, 180px) clamp(40px, 6vw, 64px);
  overflow: hidden;
}

.page-hero__glow {
  position: absolute;
  inset: -40% 0 auto;
  height: 150%;
  background: radial-gradient(60% 50% at 50% 40%, rgba(0, 160, 111, 0.16), transparent 70%);
  pointer-events: none;
}

.page-hero .shell { position: relative; }
.page-hero h1 { margin-top: var(--s-4); max-width: 18ch; }
.page-hero__lead { max-width: 60ch; margin-top: var(--s-6); }
.page-hero__actions { display: flex; flex-wrap: wrap; gap: var(--s-3); margin-top: var(--s-8); }
</style>
