<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsap'
import { pillars, asset } from '../data/site'

const root = ref(null)

useGsapContext(root, (ctx, gsap) => {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  })

  // Each screenshot drifts against the scroll so the rows feel layered
  // rather than stacked.
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 6 },
      {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    )
  })
})
</script>

<template>
  <section id="platform" ref="root" class="section platform">
    <div class="shell">
      <header class="platform__head">
        <span class="eyebrow" data-reveal>All-in-one platform</span>
        <h2 class="display-lg" data-reveal>The complete sports technology ecosystem</h2>
        <p class="lead" data-reveal>
          eCoach's integrated platform combines powerful blocks to deliver comprehensive digital
          transformation for sports organisations. Start with our flagship LMS, or combine it with
          blocks like compliance reporting and membership management — and add specialist features
          when you're ready.
        </p>
      </header>

      <div class="platform__rows">
        <article v-for="(pillar, i) in pillars" :key="pillar.id" class="pillar" :class="{ 'pillar--flip': i % 2 === 1 }">
          <div class="pillar__copy">
            <span class="eyebrow" data-reveal>{{ pillar.eyebrow }}</span>
            <h3 class="display-md" data-reveal>{{ pillar.title }}</h3>
            <p class="lead" data-reveal>{{ pillar.body }}</p>
            <ul class="pillar__features" data-reveal>
              <li v-for="feature in pillar.features" :key="feature">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7-8" /></svg>
                {{ feature }}
              </li>
            </ul>
            <a class="pillar__link" href="#contact" data-reveal>
              Explore {{ pillar.title }}
              <span class="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div class="pillar__media" data-reveal>
            <div class="pillar__frame">
              <img
                :src="asset(pillar.image)"
                :alt="`${pillar.title} interface in the eCoach platform`"
                :width="pillar.w"
                :height="pillar.h"
                loading="lazy"
                decoding="async"
                data-parallax
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.platform__head { max-width: 62ch; }
.platform__head h2 { margin: var(--s-4) 0 var(--s-6); }

.platform__rows { display: grid; gap: clamp(64px, 10vw, 128px); margin-top: clamp(56px, 9vw, 112px); }

.pillar { display: grid; gap: var(--s-8); align-items: center; }

.pillar__copy h3 { margin: var(--s-4) 0 var(--s-4); }

.pillar__features {
  display: grid;
  gap: var(--s-3);
  margin: var(--s-6) 0 0;
  padding: 0;
  list-style: none;
}

.pillar__features li {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  font-size: 15px;
  color: var(--ink-muted);
}

.pillar__features svg {
  flex: none;
  width: 18px;
  height: 18px;
  padding: 3px;
  border-radius: 50%;
  background: var(--brand-wash);
  fill: none;
  stroke: var(--brand-bright);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pillar__link {
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

.pillar__link:hover { border-bottom-color: var(--brand-bright); }
.pillar__link .btn__arrow { transition: transform var(--d-base) var(--ease-out); }
.pillar__link:hover .btn__arrow { transform: translateX(3px); }

.pillar__frame {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  background: var(--surface-1);
  padding: var(--s-3);
  box-shadow: 0 30px 70px -40px rgba(0, 0, 0, 0.9);
}

.pillar__frame img {
  width: 100%;
  /* With the width/height attributes present, `height: auto` is what makes
     the browser reserve the box at the correct aspect ratio before the file
     arrives. No explicit aspect-ratio needed. */
  height: auto;
  border-radius: var(--r-md);
  /* The image is taller than its frame so it has room to drift. */
  will-change: transform;
}

@media (min-width: 900px) {
  .pillar { grid-template-columns: 1fr 1.15fr; gap: clamp(40px, 6vw, 88px); }
  .pillar--flip .pillar__copy { order: 2; }
  .pillar--flip .pillar__media { order: 1; }
}
</style>
