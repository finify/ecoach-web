<script setup>
import { ref, onMounted } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' }
})

const el = ref(null)
const { display, attach } = useCountUp(props.value)

onMounted(() => attach(el.value))
</script>

<template>
  <span ref="el" class="stat">
    {{ display }}<span class="stat__suffix">{{ suffix }}</span>
  </span>
</template>

<style scoped>
.stat {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.9rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
  /* Digits change width as they count; tabular figures stop the layout
     jittering while the number runs up. */
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}

.stat__suffix { color: var(--brand-bright); }
</style>
