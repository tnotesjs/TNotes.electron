<template>
  <div ref="mermaidRef" class="mermaid-container">
    <div v-if="loading" class="mermaid-loading">Loading diagram...</div>
    <div v-else-if="error" class="mermaid-error">{{ error }}</div>
    <div
      v-show="!loading && !error"
      ref="diagramRef"
      class="mermaid-diagram"
      :class="props.class"
    ></div>
  </div>
</template>

<script setup>
import mermaid from 'mermaid'
import { nextTick, onMounted, ref, watch } from 'vue'

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

const mermaidRef = ref(null)
const diagramRef = ref(null)
const loading = ref(true)
const error = ref(null)

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

  // 清理观察器
  return () => {
    themeObserver.disconnect()
  }
})

// 当图表内容变化时重新渲染
watch(
  () => props.graph,
  () => {
    renderDiagram()
  }
)
</script>

<style scoped>
.mermaid-container {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.mermaid-loading,
.mermaid-error {
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.mermaid-error {
  color: var(--vp-c-red);
}

.mermaid-diagram {
  width: 100%;
  overflow: auto;
  /* 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 暗色主题下的 Mermaid 图表优化 */
html.dark .mermaid-diagram {
  /* background: var(--vp-code-block-bg);
  border-radius: 8px;
  padding: 1rem; */
}
</style>
