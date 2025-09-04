<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap, IMarkmapOptions } from 'markmap-view'
import { Toolbar } from 'markmap-toolbar'
import 'markmap-toolbar/dist/style.css'

// doc: https://github.com/markmap/markmap/blob/205367a24603dc187f67da1658940c6cade20dce/packages/markmap-view/src/constants.ts#L15
// import { scaleOrdinal, schemePastel2 } from 'd3'
// const defaultColorFn = scaleOrdinal(schemePastel2)

const props = defineProps({
  content: { type: String, default: '' },
  duration: { type: Number, default: 100 },
  spacingVertical: { type: Number, default: 10 },
  spacingHorizontal: { type: Number, default: 20 },
  nodeMinHeight: { type: Number, default: 24 },
  initialExpandLevel: { type: Number, default: 5 },
})

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

let markmapInstance: Markmap | null = null
let observer: MutationObserver | null = null
let toolbarEl: HTMLElement | null = null

const expandLevel = ref(props.initialExpandLevel)
const transformer = new Transformer()
const isFullscreen = ref(false)

function renderMarkmap(content: string, level = expandLevel.value) {
  if (!svgRef.value) return

  nextTick().then(() => {
    if (markmapInstance) {
      try {
        markmapInstance.destroy()
      } catch {}
      markmapInstance = null
    }

    if (!content.trim()) {
      svgRef.value!.innerHTML = '<text x="20" y="30" fill="#999">空内容</text>'
      return
    }

    try {
      const { root } = transformer.transform(content)
      const options: Partial<IMarkmapOptions> = {
        autoFit: true,
        initialExpandLevel: level,
        duration: props.duration,
        nodeMinHeight: props.nodeMinHeight,
        spacingVertical: props.spacingVertical,
        spacingHorizontal: props.spacingHorizontal,
        maxInitialScale: 2,
        maxWidth: 400,
        // default color
        // color: (node): string => defaultColorFn(`${node.state?.path || ''}`),
        // color: (node): string =>
        //   +node.state?.path === 1
        //     ? 'var(--vp-c-brand-3)'
        //     : 'var(--vp-c-brand-1)',
      }

      markmapInstance = Markmap.create(svgRef.value!, options, root)

      setTimeout(() => {
        try {
          markmapInstance?.fit() // 确保居中
        } catch (e) {
          console.warn('fit failed', e)
        }
      }, 0)

      initToolbar()
      setupObserver()
    } catch (error: any) {
      console.error('Markmap render error:', error)
      svgRef.value!.innerHTML = `<text x="20" y="30" fill="red">Markmap 错误: ${error.message}</text>`
    }
  })
}

function initToolbar() {
  if (!markmapInstance || !containerRef.value) return

  // 移除现有的工具栏
  if (toolbarEl) {
    toolbarEl.remove()
  }

  // 创建新工具栏
  const { el } = Toolbar.create(markmapInstance)
  toolbarEl = el
  toolbarEl.style.position = 'absolute'
  toolbarEl.style.top = '1rem'
  toolbarEl.style.right = '.5rem'
  toolbarEl.style.scale = '.8'
  const brand = toolbarEl.querySelector('.mm-toolbar-brand')
  if (brand) toolbarEl.removeChild(brand)
  containerRef.value.appendChild(toolbarEl)

  // 添加自定义全屏按钮
  addFullscreenButton(toolbarEl)

  // 在工具栏中添加更新按钮
  addUpdateButton(toolbarEl)
}

function addFullscreenButton(toolbar: HTMLElement) {
  const fullscreenBtn = document.createElement('div')
  fullscreenBtn.className = 'mm-toolbar-item'
  fullscreenBtn.title = isFullscreen.value ? '退出全屏' : '全屏'
  fullscreenBtn.innerHTML = isFullscreen.value ? 'R' : 'M'
  fullscreenBtn.addEventListener('click', toggleFullscreen)
  toolbar.appendChild(fullscreenBtn)
}

function addUpdateButton(toolbar: HTMLElement) {
  // 创建更新按钮容器
  const updateContainer = document.createElement('div')
  updateContainer.style.display = 'flex'
  updateContainer.style.alignItems = 'center'
  updateContainer.style.gap = '8px'
  updateContainer.style.marginRight = '5px'

  // 创建输入框
  const levelInput = document.createElement('input')
  levelInput.type = 'number'
  levelInput.min = '1'
  levelInput.max = '100'
  levelInput.value = expandLevel.value.toString()
  levelInput.style.width = '2rem'
  levelInput.style.textAlign = 'center'
  levelInput.title = '展开层级'
  levelInput.addEventListener('change', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value)
    if (!isNaN(value)) {
      expandLevel.value = value
    }
  })

  // 创建按钮
  const updateBtn = document.createElement('button')
  updateBtn.innerText = 'L'
  updateBtn.title = '更新层级'
  updateBtn.addEventListener('click', onUpdateClick)

  updateContainer.appendChild(levelInput)
  updateContainer.appendChild(updateBtn)

  // 将更新按钮插入到工具栏开头
  toolbar.insertBefore(updateContainer, toolbar.firstChild)
}

function toggleFullscreen() {
  if (!containerRef.value) return

  if (!isFullscreen.value) {
    // 进入全屏
    if (containerRef.value.requestFullscreen) {
      containerRef.value.requestFullscreen().catch((err) => {
        console.error('全屏请求失败:', err)
      })
    } else if ((containerRef.value as any).webkitRequestFullscreen) {
      ;(containerRef.value as any).webkitRequestFullscreen()
    } else if ((containerRef.value as any).msRequestFullscreen) {
      ;(containerRef.value as any).msRequestFullscreen()
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      ;(document as any).webkitExitFullscreen()
    } else if ((document as any).msExitFullscreen) {
      ;(document as any).msExitFullscreen()
    }
  }
}

// 监听全屏状态变化
function handleFullscreenChange() {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).msFullscreenElement
  )

  // 更新工具栏中的全屏按钮
  if (toolbarEl) {
    const fullscreenBtn = toolbarEl.querySelector(
      '.mm-toolbar-item:last-child'
    ) as HTMLButtonElement
    if (fullscreenBtn) {
      fullscreenBtn.title = isFullscreen.value ? '退出全屏' : '全屏'
      fullscreenBtn.innerHTML = isFullscreen.value ? 'R' : 'M'
    }
  }

  // 全屏模式下调整SVG高度
  if (svgRef.value) {
    if (isFullscreen.value) {
      svgRef.value.style.height = 'calc(100vh - 100px)'
    } else {
      svgRef.value.style.height = '400px'
    }

    // 确保居中 - 无论进入还是退出全屏都执行居中
    setTimeout(() => {
      if (markmapInstance) {
        try {
          markmapInstance.fit() // 重新居中
        } catch (e) {
          console.warn('居中失败', e)
        }
      }
    }, 300)
  }
}

function setupObserver() {
  if (!svgRef.value) return
  if (observer !== null) {
    observer.disconnect()
  }
  observer = new MutationObserver(() => {
    // 如果需要做 DOM 变动后特殊处理，写这里
  })
  observer.observe(svgRef.value, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}

// 只监听内容变化，expandLevel改动不自动渲染
watch(
  () => props.content,
  (newVal) => {
    renderMarkmap(decodeURIComponent(newVal || ''))
  }
)

// 点击更新按钮才用当前 expandLevel 渲染
function onUpdateClick() {
  renderMarkmap(decodeURIComponent(props.content || ''), expandLevel.value)
}

onMounted(() => {
  renderMarkmap(decodeURIComponent(props.content || ''))

  // 添加全屏事件监听
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  if (markmapInstance) {
    try {
      markmapInstance.destroy()
    } catch {}
    markmapInstance = null
  }
  if (observer !== null) {
    observer.disconnect()
    observer = null
  }

  // 移除全屏事件监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
})
</script>

<template>
  <div
    class="markmap-container"
    ref="containerRef"
    style="position: relative; margin: 1rem 0; min-height: 450px"
  >
    <svg ref="svgRef" style="width: 100%; height: 400px"></svg>
  </div>
</template>

<style lang="scss">
/* 全局变量，放到全局 CSS 或 main.css 中更好 */
.markmap-container {
  border-radius: 8px;
  padding: 1rem;
  /* background-color: var(--markmap-bg); */
  overflow: auto;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

/* light background */
.markmap-container {
  background-color: #fff;
}

/* dark background */
.markmap-dark .markmap-container {
  background-color: #1d1d1d;
}

.markmap-container svg {
  min-width: 100%;
  display: block;
  transition: height 0.3s ease;
}

.btn-group {
  color: var(--vp-c-brand-1);
}

.btn-group input {
  display: inline-block;
  width: 2rem;
  text-align: center;
}

.btn-group button {
  outline: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
  &:hover {
    background-color: #e0e0e0;
  }
}

.markmap-dark .btn-group button {
  background-color: #333;
  color: #fff;
  &:hover {
    background-color: #444;
  }
}

a {
  text-decoration: none !important;
}

/* 全屏样式 */
.markmap-container:fullscreen {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.markmap-dark .markmap-container:fullscreen {
  background: #1d1d1d;
}

.markmap-container:-ms-fullscreen {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.markmap-container:-webkit-full-screen {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 工具栏样式调整 */
.mm-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: rgb(39 39 42);
}

.markmap-dark .mm-toolbar {
  background: rgba(30, 30, 30, 0.8);
  color: rgb(228 228 231);
}

.mm-toolbar-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  &:hover {
    background-color: #f0f0f0;
  }
}

.markmap-dark .mm-toolbar-item:hover {
  background-color: #333;
}

/* toolbar 默认隐藏 */
.mm-toolbar {
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s ease;
}

/* 鼠标悬停显示 toolbar */
.markmap-container:hover .mm-toolbar {
  opacity: 1;
  pointer-events: auto;
}
</style>
