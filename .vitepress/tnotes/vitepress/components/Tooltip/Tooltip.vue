<template>
  <span
    class="tooltip-wrapper"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <slot></slot>
    <span v-if="showTooltip" class="tooltip">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  text: {
    type: String,
    required: true,
  },
})

const showTooltip = ref(false)
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vp-c-divider);
  z-index: 100;
  animation: tooltipFadeIn 0.15s ease-out;
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--vp-c-bg-elv);
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-8px);
  }
}
</style>
