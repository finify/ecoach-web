<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import SportSystem from './components/SportSystem.vue'
import { ScrollTrigger } from './composables/useGsap'

const router = useRouter()

onMounted(() => {
  // Web fonts and images settle after ScrollTrigger's first measurement.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

// Every view mounts its own triggers; stale ones from the previous route have
// to go, or their pin-spacers keep distorting the new page's measurements.
watch(
  () => router.currentRoute.value.fullPath,
  () => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }
)
</script>

<template>
  <SiteNav />
  <SportSystem v-if="$route.name === 'home'" />
  <main>
    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath" />
    </RouterView>
  </main>
  <SiteFooter />
</template>
