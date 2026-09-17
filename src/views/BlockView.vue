<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageHero from '../components/PageHero.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import { blockPages, blockBySlug } from '../data/blockPages'
import { asset } from '../data/site'
import courses from '../content/courses.json'

const route = useRoute()
const root = ref(null)
const block = computed(() => blockBySlug(route.params.slug))
const others = computed(() => blockPages.filter((b) => b.slug !== route.params.slug).slice(0, 4))
const gbp = (n) => '£' + n.toLocaleString('en-GB')

useSeo({
  title: computed(() => block.value?.name || 'Platform block'),
  description: computed(() => block.value?.intro)
})

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 60%', once: true }
  })
})
</script>

<template>
  <div v-if="block" ref="root">
    <PageHero :eyebrow="block.eyebrow" :title="block.name" :lead="block.intro">
      <template #actions>
        <RouterLink class="btn btn--primary" to="/contact">Book a walkthrough<span class="btn__arrow" aria-hidden="true">→</span></RouterLink>
        <RouterLink class="btn btn--ghost" to="/platform">All 10 blocks</RouterLink>
      </template>
    </PageHero>

    <section class="section block-body">
      <div class="shell">
        <div class="cols">
          <div>
            <h2 class="display-md" data-reveal>What it does</h2>
            <ul class="bullets" data-reveal>
              <li v-for="line in block.bullets" :key="line">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7-8" /></svg>
                {{ line }}
              </li>
            </ul>

            <template v-if="block.features.length">
              <h2 class="display-md feature-head" data-reveal>Inside the block</h2>
              <ul class="features" data-reveal>
                <li v-for="feature in block.features" :key="feature">{{ feature }}</li>
              </ul>
            </template>
          </div>

          <aside class="side" data-reveal>
            <div class="price-card">
              <span class="price-card__label">From</span>
              <span class="price-card__value">{{ gbp(block.price) }}</span>
              <p class="price-card__note">One platform fee — no per-user charges, however many people you onboard.</p>
              <RouterLink class="btn btn--primary price-card__cta" to="/#builder">
                Add to your quote<span class="btn__arrow" aria-hidden="true">→</span>
              </RouterLink>
            </div>

            <img
              v-if="block.image"
              class="side__shot"
              :src="asset(block.image)"
              :alt="`${block.name} in the eCoach platform`"
              :width="block.imageW"
              :height="block.imageH"
              loading="lazy"
              decoding="async"
            />
          </aside>
        </div>

        <div v-if="block.showCourses" class="courses" data-reveal>
          <h2 class="display-md">In the library</h2>
          <p class="lead courses__lead">{{ courses.length }} courses built with subject experts, ready to launch under your own branding.</p>
          <ul>
            <li v-for="course in courses" :key="course">{{ course }}</li>
          </ul>
        </div>

        <nav class="more" aria-label="Other blocks">
          <h2 class="headline" data-reveal>Pairs well with</h2>
          <div class="more__grid">
            <RouterLink v-for="other in others" :key="other.slug" :to="`/platform/${other.slug}`" data-reveal>
              {{ other.name }}<span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--s-12); align-items: start; }

.bullets { display: grid; gap: var(--s-4); margin: var(--s-6) 0 0; padding: 0; list-style: none; }

.bullets li { display: flex; gap: var(--s-3); font-size: 15.5px; line-height: 1.6; color: var(--ink-muted); }

.bullets svg {
  flex: none;
  width: 19px; height: 19px;
  margin-top: 3px;
  padding: 3px;
  border-radius: 50%;
  background: var(--brand-wash);
  fill: none; stroke: var(--brand-bright); stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round;
}

.feature-head { margin-top: var(--s-16); }

.features { display: flex; flex-wrap: wrap; gap: var(--s-2); margin: var(--s-6) 0 0; padding: 0; list-style: none; }

.features li {
  padding: 7px 14px;
  font-size: 13px;
  color: var(--ink-muted);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
}

.side { display: grid; gap: var(--s-6); }

.price-card {
  display: grid;
  gap: var(--s-2);
  padding: var(--s-6);
  background: var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-xl);
}

.price-card__label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-subtle); }
.price-card__value { font-family: var(--font-display); font-size: 2.1rem; font-weight: 600; letter-spacing: -0.03em; color: var(--brand-bright); }
.price-card__note { font-size: 13px; line-height: 1.55; color: var(--ink-tertiary); }
.price-card__cta { margin-top: var(--s-4); }

.side__shot { border: 1px solid var(--hairline); border-radius: var(--r-lg); }

.courses { margin-top: var(--s-16); }
.courses__lead { margin-top: var(--s-3); }
.courses ul { display: grid; gap: var(--s-2); margin: var(--s-6) 0 0; padding: 0; list-style: none; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }

.courses li {
  padding: 12px var(--s-4);
  font-size: 14px;
  color: var(--ink-muted);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
}

.more { margin-top: var(--s-16); padding-top: var(--s-8); border-top: 1px solid var(--hairline); }
.more__grid { display: grid; gap: var(--s-3); grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); margin-top: var(--s-6); }

.more__grid a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-4);
  padding: var(--s-4);
  font-size: 14px;
  font-weight: 500;
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-lg);
  transition: border-color var(--d-base) var(--ease-out), background-color var(--d-base) var(--ease-out);
}

.more__grid a:hover { background: var(--surface-2); border-color: var(--brand-line); }
.more__grid span { color: var(--brand-bright); }

@media (min-width: 950px) {
  .cols { grid-template-columns: 1.5fr 0.85fr; }
  .side { position: sticky; top: 92px; }
}
</style>
