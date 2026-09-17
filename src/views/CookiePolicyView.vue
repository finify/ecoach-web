<script setup>
import { withAssetPaths } from '../data/site'
import PageHero from '../components/PageHero.vue'
import { useSeo } from '../composables/useSeo'
import pages from '../content/pages.json'

const page = pages.find((p) => p.slug === 'cookie-policy-uk')

useSeo({
  title: 'Cookie policy',
  description: 'How eCoach uses cookies and similar technologies.'
})
</script>

<template>
  <div>
    <PageHero eyebrow="Legal" title="Cookie policy" />
    <section class="section">
      <div class="shell">
        <!-- eslint-disable vue/no-v-html -- sanitised at migration to a fixed tag allowlist -->
        <div v-if="page" class="prose policy" v-html="withAssetPaths(page.html)" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.policy { max-width: 76ch; }
</style>
