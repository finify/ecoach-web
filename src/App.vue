<script setup>
import { onMounted } from 'vue'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import ClientMarquee from './components/ClientMarquee.vue'
import PlatformSection from './components/PlatformSection.vue'
import EcosystemScroller from './components/EcosystemScroller.vue'
import BuilderSection from './components/BuilderSection.vue'
import TestimonialSection from './components/TestimonialSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { ScrollTrigger } from './composables/useGsap'

onMounted(() => {
  // Web fonts and lazy images change element heights after ScrollTrigger has
  // measured them; a refresh once everything has settled keeps every trigger
  // anchored to where its section actually ended up.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})
</script>

<template>
  <SiteNav />
  <main>
    <HeroSection />
    <ClientMarquee />
    <PlatformSection />
    <EcosystemScroller />
    <BuilderSection />
    <TestimonialSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
