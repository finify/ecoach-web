<script setup>
import { asset } from '../data/site'

defineProps({ post: { type: Object, required: true } })

const nice = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<template>
  <RouterLink class="card-link" :to="`/news/${post.slug}`">
    <div class="card-link__media">
      <img
        v-if="post.image"
        :src="asset(post.image)"
        :alt="post.imageAlt || ''"
        loading="lazy"
        decoding="async"
      />
      <span v-else class="card-link__placeholder" aria-hidden="true">eCoach</span>
    </div>

    <div class="card-link__body">
      <span class="card-link__meta">
        {{ nice(post.date) }} · {{ post.readingMinutes }} min read
      </span>
      <h2 class="card-link__title">{{ post.title }}</h2>
      <p v-if="post.excerpt" class="card-link__excerpt">{{ post.excerpt }}</p>
      <span v-if="post.categories.length" class="card-link__tags">
        <span v-for="cat in post.categories.slice(0, 2)" :key="cat">{{ cat }}</span>
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.card-link {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  transition: background-color var(--d-base) var(--ease-out),
              border-color var(--d-base) var(--ease-out),
              transform var(--d-base) var(--ease-out);
}

.card-link:hover { background: var(--surface-2); border-color: var(--brand-line); transform: translateY(-3px); }

.card-link__media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-3);
  border-bottom: 1px solid var(--hairline);
}

.card-link__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--d-slow) var(--ease-out);
}

.card-link:hover .card-link__media img { transform: scale(1.03); }

.card-link__placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-tertiary);
}

.card-link__body { display: flex; flex-direction: column; flex: 1; padding: var(--s-6); }

.card-link__meta {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-bright);
}

.card-link__title {
  margin-top: var(--s-3);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.card-link__excerpt {
  flex: 1;
  margin-top: var(--s-3);
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-subtle);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-link__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: var(--s-6); }

.card-link__tags span {
  padding: 3px 9px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-tertiary);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
}
</style>
