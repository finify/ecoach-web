<script setup>
import { ref, computed } from 'vue'
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import posts from '../content/posts.json'

const root = ref(null)
const active = ref('All')

const categories = computed(() => {
  const counts = new Map()
  posts.forEach((p) => p.categories.forEach((c) => counts.set(c, (counts.get(c) || 0) + 1)))
  return ['All', ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)]
})

const shown = computed(() =>
  active.value === 'All' ? posts : posts.filter((p) => p.categories.includes(active.value))
)

useSeo({
  title: 'News & insight',
  description: `${posts.length} articles on sport learning, safeguarding, compliance and inclusion from the eCoach team.`
})

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out',
    scrollTrigger: { trigger: '[data-list]', start: 'top 88%', once: true }
  })
})
</script>

<template>
  <div ref="root">
    <PageHero
      eyebrow="News & insight"
      title="Writing from the team"
      :lead="`${posts.length} articles on sport learning, safeguarding, compliance and inclusion — plus the client work behind them.`"
    />

    <section class="section list-section">
      <div class="shell">
        <div class="filters" role="group" aria-label="Filter by category">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            :class="{ 'is-on': active === cat }"
            :aria-pressed="active === cat"
            @click="active = cat"
          >
            {{ cat }}
          </button>
        </div>

        <p class="count">{{ shown.length }} article{{ shown.length === 1 ? '' : 's' }}</p>

        <div class="list" data-list>
          <ArticleCard v-for="post in shown" :key="post.slug" :post="post" data-reveal />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: var(--s-2); }

.filters button {
  padding: 7px 15px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-subtle);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
  transition: background-color var(--d-base) var(--ease-out),
              color var(--d-base) var(--ease-out),
              border-color var(--d-base) var(--ease-out);
}

.filters button:hover { color: var(--ink); }
.filters button.is-on { background: var(--brand); color: #fff; border-color: var(--brand); }

.count { margin-top: var(--s-6); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-tertiary); }

.list {
  display: grid;
  gap: var(--s-4);
  margin-top: var(--s-4);
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
}
</style>
