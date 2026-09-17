<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ArticleCard from '../components/ArticleCard.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import { asset, withAssetPaths } from '../data/site'
import posts from '../content/posts.json'
import articles from '../content/articles.json'

const route = useRoute()
const root = ref(null)
const post = computed(() => posts.find((p) => p.slug === route.params.slug))

/** Prefer articles sharing a category, then fall back to the most recent. */
const related = computed(() => {
  if (!post.value) return []
  const cats = new Set(post.value.categories)
  const scored = posts
    .filter((p) => p.slug !== post.value.slug)
    .map((p) => ({ p, hits: p.categories.filter((c) => cats.has(c)).length }))
    .sort((a, b) => b.hits - a.hits || b.p.date.localeCompare(a.p.date))
  return scored.slice(0, 3).map((x) => x.p)
})

useSeo({
  title: computed(() => post.value?.title),
  description: computed(() => post.value?.excerpt),
  image: computed(() => post.value?.image),
  type: 'article'
})

const nice = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

useGsapContext(root, (ctx, gsap) => {
  gsap.from('[data-in]', { opacity: 0, y: 16, duration: 0.7, stagger: 0.06, ease: 'expo.out' })
})
</script>

<template>
  <article v-if="post" ref="root" class="article">
    <div class="article__glow" aria-hidden="true" />

    <header class="shell article__head">
      <RouterLink class="article__back" to="/news" data-in>
        <span aria-hidden="true">←</span> All articles
      </RouterLink>
      <span class="article__meta" data-in>
        {{ nice(post.date) }} · {{ post.readingMinutes }} min read
      </span>
      <h1 class="display-lg" data-in>{{ post.title }}</h1>
      <div v-if="post.categories.length" class="article__tags" data-in>
        <span v-for="cat in post.categories" :key="cat">{{ cat }}</span>
      </div>
    </header>

    <figure v-if="post.image" class="shell article__hero" data-in>
      <img :src="asset(post.image)" :alt="post.imageAlt || ''" loading="eager" />
    </figure>

    <div class="shell">
      <!-- eslint-disable vue/no-v-html -- sanitised at migration to a fixed tag allowlist -->
      <div class="prose article__body" v-html="withAssetPaths(articles[post.slug])" />

      <aside class="article__cta">
        <h2 class="headline">Run your sport on eCoach</h2>
        <p>Learning, compliance and membership in one platform — trusted by 50+ organisations across UK sport.</p>
        <RouterLink class="btn btn--primary" to="/contact">
          Book a walkthrough<span class="btn__arrow" aria-hidden="true">→</span>
        </RouterLink>
      </aside>

      <nav v-if="related.length" class="article__related" aria-label="Related articles">
        <h2 class="headline">Keep reading</h2>
        <div class="article__related-grid">
          <ArticleCard v-for="item in related" :key="item.slug" :post="item" />
        </div>
      </nav>
    </div>
  </article>
</template>

<style scoped>
.article { position: relative; padding-block: clamp(110px, 15vh, 160px) clamp(64px, 10vw, 112px); }

.article__glow {
  position: absolute;
  inset: 0 0 auto;
  height: 60vh;
  background: radial-gradient(60% 60% at 50% 0%, rgba(0, 160, 111, 0.14), transparent 70%);
  pointer-events: none;
}

.article__head { position: relative; max-width: 780px; }

.article__back {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-subtle);
  transition: color var(--d-base) var(--ease-out);
}

.article__back:hover { color: var(--brand-bright); }

.article__meta {
  display: block;
  margin-top: var(--s-8);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-bright);
}

.article__head h1 { margin-top: var(--s-4); }

.article__tags { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-6); }

.article__tags span {
  padding: 4px 11px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-tertiary);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
}

.article__hero { max-width: 780px; margin: var(--s-12) auto 0; }

.article__hero img {
  width: 100%;
  height: auto;
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
}

.article__body { max-width: 720px; margin-top: var(--s-12); }

.article__cta {
  max-width: 720px;
  margin: var(--s-16) 0 0;
  padding: var(--s-8);
  text-align: center;
  background: radial-gradient(90% 120% at 50% 0%, rgba(0, 160, 111, 0.14), transparent 65%), var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-2xl);
}

.article__cta p { max-width: 46ch; margin: var(--s-3) auto var(--s-6); font-size: 14.5px; color: var(--ink-subtle); }

.article__related { margin-top: var(--s-16); padding-top: var(--s-8); border-top: 1px solid var(--hairline); }

.article__related-grid {
  display: grid;
  gap: var(--s-4);
  margin-top: var(--s-6);
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/* Centre the reading column on wide screens without moving the related grid. */
@media (min-width: 900px) {
  .article__head,
  .article__body,
  .article__cta { margin-inline: auto; }
}
</style>
