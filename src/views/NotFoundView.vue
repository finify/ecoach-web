<script setup>
import BrandMark from '../components/BrandMark.vue'
import { useSeo } from '../composables/useSeo'

useSeo({ title: 'Page not found', description: 'That page has moved or never existed.' })
</script>

<template>
  <section class="section missing">
    <div class="shell">
      <BrandMark class="missing__mark" animated />
      <p class="eyebrow">Error 404</p>
      <h1 class="display-lg">This one went out of play</h1>
      <p class="lead">
        The page you were after has moved or never existed. The links below cover
        most of what used to live here.
      </p>
      <div class="missing__links">
        <RouterLink class="btn btn--primary" to="/">Back to the home page<span class="btn__arrow" aria-hidden="true">→</span></RouterLink>
        <RouterLink class="btn btn--ghost" to="/platform">The 10 blocks</RouterLink>
        <RouterLink class="btn btn--ghost" to="/news">News &amp; insight</RouterLink>
        <RouterLink class="btn btn--ghost" to="/contact">Get in touch</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.missing { padding-block: clamp(140px, 22vh, 220px); text-align: center; }
.missing__mark { width: 62px; margin: 0 auto var(--s-8); }
.missing h1 { margin: var(--s-4) auto 0; max-width: 16ch; }
.missing .lead { max-width: 52ch; margin: var(--s-6) auto 0; }
.missing__links { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-3); margin-top: var(--s-8); }
</style>
