<script setup>
/**
 * The eCoach tactics board, redrawn as SVG.
 *
 * The original logo is a flat PNG. Rebuilding it as geometry means it stays
 * crisp at any size, can be recoloured by CSS, and — the reason it matters
 * here — the dotted play paths can be animated, which makes the mark the
 * signature motif of the rebrand rather than a static badge.
 */
defineProps({
  /** Animates the dotted play paths, as if a coach were drawing the move. */
  animated: { type: Boolean, default: false },
  title: { type: String, default: 'eCoach' }
})
</script>

<template>
  <svg
    class="mark"
    :class="{ 'mark--animated': animated }"
    viewBox="0 0 200 124"
    role="img"
    :aria-label="title"
  >
    <!-- board frame + stand -->
    <rect x="4" y="2" width="192" height="102" rx="2" fill="none" stroke="currentColor" stroke-width="7" />
    <rect x="12" y="110" width="176" height="9" rx="1.5" fill="currentColor" />

    <!-- playing surface -->
    <rect x="18" y="15" width="164" height="76" fill="currentColor" />

    <!-- pitch markings -->
    <g fill="none" stroke="var(--mark-line, #fff)" stroke-width="2.6">
      <rect x="26" y="21" width="148" height="64" />
      <rect x="66" y="21" width="68" height="24" />
      <rect x="88" y="21" width="24" height="11" />
      <path d="M84 85 A17 17 0 0 0 116 85" />
    </g>

    <!-- players: circles hold position, crosses mark the run -->
    <g class="mark__players" fill="none" stroke="var(--mark-line, #fff)" stroke-width="2.6">
      <circle cx="86" cy="36" r="6.5" />
      <circle cx="72" cy="60" r="6.5" />
      <circle cx="128" cy="56" r="6.5" />
    </g>
    <g class="mark__players" stroke="var(--mark-line, #fff)" stroke-width="3.2" stroke-linecap="round">
      <path d="M88 44l8 8M96 44l-8 8" />
      <path d="M70 69l8 8M78 69l-8 8" />
      <path d="M126 65l8 8M134 65l-8 8" />
    </g>

    <!-- the move itself -->
    <g
      class="mark__paths"
      fill="none"
      stroke="var(--mark-line, #fff)"
      stroke-width="3"
      stroke-linecap="round"
      stroke-dasharray="0.1 9"
    >
      <path d="M72 44C69 53 69 61 73 68" />
      <path d="M99 41C107 47 115 55 125 62" />
    </g>
  </svg>
</template>

<style scoped>
.mark {
  width: 100%;
  height: auto;
  color: var(--brand);
  overflow: visible;
}

/* Dots travel along the play path — a slow, ambient loop. It runs as a CSS
   animation so it keeps its rhythm even while the page is busy loading. */
.mark--animated .mark__paths path {
  animation: play-run 2.4s linear infinite;
}

@keyframes play-run {
  to { stroke-dashoffset: -18.2; } /* 2 dash cycles, so the loop is seamless */
}

@media (prefers-reduced-motion: reduce) {
  .mark--animated .mark__paths path { animation: none; }
}
</style>
