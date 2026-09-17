<script setup>
import { ref, computed } from 'vue'
import PageHero from '../components/PageHero.vue'
import BrandMark from '../components/BrandMark.vue'
import { useGsapContext } from '../composables/useGsap'
import { useSeo } from '../composables/useSeo'
import team from '../content/team.json'

const root = ref(null)

const name = ref('')
const org = ref('')
const email = ref('')
const message = ref('')

const INBOX = 'simon.richards@e-coach.co.uk'
const MAX = 1200

/**
 * GitHub Pages is a static host with nowhere to POST, so the form composes a
 * mailto: instead. Everything the visitor types ends up in the body, which
 * means their own mail client sends it and they keep a copy in Sent.
 */
const mailto = computed(() => {
  const subject = org.value
    ? `Walkthrough request — ${org.value}`
    : 'Walkthrough request'
  const body = [
    name.value && `Name: ${name.value}`,
    org.value && `Organisation: ${org.value}`,
    email.value && `Email: ${email.value}`,
    '',
    message.value
  ]
    .filter((line) => line !== undefined && line !== false)
    .join('\n')
    .slice(0, MAX)

  return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

const ready = computed(() => message.value.trim().length > 0)

useSeo({
  title: 'Get in touch',
  description: 'Book a walkthrough and see the blocks in action, mapped to how your organisation actually works.'
})

useGsapContext(root, (ctx, gsap) => {
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 0.75, stagger: 0.07, ease: 'expo.out',
    scrollTrigger: { trigger: '[data-panel]', start: 'top 88%', once: true }
  })
})
</script>

<template>
  <div ref="root">
    <PageHero
      eyebrow="Get in touch"
      title="Book a walkthrough"
      lead="Tell us a little about your organisation and one of the team will show you the blocks in action — mapped to how you actually work, not a generic demo."
    />

    <section class="section">
      <div class="shell contact" data-panel>
        <form class="form" data-reveal @submit.prevent>
          <div class="row">
            <label class="field">
              <span class="field__label">Your name</span>
              <input v-model="name" type="text" autocomplete="name" placeholder="Alex Morgan" />
            </label>
            <label class="field">
              <span class="field__label">Organisation</span>
              <input v-model="org" type="text" autocomplete="organization" placeholder="Sport Governing Body" />
            </label>
          </div>

          <label class="field">
            <span class="field__label">Email address</span>
            <input v-model="email" type="email" autocomplete="email" placeholder="alex@yourclub.org" />
          </label>

          <label class="field">
            <span class="field__label">
              What would you like to see?
              <span class="field__count">{{ message.length }} / {{ MAX }}</span>
            </span>
            <textarea
              v-model="message"
              rows="6"
              :maxlength="MAX"
              placeholder="We're a national governing body looking at compliance and membership together…"
            />
          </label>

          <a
            class="btn btn--primary form__send"
            :class="{ 'is-disabled': !ready }"
            :href="ready ? mailto : undefined"
            :aria-disabled="!ready"
          >
            Send your message<span class="btn__arrow" aria-hidden="true">→</span>
          </a>

          <p class="form__note">
            This opens your own email app with the message ready to send, so nothing is
            stored on this site. Prefer to write directly?
            <a :href="`mailto:${INBOX}`">{{ INBOX }}</a>
          </p>
        </form>

        <aside class="aside" data-reveal>
          <BrandMark class="aside__mark" animated />
          <h2 class="headline">Who you'll hear from</h2>
          <ul class="people">
            <li v-for="person in team" :key="person.name">
              <span class="people__name">{{ person.name }}</span>
              <span class="people__role">{{ person.role }}</span>
              <a :href="`mailto:${person.email}`">{{ person.email }}</a>
            </li>
          </ul>

          <div class="aside__links">
            <RouterLink to="/platform">Browse the 10 blocks →</RouterLink>
            <RouterLink to="/case-studies">Read the case studies →</RouterLink>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact { display: grid; gap: var(--s-12); align-items: start; }

.form { display: grid; gap: var(--s-6); }
.row { display: grid; gap: var(--s-6); }

.field { display: grid; gap: var(--s-2); }

.field__label {
  display: flex;
  justify-content: space-between;
  gap: var(--s-4);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-subtle);
}

.field__count { color: var(--ink-tertiary); }

input,
textarea {
  width: 100%;
  padding: 12px 14px;
  font: inherit;
  font-size: 15px;
  color: var(--ink);
  background: var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-md);
  resize: vertical;
  transition: border-color var(--d-base) var(--ease-out), background-color var(--d-base) var(--ease-out);
}

input::placeholder,
textarea::placeholder { color: var(--ink-tertiary); }
input:focus,
textarea:focus { outline: none; border-color: var(--brand); background: var(--surface-2); }

.form__send { justify-self: start; padding: 14px 26px; font-size: 15px; }
.form__send.is-disabled { opacity: 0.45; pointer-events: none; }

.form__note { font-size: 12.5px; line-height: 1.6; color: var(--ink-tertiary); }
.form__note a { color: var(--brand-bright); }

.aside {
  padding: var(--s-8);
  background: radial-gradient(90% 100% at 50% 0%, rgba(0, 160, 111, 0.12), transparent 62%), var(--surface-1);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--r-xl);
}

.aside__mark { width: 44px; margin-bottom: var(--s-6); }

.people { display: grid; gap: var(--s-6); margin: var(--s-6) 0 0; padding: 0; list-style: none; }
.people li { display: grid; gap: 2px; }
.people__name { font-size: 14.5px; font-weight: 600; }
.people__role { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-tertiary); }
.people a { margin-top: 2px; font-size: 13px; color: var(--brand-bright); }

.aside__links { display: grid; gap: var(--s-3); margin-top: var(--s-8); padding-top: var(--s-6); border-top: 1px solid var(--hairline); }
.aside__links a { font-size: 13.5px; color: var(--ink-muted); transition: color var(--d-base) var(--ease-out); }
.aside__links a:hover { color: var(--brand-bright); }

@media (min-width: 620px) {
  .row { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 950px) {
  .contact { grid-template-columns: 1.4fr 0.8fr; gap: var(--s-12); }
}
</style>
