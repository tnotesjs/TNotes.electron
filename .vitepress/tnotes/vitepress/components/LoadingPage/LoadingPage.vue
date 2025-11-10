<template>
  <div class="loading-page">
    <div class="loading-container">
      <div class="spinner"></div>
      <h2>{{ message }}</h2>
      <p class="tip">{{ tip }}</p>
      <p v-if="!error" class="countdown">{{ countdown }}秒后自动跳转</p>
      <p v-if="error" class="error-msg">{{ error }}</p>
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

const message = ref(props.message || '正在处理笔记更新')
const tip = ref('请稍候,正在处理中...')
const countdown = ref(2)
const error = ref('')
const { site } = useData()

let timer: NodeJS.Timeout | null = null
let countdownTimer: NodeJS.Timeout | null = null

function goHome() {
  const base = site.value.base || '/'
  window.location.href = base
}

async function fetchNoteInfo(configId: string) {
  try {
    const response = await fetch(
      `/__tnotes_get_note?configId=${encodeURIComponent(configId)}`
    )
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || '查询笔记信息失败')
    }

    if (!result.found) {
      // 笔记不存在或已被删除，跳转到首页
      tip.value = '笔记不存在或已被删除，即将跳转到首页'
      const base = site.value.base || '/'
      return base + 'README'
    }

    // 返回笔记的 URL
    const base = site.value.base || '/'
    return base + result.data.url.slice(1) // 移除开头的 /
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    tip.value = '获取笔记信息失败'
    throw err
  }
}

onMounted(async () => {
  try {
    // 从 URL 参数获取 configId 或直接的 target
    const params = new URLSearchParams(window.location.search)
    const configId = params.get('configId')
    const target = params.get('target')

    let targetUrl: string

    if (configId) {
      // 使用 configId 查询笔记信息
      tip.value = '正在查询笔记信息...'
      targetUrl = await fetchNoteInfo(configId)
    } else if (target) {
      // 使用直接提供的 target URL
      targetUrl = decodeURIComponent(target)
    } else if (props.targetUrl) {
      // 使用 props 传入的 URL
      targetUrl = props.targetUrl
    } else {
      // 没有提供任何参数，直接跳转到首页
      const base = site.value.base || '/'
      targetUrl = base + 'README'
      tip.value = '参数缺失，即将跳转到首页'
    }

    // 倒计时
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
      }
    }, 1000)

    // 等待2秒后跳转到目标页面
    timer = setTimeout(() => {
      window.location.href = targetUrl
    }, 2000)
  } catch (err) {
    console.error('Loading page error:', err)
    // 发生错误时，延迟跳转到首页
    setTimeout(() => {
      goHome()
    }, 3000)
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

.error-msg {
  color: var(--vp-c-danger-1);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
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
