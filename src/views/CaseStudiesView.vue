<script setup>
import { ref, computed } from 'vue'
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import posts from '../content/posts.json'

const root = ref(null)
const studies = computed(() =>
  posts.filter((p) => p.categories.includes('Case Studies') || /case study/i.test(p.title))
)

useSeo({
  title: 'Case studies',
  description: 'How governing bodies and clubs use eCoach — from the Welsh Rugby Union to Sport Northern Ireland.'
})

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out',
    scrollTrigger: { trigger: '[data-list]', start: 'top 88%', once: true }
  })
})
</script>

<template>
  <div ref="root">
    <PageHero
      eyebrow="Case studies"
      title="The work, in their words"
      :lead="`${studies.length} projects with governing bodies, clubs and public bodies — what they needed, what we built, and what happened next.`"
    >
      <template #actions>
        <RouterLink class="btn btn--ghost" to="/testimonials">Read testimonials</RouterLink>
      </template>
    </PageHero>

    <section class="section">
      <div class="shell">
        <div class="list" data-list>
          <ArticleCard v-for="study in studies" :key="study.slug" :post="study" data-reveal />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.list { display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
</style>
