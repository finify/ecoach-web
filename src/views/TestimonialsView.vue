<script setup>
import { ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import { clients, testimonial, asset } from '../data/site'

const root = ref(null)

useSeo({
  title: 'Testimonials',
  description: 'What sports organisations say about working with eCoach.'
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
      eyebrow="Testimonials"
      title="What our clients say"
      lead="From national governing bodies to grassroots clubs — 50+ organisations across UK and Irish sport run on eCoach."
    />

    <section class="section">
      <div class="shell">
        <figure class="quote" data-reveal>
          <blockquote>{{ testimonial.quote }}</blockquote>
          <figcaption>
            <span class="quote__name">{{ testimonial.name }}</span>
            <span class="quote__org">{{ testimonial.org }}</span>
          </figcaption>
        </figure>

        <h2 class="display-md clients__head" data-reveal>Trusted by</h2>
        <ul class="clients" data-list>
          <li v-for="client in clients" :key="client.file" data-reveal>
            <img :src="asset(`media/clients/${client.file}.webp`)" :alt="client.name" loading="lazy" decoding="async" />
          </li>
        </ul>

        <div class="more" data-reveal>
          <p>Want the detail behind the logos?</p>
          <RouterLink class="btn btn--primary" to="/case-studies">
            Read the case studies<span class="btn__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.quote {
  max-width: 68ch;
  margin: 0;
  padding: clamp(28px, 5vw, 48px);
  background: var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-2xl);
}

.quote blockquote {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.4vw, 1.6rem);
  font-weight: 500;
  line-height: 1.38;
  letter-spacing: -0.022em;
  color: var(--ink);
}

.quote figcaption { display: flex; align-items: center; gap: var(--s-3); margin-top: var(--s-8); }
.quote__name { font-size: 14px; font-weight: 600; }
.quote__org {
  padding-left: var(--s-3);
  border-left: 1px solid var(--hairline-strong);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-subtle);
}

.clients__head { margin-top: var(--s-16); }

.clients {
  display: grid;
  gap: var(--s-3);
  margin: var(--s-8) 0 0;
  padding: 0;
  list-style: none;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.clients li {
  display: grid;
  place-items: center;
  height: 104px;
  padding: var(--s-4) var(--s-6);
  background: var(--tile);
  border-radius: var(--r-lg);
  transition: transform var(--d-base) var(--ease-out);
}

.clients li:hover { transform: translateY(-3px); }
.clients img { max-width: 100%; max-height: 62px; width: auto; object-fit: contain; }

.more { margin-top: var(--s-16); text-align: center; }
.more p { margin-bottom: var(--s-4); color: var(--ink-subtle); }
</style>
