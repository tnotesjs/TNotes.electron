<template>
  <img @click="toggle" class="content-toggle-btn" :aria-pressed="full.toString()" :title="full ? '退出全屏内容区' : '全屏显示内容区'" :src="full ? icon__fullscreen_exit : icon__fullscreen" alt=""></img>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import icon__fullscreen from '/icon__fullscreen.svg'
import icon__fullscreen_exit from '/icon__fullscreen_exit.svg'

const KEY = 'vp:content:fullscreen'
const full = ref(false)

onMounted(() => {
  try {
    full.value = localStorage.getItem(KEY) === '1'
  } catch {}
  apply(full.value)
})

function apply(val: boolean) {
  const root = document.documentElement
  if (val) root.classList.add('content-fullscreen')
  else root.classList.remove('content-fullscreen')
}

function toggle() {
  full.value = !full.value
  apply(full.value)
  try {
    localStorage.setItem(KEY, full.value ? '1' : '0')
  } catch {}
}
</script>

<style scoped>
.content-toggle-btn {
  width: 1.5rem;
  height: 1.5rem;
  padding: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.content-toggle-btn:hover {
  background: var(--vp-c-bg-alt);
}
</style>
