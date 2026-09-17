<script setup>
import { ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import { asset } from '../data/site'
import courses from '../content/courses.json'

const root = ref(null)

/** The three services described on the old What We Do page, verbatim. */
const services = [
  {
    id: 'catalogue',
    title: 'Course Catalogue',
    lead: 'Our courses are tailored to the needs of the sports industry and created in partnership with the very best experts who excel in their field.',
    body: 'Each course is also backed up with a range of resources, webinars and social areas to ensure every learner has the opportunity to digest and consider their learning in a supportive environment.',
    cta: { label: 'See the library', to: '/platform/content-library' },
    image: 'media/product/lms.webp',
    w: 1100,
    h: 1256
  },
  {
    id: 'lxp',
    title: 'Tailored LXP',
    lead: 'The Learning Experience Platform will help you embrace a modern approach to online learning by offering rich and engaging content.',
    body: 'The way people learn has changed forever. We are no longer content to be passive consumers of training — instead we want to absorb our own learning via a platform that allows us to choose a personalised learning path from a diverse array of learning content.',
    cta: { label: 'Explore the LXP', to: '/platform/learning-management-system' },
    image: 'media/product/dashboard.webp',
    w: 1400,
    h: 968
  },
  {
    id: 'modules',
    title: 'Module Creation',
    lead: 'We create fully branded, interactive eLearning modules, tailored to your needs.',
    body: 'Everything incorporates the very latest in online learning design, so your people get something that feels built for them rather than adapted from somewhere else.',
    cta: { label: 'Talk to us', to: '/contact' },
    image: 'media/product/membership.webp',
    w: 1100,
    h: 1036
  }
]

useSeo({
  title: 'What we do',
  description: 'Course catalogue, tailored Learning Experience Platform, and bespoke module creation — built for the sports industry.'
})

useGsapContext(root, (ctx, gsap) => {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  })
})
</script>

<template>
  <div ref="root">
    <PageHero
      eyebrow="What we do"
      title="Courses, platform, and everything between"
      lead="We build the learning, the platform it runs on, and the bespoke modules that make it yours — all tailored to the needs of the sports industry."
    >
      <template #actions>
        <RouterLink class="btn btn--primary" to="/contact">Book a walkthrough<span class="btn__arrow" aria-hidden="true">→</span></RouterLink>
        <RouterLink class="btn btn--ghost" to="/platform">See the 10 blocks</RouterLink>
      </template>
    </PageHero>

    <section class="section">
      <div class="shell services">
        <article
          v-for="(service, i) in services"
          :key="service.id"
          class="service"
          :class="{ 'service--flip': i % 2 === 1 }"
        >
          <div class="service__copy">
            <span class="service__num" data-reveal>{{ String(i + 1).padStart(2, '0') }}</span>
            <h2 class="display-md" data-reveal>{{ service.title }}</h2>
            <p class="lead" data-reveal>{{ service.lead }}</p>
            <p class="service__body" data-reveal>{{ service.body }}</p>
            <RouterLink class="service__cta" :to="service.cta.to" data-reveal>
              {{ service.cta.label }}<span class="btn__arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
          <div class="service__media" data-reveal>
            <img
              :src="asset(service.image)"
              :alt="`${service.title} in the eCoach platform`"
              :width="service.w"
              :height="service.h"
              loading="lazy"
              decoding="async"
            />
          </div>
        </article>
      </div>
    </section>

    <section class="section courses-band">
      <div class="shell">
        <span class="eyebrow" data-reveal>The catalogue</span>
        <h2 class="display-md" data-reveal>{{ courses.length }} courses, ready to brand</h2>
        <ul class="chips" data-reveal>
          <li v-for="course in courses" :key="course">{{ course }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.services { display: grid; gap: clamp(64px, 10vw, 120px); }
.service { display: grid; gap: var(--s-8); align-items: center; }

.service__num {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--brand-bright);
}

.service__copy h2 { margin: var(--s-4) 0 var(--s-4); }
.service__body { margin-top: var(--s-4); font-size: 15px; line-height: 1.68; color: var(--ink-subtle); }

.service__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-8);
  padding-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--brand-bright);
  border-bottom: 1px solid var(--brand-line);
  transition: border-color var(--d-base) var(--ease-out);
}

.service__cta:hover { border-bottom-color: var(--brand-bright); }
.service__cta .btn__arrow { transition: transform var(--d-base) var(--ease-out); }
.service__cta:hover .btn__arrow { transform: translateX(3px); }

.service__media {
  overflow: hidden;
  padding: var(--s-3);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  box-shadow: 0 30px 70px -40px rgba(0, 0, 0, 0.9);
}

.service__media img { width: 100%; height: auto; border-radius: var(--r-md); }

.courses-band { border-top: 1px solid var(--hairline); }
.courses-band h2 { margin-top: var(--s-4); }

.chips { display: flex; flex-wrap: wrap; gap: var(--s-2); margin: var(--s-8) 0 0; padding: 0; list-style: none; }

.chips li {
  padding: 8px 14px;
  font-size: 13px;
  color: var(--ink-muted);
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
}

@media (min-width: 900px) {
  .service { grid-template-columns: 1fr 1.1fr; gap: clamp(40px, 6vw, 80px); }
  .service--flip .service__copy { order: 2; }
  .service--flip .service__media { order: 1; }
}
</style>
