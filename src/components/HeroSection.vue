<script setup>
import { ref } from 'vue'
import BrandMark from './BrandMark.vue'
import { useGsapContext } from '../composables/useGsap'
import { hero, stats, asset } from '../data/site'
import StatCounter from './StatCounter.vue'

const root = ref(null)
const video = ref(null)
const panel = ref(null)

useGsapContext(root, (ctx, gsap) => {
  // Entrance. Lines rise out of their own clipping box — the masked edge
  // reads as type being set rather than a block sliding in.
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('[data-hero-eyebrow]', { opacity: 0, y: 12, duration: 0.6 }, 0.1)
    .from('[data-hero-line]', { yPercent: 108, duration: 1.05, stagger: 0.09 }, 0.15)
    .from('[data-hero-body]', { opacity: 0, y: 16, duration: 0.8 }, 0.5)
    .from('[data-hero-cta]', { opacity: 0, y: 14, duration: 0.7, stagger: 0.07 }, 0.62)
    .from('[data-hero-stat]', { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, 0.72)

  // Background drifts slower than the page — depth without distraction.
  gsap.to(video.value, {
    yPercent: 14,
    scale: 1.1,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
  })

  // The product panel straightens up as it enters: it arrives tilted back in
  // perspective and settles flat, so the screenshot presents itself.
  gsap.from(panel.value, {
    rotateX: 26,
    scale: 0.9,
    y: 60,
    opacity: 0,
    ease: 'power2.out',
    scrollTrigger: { trigger: panel.value, start: 'top 92%', end: 'top 38%', scrub: 0.6 }
  })
})
</script>

<template>
  <section id="top" ref="root" class="hero">
    <div class="hero__bg" aria-hidden="true">
      <video
        ref="video"
        class="hero__video"
        :poster="asset('media/hero-poster.jpg')"
        autoplay
        muted
        loop
        playsinline
      >
        <source :src="asset('media/hero.mp4')" type="video/mp4" />
      </video>
      <div class="hero__scrim" />
      <div class="hero__grid" />
    </div>

    <div class="hero__inner shell">
      <span class="eyebrow" data-hero-eyebrow>{{ hero.eyebrow }}</span>

      <h1 class="hero__title display-xl">
        <span v-for="line in hero.title" :key="line" class="hero__mask">
          <span data-hero-line>{{ line }}</span>
        </span>
        <span class="hero__mask">
          <span class="hero__accent" data-hero-line>{{ hero.titleAccent }}</span>
        </span>
      </h1>

      <p class="hero__body lead" data-hero-body>{{ hero.body }}</p>

      <div class="hero__ctas">
        <RouterLink class="btn btn--primary btn--lg" to="/contact" data-hero-cta>
          Book your walkthrough
          <span class="btn__arrow" aria-hidden="true">→</span>
        </RouterLink>
        <a class="btn btn--ghost btn--lg" href="#builder" data-hero-cta>
          Build your platform
        </a>
      </div>

      <p class="hero__note body-sm" data-hero-cta>{{ hero.note }}</p>

      <ul class="hero__stats">
        <li v-for="stat in stats" :key="stat.label" data-hero-stat>
          <StatCounter :value="stat.value" :suffix="stat.suffix" />
          <span class="hero__stat-label">{{ stat.label }}</span>
        </li>
      </ul>
    </div>

    <div class="hero__stage shell">
      <div ref="panel" class="hero__panel">
        <div class="hero__chrome">
          <span /><span /><span />
          <p class="hero__chrome-title">
            <BrandMark class="hero__chrome-mark" />
            eCoach — learner dashboard
          </p>
        </div>
        <img
          :src="asset('media/product/dashboard.webp')"
          alt="The eCoach learner dashboard showing courses completed, points earned, learning in progress and recent certificates."
          width="1400"
          height="968"
          loading="eager"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; padding-top: 132px; }

.hero__bg {
  position: absolute;
  inset: 0 0 auto;
  height: 105vh;
  overflow: hidden;
}

.hero__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* The source footage is busy; desaturating it lets the green brand accent
     stay the only saturated thing on screen. */
  filter: grayscale(0.7) contrast(1.05) brightness(0.42);
}

.hero__scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(0, 160, 111, 0.22) 0%, transparent 60%),
    linear-gradient(180deg, rgba(5, 8, 7, 0.55) 0%, rgba(5, 8, 7, 0.86) 52%, var(--canvas) 96%);
}

.hero__grid {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image:
    linear-gradient(var(--hairline) 1px, transparent 1px),
    linear-gradient(90deg, var(--hairline) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(100% 60% at 50% 30%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(100% 60% at 50% 30%, #000 0%, transparent 75%);
}

.hero__inner { position: relative; text-align: center; }

.hero__title { margin: var(--s-4) 0 0; }

/* Each line clips its own child so the entrance reads as a masked reveal. */
.hero__mask { display: block; overflow: hidden; padding-bottom: 0.06em; }
.hero__mask > span { display: block; }

.hero__accent {
  /* Subordinate to the main title so the h1 reads as one headline with a
     qualifier, not as two competing headlines. */
  font-size: 0.5em;
  letter-spacing: -0.03em;
  padding-top: 0.32em;
  background: linear-gradient(94deg, var(--brand-bright) 0%, #6ee7b7 55%, var(--brand) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__body {
  max-width: 62ch;
  margin: var(--s-6) auto 0;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-3);
  margin-top: var(--s-8);
}

.btn--lg { padding: 14px 26px; font-size: 15px; }

.hero__note { margin-top: var(--s-6); color: var(--ink-subtle); }

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(28px, 7vw, 72px);
  margin: var(--s-12) 0 0;
  padding: 0;
  list-style: none;
}

.hero__stats li { display: grid; gap: 2px; }

.hero__stat-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-subtle);
}

/* --- product panel ----------------------------------------------------- */

.hero__stage { position: relative; margin-top: clamp(48px, 8vw, 96px); perspective: 1400px; }

.hero__panel {
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-xl);
  background: var(--surface-1);
  overflow: hidden;
  transform-origin: 50% 100%;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.07) inset,
    0 40px 90px -30px rgba(0, 0, 0, 0.9),
    0 0 120px -40px rgba(0, 160, 111, 0.4);
}

.hero__chrome {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--hairline);
  background: var(--surface-2);
}

.hero__chrome > span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--surface-4);
}

.hero__chrome-title {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: var(--s-3);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-subtle);
}

.hero__chrome-mark { width: 15px; }

.hero__panel img { width: 100%; height: auto; }

@media (min-width: 768px) {
  .hero { padding-top: 168px; }
}
</style>
