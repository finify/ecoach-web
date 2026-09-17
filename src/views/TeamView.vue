<script setup>
import { ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import { asset } from '../data/site'
import team from '../content/team.json'

const root = ref(null)

useSeo({
  title: 'The team',
  description: 'The people behind eCoach — learning design, marketing and delivery for sport.'
})

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'expo.out',
    scrollTrigger: { trigger: '[data-list]', start: 'top 85%', once: true }
  })
})
</script>

<template>
  <div ref="root">
    <PageHero
      eyebrow="The team"
      title="The people behind eCoach"
      lead="A small team of learning designers, technologists and sport people — building the platform and the courses that run on it."
    />

    <section class="section">
      <div class="shell">
        <div class="team" data-list>
          <article v-for="person in team" :key="person.name" class="person" data-reveal>
            <div class="person__photo">
              <img v-if="person.image" :src="asset(person.image)" :alt="person.name" loading="lazy" decoding="async" />
            </div>
            <div class="person__body">
              <h2 class="headline">{{ person.name }}</h2>
              <p class="person__role">{{ person.role }}</p>
              <p class="person__bio">{{ person.bio }}</p>
              <a v-if="person.email" class="person__mail" :href="`mailto:${person.email}`">
                {{ person.email }}<span class="btn__arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.team { display: grid; gap: var(--s-12); }

.person { display: grid; gap: var(--s-6); align-items: start; }

.person__photo {
  overflow: hidden;
  aspect-ratio: 1;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
}

.person__photo img { width: 100%; height: 100%; object-fit: cover; }

.person__role {
  margin-top: var(--s-2);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-bright);
}

.person__bio { margin-top: var(--s-4); font-size: 15px; line-height: 1.68; color: var(--ink-muted); }

.person__mail {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-6);
  padding-bottom: 3px;
  font-size: 14px;
  font-weight: 500;
  color: var(--brand-bright);
  border-bottom: 1px solid var(--brand-line);
  transition: border-color var(--d-base) var(--ease-out);
}

.person__mail:hover { border-bottom-color: var(--brand-bright); }
.person__mail .btn__arrow { transition: transform var(--d-base) var(--ease-out); }
.person__mail:hover .btn__arrow { transform: translateX(3px); }

@media (min-width: 720px) {
  .person { grid-template-columns: 260px 1fr; gap: var(--s-8); }
}
</style>
