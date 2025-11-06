<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap, IMarkmapOptions } from 'markmap-view'
import { Toolbar } from 'markmap-toolbar'
import 'markmap-toolbar/dist/style.css'
import { MARKMAP_THEME_KEY, MARKMAP_EXPAND_LEVEL_KEY } from '../constants'
import { withBase } from 'vitepress'

// doc: https://github.com/markmap/markmap/blob/205367a24603dc187f67da1658940c6cade20dce/packages/markmap-view/src/constants.ts#L15
import { scaleOrdinal, schemePastel2, schemeSet3, schemeTableau10 } from 'd3'

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

// 从 localStorage 读取配置，如果没有则使用 props 或默认值
const getInitialExpandLevel = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(MARKMAP_EXPAND_LEVEL_KEY)
    if (saved) return parseInt(saved)
  }
  return props.initialExpandLevel
}

const getThemeColorFn = () => {
  if (typeof window !== 'undefined') {
    const theme = localStorage.getItem(MARKMAP_THEME_KEY) || 'default'
    switch (theme) {
      case 'colorful':
        return scaleOrdinal(schemeTableau10)
      case 'dark':
        return scaleOrdinal(schemeSet3)
      default:
        return scaleOrdinal(schemePastel2)
    }
  }
  return scaleOrdinal(schemePastel2)
}

// 可由配置/props 初始化，也可以通过工具栏改动
const expandLevel = ref(getInitialExpandLevel())
const transformer = new Transformer()
const isFullscreen = ref(false)

// 保存工具栏中层级输入框的引用，方便同步显示与绑定事件
let toolbarLevelInput: HTMLInputElement | null = null

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
      const colorFn = getThemeColorFn()
      const options: Partial<IMarkmapOptions> = {
        // autoFit 会自动调整 scale 和 position 来适配当前容器大小，在阅读大量节点内容的时候，会放大某块区域阅读，每次展开节点或者收起节点，都会自动触发 autoFit，导致阅读体验不佳，因此不启用。
        // autoFit: true,
        initialExpandLevel: level,
        duration: props.duration,
        nodeMinHeight: props.nodeMinHeight,
        spacingVertical: props.spacingVertical,
        spacingHorizontal: props.spacingHorizontal,
        maxInitialScale: 2,
        maxWidth: 400,
        // 使用配置的主题颜色
        color: (node): string => colorFn(`${node.state?.path || ''}`),
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
    toolbarEl = null
    toolbarLevelInput = null
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

  // 在工具栏中添加更新按钮 + 层级输入（并支持 Enter 键触发）
  addUpdateButton(toolbarEl)
}

function addFullscreenButton(toolbar: HTMLElement) {
  const fullscreenBtn = document.createElement('div')
  fullscreenBtn.className = 'mm-toolbar-item'
  fullscreenBtn.title = isFullscreen.value ? '退出全屏' : '全屏'
  // 使用 public 目录下的 svg 图标，保持大小和可访问性
  fullscreenBtn.innerHTML = isFullscreen.value
    ? `<img src="${withBase(
        '/icon__fullscreen_exit.svg'
      )}" alt="退出全屏" style="width:18px;height:18px;display:block" />`
    : `<img src="${withBase(
        '/icon__fullscreen.svg'
      )}" alt="全屏" style="width:18px;height:18px;display:block" />`
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

  // 创建输入框（确保具有 id/name，且样式能在工具栏中清晰可见）
  const levelInput = document.createElement('input')
  levelInput.type = 'number'
  levelInput.id = 'markmap-expand-level'
  levelInput.name = 'markmap-expand-level'
  levelInput.min = '1'
  levelInput.max = '100'
  levelInput.value = expandLevel.value.toString()
  levelInput.style.width = '2.4rem'
  levelInput.style.height = '1.6rem'
  levelInput.style.padding = '2px 6px'
  levelInput.style.fontSize = '12px'
  levelInput.style.lineHeight = '1.2'
  levelInput.style.textAlign = 'center'
  levelInput.style.boxSizing = 'border-box'
  levelInput.style.borderBottom = '.5px solid var(--vp-c-tip-1)'
  // levelInput.style.borderRadius = '4px'
  // levelInput.style.background = 'var(--vp-c-bg)'
  levelInput.style.color = 'var(--vp-c-tip-1)'
  levelInput.title = '展开层级'
  levelInput.setAttribute('aria-label', 'markmap-expand-level')

  // 保存引用，供外部（props 改变）同步输入值
  toolbarLevelInput = levelInput

  // 实时限制输入范围（1-100）
  levelInput.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement
    let value = parseInt(input.value)

    // 如果输入为空或非数字，不做处理
    if (input.value === '' || isNaN(value)) return

    // 限制范围：1-100
    if (value < 1) {
      input.value = '1'
      value = 1
    } else if (value > 100) {
      input.value = '100'
      value = 100
    }
  })

  // 当输入框值变化时仅更新内部 expandLevel（不自动渲染）
  levelInput.addEventListener('change', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value)
    if (!isNaN(value) && value >= 1 && value <= 100) {
      expandLevel.value = value
    } else {
      // 回退到之前的值（避免非法输入）
      levelInput.value = expandLevel.value.toString()
    }
  })

  // 按键监听：按 Enter 时触发更新（相当于点击确认按钮）
  levelInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // 同步输入框值到 expandLevel（防止未触发 change）
      const val = parseInt((e.target as HTMLInputElement).value)
      if (!isNaN(val) && val >= 1 && val <= 100) {
        expandLevel.value = val
      } else {
        // 如果超出范围，重置为有效值
        levelInput.value = expandLevel.value.toString()
      }
      onUpdateClick()
    }
  })

  // 创建按钮
  const updateBtn = document.createElement('button')
  updateBtn.type = 'button'
  updateBtn.title = '确定层级并更新'
  // 使用确认图标（public 目录）
  updateBtn.innerHTML = `<img src="${withBase(
    '/icon__confirm.svg'
  )}" alt="确定" style="width:16px;height:16px;display:block" />`
  updateBtn.addEventListener('click', onUpdateClick)

  updateContainer.appendChild(levelInput)
  updateContainer.appendChild(updateBtn)

  // 将更新按钮插入到工具栏开头
  toolbar.insertBefore(updateContainer, toolbar.firstChild)
}

// 切换全屏（保持原来的实现）
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

  // 更新工具栏中的全屏按钮（若存在）
  if (toolbarEl) {
    const fullscreenBtn = toolbarEl.querySelector(
      '.mm-toolbar-item:last-child'
    ) as HTMLButtonElement
    if (fullscreenBtn) {
      fullscreenBtn.title = isFullscreen.value
        ? '退出全屏（Exit Fullscreen）'
        : '全屏（Fullscreen）'
      // 切换图标（全屏 / 退出全屏）
      fullscreenBtn.innerHTML = isFullscreen.value
        ? `<img src="${withBase(
            '/icon__fullscreen_exit.svg'
          )}" alt="退出全屏" style="width:18px;height:18px;display:block" />`
        : `<img src="${withBase(
            '/icon__fullscreen.svg'
          )}" alt="全屏" style="width:18px;height:18px;display:block" />`
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
          markmapInstance.fit()
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
    // DOM 变动后处理（保留扩展点）
  })
  observer.observe(svgRef.value, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}

// 只监听内容变化，expandLevel 改动不自动渲染（点击/Enter 确认渲染）
watch(
  () => props.content,
  (newVal) => {
    renderMarkmap(decodeURIComponent(newVal || ''))
  }
)

// 新增：当外部传入的 initialExpandLevel 改变时，组件应同步并重新渲染
watch(
  () => props.initialExpandLevel,
  (newVal) => {
    if (typeof newVal === 'number' && !isNaN(newVal)) {
      expandLevel.value = newVal
      // 更新输入框显示（如果已创建）
      if (toolbarLevelInput) toolbarLevelInput.value = newVal.toString()
      // 重新渲染使用新的层级（保持对外部 prop 改动的即时响应）
      renderMarkmap(decodeURIComponent(props.content || ''), newVal)
    }
  }
)

// 同步：当内部 expandLevel 变更时（例如通过输入框 change 事件），更新工具栏输入显示
watch(expandLevel, (v) => {
  if (toolbarLevelInput) {
    const asStr = (v || 0).toString()
    if (toolbarLevelInput.value !== asStr) {
      toolbarLevelInput.value = asStr
    }
  }
})

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
    :class="$style.markmapContainer"
    ref="containerRef"
    style="position: relative"
  >
    <svg ref="svgRef" style="width: 100%; height: 400px"></svg>
  </div>
</template>

<style module src="./MarkMap.module.scss"></style>
