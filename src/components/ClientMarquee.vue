<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsap'
import { clients, asset } from '../data/site'

const root = ref(null)
const track = ref(null)

// The list is rendered twice so the second copy takes over exactly when the
// first scrolls out — a seamless loop with no visible reset.
const doubled = [...clients, ...clients]

useGsapContext(root, (ctx, gsap) => {
  gsap.to(track.value, {
    xPercent: -50,
    duration: 46,
    ease: 'none',
    repeat: -1
  })
})
</script>

<template>
  <section ref="root" class="marquee" aria-label="Organisations using eCoach">
    <div class="shell">
      <p class="marquee__caption">
        The eCoach platform is trusted by 50+ sports organisations across the UK
      </p>
    </div>

    <div class="marquee__viewport">
      <ul ref="track" class="marquee__track">
        <li v-for="(client, i) in doubled" :key="`${client.file}-${i}`" :aria-hidden="i >= clients.length">
          <img :src="asset(`media/clients/${client.file}.webp`)" :alt="i < clients.length ? client.name : ''" loading="lazy" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.marquee { padding-block: var(--s-12); border-block: 1px solid var(--hairline); }

.marquee__caption {
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.02em;
  color: var(--ink-subtle);
  margin-bottom: var(--s-8);
}

.marquee__viewport {
  overflow: hidden;
  /* Fade the ends so logos dissolve rather than clip at the edge. */
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee__track {
  display: flex;
  align-items: center;
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Spacing lives on the tiles, not as `gap`. With `gap` the track measures
   2N·w + (2N−1)·g, so shifting by exactly -50% lands half a gap short and the
   loop visibly jumps. As margin it measures 2N·(w+g) and -50% is seamless. */
.marquee__track li {
  flex: none;
  margin-right: var(--s-4);
  display: grid;
  place-items: center;
  width: 168px;
  height: 92px;
  padding: var(--s-4) var(--s-6);
  /* Client marks keep their own colours; a light tile gives every one of them
     a correct background instead of forcing a monochrome silhouette. */
  background: var(--tile);
  border-radius: var(--r-lg);
  transition: transform var(--d-base) var(--ease-out);
}

.marquee__track li:hover { transform: translateY(-3px); }

.marquee__track img {
  max-width: 100%;
  max-height: 60px;
  width: auto;
  object-fit: contain;
}
</style>
