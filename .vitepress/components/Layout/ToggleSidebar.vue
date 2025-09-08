<!-- .vitepress\components\Layout\ToggleSidebar.vue -->
<template>
    <img @click="toggle" class="sidebar-toggle-btn" :aria-pressed="hidden.toString()" :title="hidden ? '显示侧边栏' : '隐藏侧边栏'" :src="hidden ? icon__next : icon__prev" alt=""></img>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import icon__next from '/icon__next.svg'
import icon__prev from '/icon__prev.svg'

const KEY = 'vp:sidebar:hidden'
const hidden = ref(false)

onMounted(() => {
  try {
    hidden.value = localStorage.getItem(KEY) === '1'
  } catch {}
  apply(hidden.value)
})

function apply(val: boolean) {
  const root = document.documentElement
  if (val) root.classList.add('hide-sidebar')
  else root.classList.remove('hide-sidebar')
}

function toggle() {
  hidden.value = !hidden.value
  apply(hidden.value)
  try {
    localStorage.setItem(KEY, hidden.value ? '1' : '0')
  } catch {}
}
</script>

<style scoped>
.sidebar-toggle-btn {
  width: 1.5rem;
  height: 1.5rem;
  padding: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-toggle-btn:hover {
  background: var(--vp-c-bg-alt);
}
</style>
