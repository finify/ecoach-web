<script setup>
import HeroSection from '../components/HeroSection.vue'
import ClientMarquee from '../components/ClientMarquee.vue'
import PlatformSection from '../components/PlatformSection.vue'
import EcosystemScroller from '../components/EcosystemScroller.vue'
import BuilderSection from '../components/BuilderSection.vue'
import TestimonialSection from '../components/TestimonialSection.vue'
import OrbitSection from '../components/OrbitSection.vue'
import ContactSection from '../components/ContactSection.vue'
import { useSeo } from '../composables/useSeo'

useSeo({
  title: 'eCoach — The all-in-one platform for sport',
  description:
    'Learning, compliance and membership in one sport-ready platform. Build your bespoke platform from 10 powerful blocks. Trusted by 50+ organisations across UK sport.'
})
</script>

<template>
  <HeroSection />
  <ClientMarquee />
  <PlatformSection />
  <EcosystemScroller />
  <BuilderSection />
  <TestimonialSection />
  <OrbitSection />
  <ContactSection />
</template>
