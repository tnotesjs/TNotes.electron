<template>
  <div
    ref="mermaidRef"
    :class="[$style.mermaidWrapper, { [$style.showToolbar]: showToolbar }]"
    @mouseenter="showToolbar = true"
    @mouseleave="showToolbar = false"
  >
    <!-- 工具栏 -->
    <div
      v-if="!loading && !error"
      :class="[$style.toolbar, { [$style.visible]: showToolbar }]"
    >
      <button
        @click="zoomIn"
        :class="[$style.toolbarBtn, $style.iconBtn]"
        title="放大 (Ctrl + +)"
      >
        <img :src="icon__zoom_in" alt="放大" :class="$style.btnIcon" />
      </button>
      <button
        @click="zoomOut"
        :class="[$style.toolbarBtn, $style.iconBtn]"
        title="缩小 (Ctrl + -)"
      >
        <img :src="icon__zoom_out" alt="缩小" :class="$style.btnIcon" />
      </button>
      <button
        @click="resetZoom"
        :class="[$style.toolbarBtn, $style.iconBtn]"
        title="重置缩放 (Ctrl + 0)"
      >
        <img :src="icon__zoom_reset" alt="重置" :class="$style.btnIcon" />
      </button>
      <button
        @click="fitToScreen"
        :class="[$style.toolbarBtn, $style.iconBtn]"
        title="适应屏幕"
      >
        <img :src="icon__zoom_fit" alt="适应屏幕" :class="$style.btnIcon" />
      </button>
      <button
        @click="toggleFullscreen"
        :class="[$style.toolbarBtn, $style.iconBtn]"
        title="全屏 (F11)"
      >
        <img
          v-if="isFullscreen"
          :src="icon__fullscreen_exit"
          alt="退出全屏"
          :class="$style.btnIcon"
        />
        <img
          v-else
          :src="icon__fullscreen"
          alt="全屏"
          :class="$style.btnIcon"
        />
      </button>
      <span :class="$style.zoomLevel">{{ Math.round(scale * 100) }}%</span>
    </div>

    <!-- 图表容器 -->
    <div
      :class="[$style.mermaidContainer, { [$style.fullscreen]: isFullscreen }]"
      @click="handleContainerClick"
    >
      <div v-if="loading" :class="$style.mermaidLoading">
        <div :class="$style.spinner"></div>
        <p>加载图表中...</p>
      </div>
      <div v-else-if="error" :class="$style.mermaidError">
        <span :class="$style.errorIcon">⚠️</span>
        <p>{{ error }}</p>
      </div>
      <div
        v-show="!loading && !error"
        ref="diagramRef"
        :class="[$style.mermaidDiagram, props.class]"
        :style="{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }"
        @wheel.prevent="handleWheel"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import icon__zoom_in from '/icon__zoom_in.svg'
import icon__zoom_out from '/icon__zoom_out.svg'
import icon__zoom_reset from '/icon__zoom_reset.svg'
import icon__zoom_fit from '/icon__zoom_fit.svg'
import icon__fullscreen from '/icon__fullscreen.svg'
import icon__fullscreen_exit from '/icon__fullscreen_exit.svg'

const props = defineProps({
  graph: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: 'mermaid',
  },
})

const mermaidRef = ref<HTMLElement | null>(null)
const diagramRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const scale = ref(1)
const isFullscreen = ref(false)
const showToolbar = ref(false)

// ===================================
// #region 工具栏显示控制
// ===================================
let hideTimer: ReturnType<typeof setTimeout> | null = null

function handleContainerClick() {
  // 移动端点击切换工具栏显示
  if (window.innerWidth <= 768) {
    showToolbar.value = !showToolbar.value

    // 3秒后自动隐藏
    if (showToolbar.value) {
      if (hideTimer) clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        showToolbar.value = false
      }, 3000)
    }
  }
}
// #endregion

// ===================================
// #region 缩放控制
// ===================================
const MIN_SCALE = 0.1
const MAX_SCALE = 5
const SCALE_STEP = 0.1

function zoomIn() {
  scale.value = Math.min(scale.value + SCALE_STEP, MAX_SCALE)
}

function zoomOut() {
  scale.value = Math.max(scale.value - SCALE_STEP, MIN_SCALE)
}

function resetZoom() {
  scale.value = 1
}

function fitToScreen() {
  if (!diagramRef.value || !mermaidRef.value) return

  const svg = diagramRef.value.querySelector('svg')
  if (!svg) return

  const containerRect = mermaidRef.value.getBoundingClientRect()
  const svgRect = svg.getBoundingClientRect()

  const scaleX = (containerRect.width * 0.9) / svgRect.width
  const scaleY = (containerRect.height * 0.9) / svgRect.height

  scale.value = Math.min(scaleX, scaleY, 1)
}

function handleWheel(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
    scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value + delta))
  }
}
// #endregion

// ===================================
// #region 全屏控制
// ===================================
function toggleFullscreen() {
  if (!mermaidRef.value) return

  if (!isFullscreen.value) {
    if (mermaidRef.value.requestFullscreen) {
      mermaidRef.value.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}
// #endregion

// ===================================
// #region 键盘快捷键
// ===================================
function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === '=' || e.key === '+') {
      e.preventDefault()
      zoomIn()
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      zoomOut()
    } else if (e.key === '0') {
      e.preventDefault()
      resetZoom()
    }
  } else if (e.key === 'F11') {
    e.preventDefault()
    toggleFullscreen()
  } else if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}
// #endregion

// ===================================
// #region Mermaid 渲染
// ===================================
// 获取当前主题
const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'default'
}

// 初始化 Mermaid
const initMermaid = async () => {
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: getCurrentTheme(),
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })
  } catch (err) {
    console.error('Mermaid initialization error:', err)
  }
}

// 渲染图表
const renderDiagram = async () => {
  // 等待下一个 DOM 更新周期
  await nextTick()

  if (!diagramRef.value) {
    // 再等待一小段时间确保 DOM 完全渲染
    await new Promise((resolve) => setTimeout(resolve, 0))
    if (!diagramRef.value) {
      // console.warn('diagramRef is still null')
      return
    }
  }

  try {
    loading.value = true
    error.value = null

    // 每次渲染前都重新初始化主题
    mermaid.initialize({
      startOnLoad: false,
      theme: getCurrentTheme(),
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })

    const { svg, bindFunctions } = await mermaid.render(
      props.id,
      decodeURIComponent(props.graph)
    )

    diagramRef.value.innerHTML = svg

    // 绑定交互函数（如果有）
    if (bindFunctions) {
      bindFunctions(diagramRef.value)
    }
  } catch (err) {
    error.value = `Failed to render diagram: ${err.message}`
    console.error('Mermaid render error:', err)
  } finally {
    loading.value = false
  }
}

// 监听主题变化
const observeTheme = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        // 检查是否是主题变化
        const isDark = document.documentElement.classList.contains('dark')
        const wasDark = mutation.oldValue?.includes('dark')

        // 只有当主题实际发生变化时才重新渲染
        if ((isDark && !wasDark) || (!isDark && wasDark)) {
          renderDiagram()
        }
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true,
  })

  return observer
}

onMounted(async () => {
  await initMermaid()
  await renderDiagram()

  // 观察主题变化
  const themeObserver = observeTheme()

  // 监听键盘事件
  document.addEventListener('keydown', handleKeydown)

  // 监听全屏变化
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  // 清理函数
  onBeforeUnmount(() => {
    themeObserver.disconnect()
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })
})

// 当图表内容变化时重新渲染并重置缩放
watch(
  () => props.graph,
  () => {
    renderDiagram()
    resetZoom()
  }
)
// #endregion
</script>

<style module src="./Mermaid.module.scss"></style>
