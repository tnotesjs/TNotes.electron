<template>
  <div class="loading-page">
    <div class="loading-container">
      <div class="spinner"></div>
      <h2>{{ message }}</h2>
      <p class="tip">请稍候,正在处理中...</p>
      <p class="countdown">{{ countdown }}秒后自动跳转</p>
      <button class="back-home-btn" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  targetUrl?: string
  message?: string
}>()

const message = ref(props.message || '正在重命名笔记')
const countdown = ref(2)
const { site } = useData()

let timer: NodeJS.Timeout | null = null
let countdownTimer: NodeJS.Timeout | null = null

function goHome() {
  const base = site.value.base || '/'
  window.location.href = base
}

onMounted(() => {
  // 从 URL 参数获取目标地址
  const params = new URLSearchParams(window.location.search)
  const targetUrl = params.get('target') || props.targetUrl

  if (targetUrl) {
    // 倒计时
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
      }
    }, 1000)

    // 等待2秒后跳转到目标页面
    timer = setTimeout(() => {
      window.location.href = decodeURIComponent(targetUrl)
    }, 2000)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 2rem;
  border: 4px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h2 {
  font-size: 1.5rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.tip {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.countdown {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.back-home-btn {
  padding: 0.5rem 1.5rem;
  background-color: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.back-home-btn:hover {
  background-color: var(--vp-c-brand-2);
}
</style>
