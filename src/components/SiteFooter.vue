<script setup>
import BrandMark from './BrandMark.vue'
import { asset, nav } from '../data/site'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Learning Management', href: '#platform' },
      { label: 'Compliance Reporting', href: '#platform' },
      { label: 'Membership Management', href: '#platform' },
      { label: 'All 10 blocks', href: '#blocks' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'What we do', href: 'https://e-coach.co.uk/what-we-do/' },
      { label: 'Case studies', href: 'https://e-coach.co.uk/case-studies/' },
      { label: 'Testimonials', href: 'https://e-coach.co.uk/testimonials/' },
      { label: 'News', href: 'https://e-coach.co.uk/news/' }
    ]
  },
  {
    title: 'Get started',
    links: [
      { label: 'Book a walkthrough', href: 'https://e-coach.co.uk/get-in-touch/' },
      { label: 'Estimate savings', href: '#builder' },
      { label: 'Blog', href: 'https://e-coach.co.uk/blog/' }
    ]
  }
]
</script>

<template>
  <footer class="footer">
    <div class="shell">
      <div class="footer__top">
        <div class="footer__brand">
          <a class="lockup" href="#top" aria-label="eCoach — home">
            <BrandMark class="lockup__mark" />
            <img class="lockup__word" :src="asset('media/brand/wordmark.png')" alt="eCoach" />
          </a>
          <p class="footer__tagline">Sporting excellence for all.</p>
          <p class="footer__blurb">
            The all-in-one platform for sport learning, compliance and membership — trusted by 50+
            organisations across the UK.
          </p>
        </div>

        <nav v-for="column in columns" :key="column.title" class="footer__col" :aria-label="column.title">
          <h2 class="footer__col-title">{{ column.title }}</h2>
          <ul>
            <li v-for="link in column.links" :key="link.label">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="footer__base">
        <p>© eCoach {{ year }}</p>
        <p>UK's #1 digital platform for sport</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { padding-block: var(--s-16) var(--s-8); border-top: 1px solid var(--hairline); }

.footer__top { display: grid; gap: var(--s-12); }

.lockup { display: inline-flex; align-items: center; gap: 10px; }
.lockup__mark { width: 28px; }
.lockup__word { width: 86px; filter: brightness(0) invert(1); }

.footer__tagline {
  margin-top: var(--s-4);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--brand-bright);
}

.footer__blurb { max-width: 40ch; margin-top: var(--s-3); font-size: 13.5px; line-height: 1.6; color: var(--ink-tertiary); }

.footer__col-title {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-subtle);
}

.footer__col ul { display: grid; gap: var(--s-3); margin: var(--s-6) 0 0; padding: 0; list-style: none; }

.footer__col a {
  font-size: 14px;
  color: var(--ink-muted);
  transition: color var(--d-base) var(--ease-out);
}

.footer__col a:hover { color: var(--brand-bright); }

.footer__base {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--s-4);
  margin-top: var(--s-16);
  padding-top: var(--s-6);
  border-top: 1px solid var(--hairline);
  font-size: 12px;
  color: var(--ink-tertiary);
}

.footer__base p { margin: 0; }

@media (min-width: 800px) {
  .footer__top { grid-template-columns: 1.6fr repeat(3, 1fr); gap: var(--s-8); }
}
</style>
