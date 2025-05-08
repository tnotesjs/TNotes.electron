<template>
  <div
    v-if="show"
    class="right-click-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="menu-item" @click="handlePin">📌 Pin</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: Boolean,
  x: Number,
  y: Number,
})

const emit = defineEmits(['pin'])
const handlePin = (e) => {
  emit('pin')
  e.preventDefault()
}
</script>

<style scoped>
.right-click-menu {
  position: fixed;
  z-index: 99999;
  background: #2c2c2c;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  font-size: 13px;
  color: #eee;
  cursor: pointer;
  user-select: none;
}

.menu-item {
  padding: 8px 16px;
}

.menu-item:hover {
  background-color: #444;
}
</style>
