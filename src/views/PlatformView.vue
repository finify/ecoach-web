<script setup>
import { ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import { blockPages } from '../data/blockPages'

const root = ref(null)
const gbp = (n) => '£' + n.toLocaleString('en-GB')

useSeo({
  title: 'The platform — 10 blocks for sport',
  description: 'Learning, membership, compliance, safeguarding, volunteering, facilities, events, engagement, directories and content. Build the platform your organisation actually needs.'
})

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out',
    scrollTrigger: { trigger: '[data-grid]', start: 'top 85%', once: true }
  })
})
</script>

<template>
  <div ref="root">
    <PageHero
      eyebrow="The platform"
      title="Ten blocks. One platform."
      lead="Start with the flagship LMS or combine any of the blocks below. Every one shares the same members, roles and reporting — so the whole thing behaves like a single system, because it is one."
    >
      <template #actions>
        <RouterLink class="btn btn--primary" to="/contact">Book a walkthrough<span class="btn__arrow" aria-hidden="true">→</span></RouterLink>
        <RouterLink class="btn btn--ghost" to="/#builder">Estimate your savings</RouterLink>
      </template>
    </PageHero>

    <section class="section">
      <div class="shell">
        <div class="grid" data-grid>
          <RouterLink
            v-for="block in blockPages"
            :key="block.slug"
            class="block"
            :to="`/platform/${block.slug}`"
            data-reveal
          >
            <span v-if="block.popular" class="block__flag">Popular</span>
            <h2 class="headline">{{ block.name }}</h2>
            <p class="block__intro">{{ block.intro }}</p>
            <span class="block__foot">
              <span class="block__price">{{ gbp(block.price) }}</span>
              <span class="block__go" aria-hidden="true">→</span>
            </span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid { display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }

.block {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--s-6);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  transition: background-color var(--d-base) var(--ease-out),
              border-color var(--d-base) var(--ease-out),
              transform var(--d-base) var(--ease-out);
}

.block:hover { background: var(--surface-2); border-color: var(--brand-line); transform: translateY(-3px); }

.block__flag {
  align-self: flex-start;
  margin-bottom: var(--s-3);
  padding: 3px 9px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-bright);
  background: var(--brand-wash);
  border-radius: var(--r-pill);
}

.block h2 { font-size: 1.15rem; }

.block__intro {
  flex: 1;
  margin-top: var(--s-3);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-subtle);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.block__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--s-6);
  padding-top: var(--s-4);
  border-top: 1px solid var(--hairline);
}

.block__price { font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); }
.block__go { color: var(--brand-bright); transition: transform var(--d-base) var(--ease-out); }
.block:hover .block__go { transform: translateX(4px); }
</style>
