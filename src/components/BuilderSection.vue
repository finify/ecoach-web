<script setup>
import { ref, computed } from 'vue'
import { useGsapContext } from '../composables/useGsap'
import { blocks } from '../data/site'

const root = ref(null)

// Start with the three blocks the live site flags as POPULAR.
const selected = ref(new Set(blocks.filter((b) => b.popular).map((b) => b.id)))
const users = ref(2000)
const horizon = ref(3)

const toggle = (id) => {
  const next = new Set(selected.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selected.value = next
}

const count = computed(() => selected.value.size)

const listPrice = computed(() =>
  blocks.reduce((sum, b) => (selected.value.has(b.id) ? sum + b.price : sum), 0)
)

// Bundle: 2% per additional block, capped at 30%.
const bundleRate = computed(() => Math.min(0.3, Math.max(0, count.value - 1) * 0.02))
// Multi-year: 5% at 3 years, 8% at 5 years.
const termRate = computed(() => (horizon.value === 5 ? 0.08 : horizon.value === 3 ? 0.05 : 0))

const ecoachTotal = computed(() =>
  Math.round(listPrice.value * (1 - bundleRate.value) * (1 - termRate.value))
)

// Competitor model from the live calculator: £4 base + £1 per selected block,
// charged per user per year. With nothing selected there is no platform to
// compare against — billing a notional competitor for an empty basket would
// claim a saving on a purchase nobody made.
const competitorTotal = computed(() =>
  count.value === 0 ? 0 : Math.round(users.value * (4 + count.value) * horizon.value)
)

const saved = computed(() => Math.max(0, competitorTotal.value - ecoachTotal.value))
const savedPct = computed(() =>
  competitorTotal.value ? Math.round((saved.value / competitorTotal.value) * 100) : 0
)

const gbp = (n) => '£' + n.toLocaleString('en-GB')

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.06,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 78%', once: true }
  })
})
</script>

<template>
  <section id="builder" ref="root" class="section builder">
    <div class="shell">
      <header class="builder__head">
        <span class="eyebrow" data-reveal>Design your platform, your way</span>
        <h2 class="display-lg" data-reveal>Pick your blocks. See your savings.</h2>
        <p class="lead" data-reveal>
          Choose from the 10 eCoach blocks to create your bespoke digital platform and get an
          instant idea of cost and savings — only pay for what you need.
        </p>
        <ul class="builder__tags" data-reveal>
          <li>Build from blocks</li>
          <li>Seamless by design</li>
          <li>Unified reporting</li>
          <li>No per-user fees</li>
        </ul>
      </header>

      <div class="builder__grid">
        <div class="builder__blocks" data-reveal>
          <button
            v-for="block in blocks"
            :key="block.id"
            class="chip"
            :class="{ 'chip--on': selected.has(block.id) }"
            type="button"
            :aria-pressed="selected.has(block.id)"
            @click="toggle(block.id)"
          >
            <span class="chip__top">
              <span class="chip__tick" aria-hidden="true">
                <svg viewBox="0 0 16 16"><path d="M3 8.5l3.5 3.5L13 4" /></svg>
              </span>
              <span class="chip__name">{{ block.name }}</span>
              <span v-if="block.popular" class="chip__flag">Popular</span>
            </span>
            <span class="chip__body">{{ block.body }}</span>
            <span class="chip__price">{{ gbp(block.price) }}</span>
          </button>
        </div>

        <aside class="builder__panel" data-reveal>
          <div class="builder__controls">
            <label class="field">
              <span class="field__label">Annual users on your platform</span>
              <input v-model.number="users" type="range" min="100" max="20000" step="100" />
              <output class="field__value">{{ users.toLocaleString('en-GB') }}</output>
            </label>

            <div class="field">
              <span class="field__label">Horizon</span>
              <div class="segmented" role="group" aria-label="Horizon">
                <button
                  v-for="option in [1, 3, 5]"
                  :key="option"
                  type="button"
                  :class="{ 'is-on': horizon === option }"
                  :aria-pressed="horizon === option"
                  @click="horizon = option"
                >
                  {{ option }} yr{{ option > 1 ? 's' : '' }}
                </button>
              </div>
            </div>
          </div>

          <dl class="builder__figures">
            <div>
              <dt>Your eCoach platform</dt>
              <dd class="figure figure--brand">{{ gbp(ecoachTotal) }}</dd>
            </div>
            <div>
              <dt>Typical competitor</dt>
              <dd class="figure figure--strike">{{ gbp(competitorTotal) }}</dd>
            </div>
            <div class="builder__saved">
              <dt>Amount saved</dt>
              <dd class="figure">{{ gbp(saved) }}<span class="figure__pct">{{ savedPct }}% saved</span></dd>
            </div>
          </dl>

          <div class="builder__meter" :style="{ '--fill': `${savedPct}%` }" aria-hidden="true">
            <span />
          </div>

          <p v-if="!count" class="builder__fine builder__fine--empty">
            Select at least one block to see your costs and savings.
          </p>
          <p v-else class="builder__fine">
            {{ count }} block{{ count === 1 ? '' : 's' }} selected · bundle discount
            {{ Math.round(bundleRate * 100) }}%<template v-if="termRate"> · multi-year
            {{ Math.round(termRate * 100) }}%</template>. Competitor modelled at £4 base + £1 per
            selected block, per user per year.
          </p>

          <a
            class="btn btn--primary builder__cta"
            :class="{ 'is-disabled': !count }"
            :aria-disabled="!count"
            href="#contact"
          >
            Get my tailored quote
            <span class="btn__arrow" aria-hidden="true">→</span>
          </a>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.builder { background: linear-gradient(180deg, transparent, rgba(0, 160, 111, 0.05), transparent); }

.builder__head { max-width: 62ch; }
.builder__head h2 { margin: var(--s-4) 0 var(--s-6); }

.builder__tags { display: flex; flex-wrap: wrap; gap: var(--s-2); margin: var(--s-6) 0 0; padding: 0; list-style: none; }

.builder__tags li {
  padding: 5px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-subtle);
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
}

.builder__grid { display: grid; gap: var(--s-8); margin-top: clamp(40px, 6vw, 72px); }

/* --- block chips ------------------------------------------------------- */

.builder__blocks { display: grid; gap: var(--s-3); grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); align-content: start; }

.chip {
  display: grid;
  gap: var(--s-2);
  padding: var(--s-4) var(--s-4) var(--s-3);
  text-align: left;
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-lg);
  transition: background-color var(--d-base) var(--ease-out),
              border-color var(--d-base) var(--ease-out);
}

.chip:hover { background: var(--surface-2); }
.chip--on { background: var(--surface-2); border-color: var(--brand); }

.chip__top { display: flex; align-items: center; gap: var(--s-2); }

.chip__tick {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-xs);
  transition: background-color var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out);
}

.chip--on .chip__tick { background: var(--brand); border-color: var(--brand); }

.chip__tick svg { width: 12px; fill: none; stroke: #fff; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; opacity: 0; transition: opacity var(--d-fast) var(--ease-out); }
.chip--on .chip__tick svg { opacity: 1; }

.chip__name { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }

.chip__flag {
  margin-left: auto;
  padding: 2px 7px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-bright);
  background: var(--brand-wash);
  border-radius: var(--r-pill);
}

.chip__body { font-size: 12.5px; line-height: 1.5; color: var(--ink-tertiary); }

.chip__price { font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); }

/* --- results panel ----------------------------------------------------- */

.builder__panel {
  align-self: start;
  padding: var(--s-6);
  background: var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-xl);
}

.builder__controls { display: grid; gap: var(--s-6); padding-bottom: var(--s-6); border-bottom: 1px solid var(--hairline); }

.field { display: grid; gap: var(--s-2); }

.field__label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-subtle); }

.field__value { font-family: var(--font-mono); font-size: 13px; color: var(--ink); }

input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  border-radius: var(--r-pill);
  background: var(--surface-4);
  cursor: pointer;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--brand);
  border: 2px solid var(--canvas);
  transition: transform var(--d-fast) var(--ease-out);
}

input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.15); }

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--brand);
  border: 2px solid var(--canvas);
}

.segmented { display: inline-flex; padding: 3px; background: var(--surface-3); border-radius: var(--r-pill); }

.segmented button {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-subtle);
  border-radius: var(--r-pill);
  transition: background-color var(--d-base) var(--ease-out), color var(--d-base) var(--ease-out);
}

.segmented button.is-on { background: var(--surface-1); color: var(--ink); }

.builder__figures { display: grid; gap: var(--s-4); margin: var(--s-6) 0 0; }
.builder__figures > div { display: flex; align-items: baseline; justify-content: space-between; gap: var(--s-4); }
.builder__figures dt { font-size: 13px; color: var(--ink-subtle); }
.builder__figures dd { margin: 0; }

.figure {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.figure--brand { color: var(--brand-bright); }
.figure--strike { color: var(--ink-tertiary); text-decoration: line-through; }

.builder__saved { padding-top: var(--s-4); border-top: 1px solid var(--hairline); }
.builder__saved .figure { display: flex; align-items: baseline; gap: var(--s-3); font-size: 1.75rem; }

.figure__pct {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--brand-bright);
  background: var(--brand-wash);
  padding: 3px 8px;
  border-radius: var(--r-pill);
}

.builder__meter { height: 4px; margin-top: var(--s-6); background: var(--surface-4); border-radius: var(--r-pill); overflow: hidden; }

.builder__meter span {
  display: block;
  width: var(--fill);
  height: 100%;
  background: linear-gradient(90deg, var(--brand), var(--brand-bright));
  border-radius: inherit;
  transition: width var(--d-slow) var(--ease-out);
}

.builder__fine { margin-top: var(--s-4); font-size: 11.5px; line-height: 1.5; color: var(--ink-tertiary); }
.builder__fine--empty { color: var(--ink-subtle); }

.builder__cta.is-disabled { opacity: 0.45; pointer-events: none; }

.builder__cta { width: 100%; margin-top: var(--s-6); }

@media (min-width: 1000px) {
  .builder__grid { grid-template-columns: 1.4fr 0.85fr; gap: var(--s-12); }
  /* Keep the running total in view while the reader works down the blocks. */
  .builder__panel { position: sticky; top: 92px; }
}
</style>
