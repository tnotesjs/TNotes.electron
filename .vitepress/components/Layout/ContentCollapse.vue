<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import icon__collapse from '/icon__collapse.svg'
import './ContentCollapse.module.scss'

const route = useRoute()

// 存储折叠状态的 localStorage key 前缀
const COLLAPSE_STATE_PREFIX = 'tnotes_collapse_state_'

// 获取当前笔记的唯一标识
function getCurrentNoteKey(): string {
  return route.path.replace(/\//g, '_')
}

// 保存折叠状态
function saveCollapseState(key: string, collapsed: boolean) {
  const noteKey = getCurrentNoteKey()
  const storageKey = `${COLLAPSE_STATE_PREFIX}${noteKey}_${key}`
  localStorage.setItem(storageKey, collapsed ? '1' : '0')
}

// 获取折叠状态
function getCollapseState(key: string): boolean {
  const noteKey = getCurrentNoteKey()
  const storageKey = `${COLLAPSE_STATE_PREFIX}${noteKey}_${key}`
  return localStorage.getItem(storageKey) === '1'
}

// 切换折叠状态
function toggleCollapse(
  button: HTMLElement,
  content: HTMLElement,
  key: string
) {
  const isCollapsed = content.classList.contains('collapsed')
  content.classList.toggle('collapsed')
  button.classList.toggle('collapsed')

  // 保存状态
  saveCollapseState(key, !isCollapsed)
}

// 初始化 TOC 折叠功能
function initTocCollapse() {
  console.log('[ContentCollapse] 初始化 TOC 折叠功能')

  // 查找 region:toc 注释
  const walker = document.createTreeWalker(
    document.querySelector('.vp-doc') || document.body,
    NodeFilter.SHOW_COMMENT,
    null
  )

  let tocStartComment: Comment | null = null
  let tocEndComment: Comment | null = null

  while (walker.nextNode()) {
    const comment = walker.currentNode as Comment
    if (comment.textContent?.trim() === 'region:toc') {
      tocStartComment = comment
      console.log('[ContentCollapse] 找到 TOC 开始注释')
    } else if (comment.textContent?.trim() === 'endregion:toc') {
      tocEndComment = comment
      console.log('[ContentCollapse] 找到 TOC 结束注释')
      break
    }
  }

  if (!tocStartComment || !tocEndComment) {
    console.log('[ContentCollapse] 未找到 TOC 注释区域')
    return
  }

  // 获取 TOC 区域的所有内容
  const tocElements: Node[] = []
  let current: Node | null = tocStartComment.nextSibling

  while (current && current !== tocEndComment) {
    tocElements.push(current)
    current = current.nextSibling
  }

  if (tocElements.length === 0) return

  // 创建折叠容器
  const collapseWrapper = document.createElement('div')
  collapseWrapper.className = 'toc-collapse-wrapper'

  // 创建折叠头部（可点击区域）
  const collapseHeader = document.createElement('div')
  collapseHeader.className = 'collapse-header toc-collapse-header'
  collapseHeader.setAttribute('role', 'button')
  collapseHeader.setAttribute('aria-label', '折叠/展开目录')
  collapseHeader.setAttribute('title', '点击折叠/展开目录')

  // 创建标签（折叠时显示）
  const collapseLabel = document.createElement('span')
  collapseLabel.className = 'collapse-label'
  collapseLabel.textContent = '目录'

  // 创建折叠按钮
  const collapseButton = document.createElement('button')
  collapseButton.className = 'collapse-toggle toc-collapse-toggle'
  collapseButton.setAttribute('aria-hidden', 'true') // 装饰性，实际点击区域是 header

  // 使用 SVG 图标
  const collapseIcon = document.createElement('img')
  collapseIcon.src = icon__collapse
  collapseIcon.alt = 'collapse icon'
  collapseIcon.className = 'collapse-icon'
  collapseButton.appendChild(collapseIcon)

  // 组装头部
  collapseHeader.appendChild(collapseLabel)
  collapseHeader.appendChild(collapseButton)

  // 创建内容容器
  const contentWrapper = document.createElement('div')
  contentWrapper.className = 'collapse-content toc-collapse-content'

  // 移动 TOC 内容到容器中
  tocElements.forEach((el) => {
    contentWrapper.appendChild(el)
  })

  // 组装结构
  collapseWrapper.appendChild(collapseHeader)
  collapseWrapper.appendChild(contentWrapper)

  // 插入到 TOC 开始注释之后
  tocStartComment.parentNode?.insertBefore(
    collapseWrapper,
    tocStartComment.nextSibling
  )

  // 恢复折叠状态（默认展开）
  const isCollapsed = getCollapseState('toc')
  if (isCollapsed) {
    contentWrapper.classList.add('collapsed')
    collapseHeader.classList.add('collapsed')
  }

  // 绑定点击事件到整个头部，支持文本选择
  let mouseDownTime = 0
  let mouseDownX = 0
  let mouseDownY = 0

  collapseHeader.addEventListener('mousedown', (e) => {
    mouseDownTime = Date.now()
    mouseDownX = e.clientX
    mouseDownY = e.clientY
  })

  collapseHeader.addEventListener('mouseup', (e) => {
    const mouseUpTime = Date.now()
    const duration = mouseUpTime - mouseDownTime
    const moveX = Math.abs(e.clientX - mouseDownX)
    const moveY = Math.abs(e.clientY - mouseDownY)

    // 判断是否为点击行为：
    // 1. 持续时间小于 200ms
    // 2. 鼠标移动距离小于 5px
    // 3. 没有选中文本
    const isClick = duration < 200 && moveX < 5 && moveY < 5
    const hasSelection = window.getSelection()?.toString().length ?? 0 > 0

    if (isClick && !hasSelection) {
      console.log('[ContentCollapse] TOC 折叠区域被点击')
      const isCollapsed = contentWrapper.classList.contains('collapsed')
      contentWrapper.classList.toggle('collapsed')
      collapseHeader.classList.toggle('collapsed')
      saveCollapseState('toc', !isCollapsed)
    }
  })

  console.log('[ContentCollapse] TOC 折叠功能初始化完成')
}

// 初始化二级标题折叠功能
function initH2Collapse() {
  console.log('[ContentCollapse] 初始化 H2 折叠功能')

  const vpDoc = document.querySelector('.vp-doc')
  if (!vpDoc) {
    console.log('[ContentCollapse] 未找到 .vp-doc 容器')
    return
  }

  const h2Elements = vpDoc.querySelectorAll('h2')
  console.log(`[ContentCollapse] 找到 ${h2Elements.length} 个 h2 标题`)

  h2Elements.forEach((h2) => {
    // 跳过已经处理过的
    if (h2.querySelector('.collapse-toggle')) return

    // 获取 h2 的 id 作为唯一标识
    const h2Id = h2.id || `h2_${Array.from(h2Elements).indexOf(h2)}`

    // 为 h2 添加可点击的类
    h2.classList.add('collapsible-h2')
    h2.setAttribute('role', 'button')
    h2.setAttribute('aria-label', '折叠/展开章节')
    h2.setAttribute('title', '点击折叠/展开章节')

    // 创建折叠按钮
    const collapseButton = document.createElement('button')
    collapseButton.className = 'collapse-toggle h2-collapse-toggle'
    collapseButton.setAttribute('aria-hidden', 'true') // 装饰性

    // 使用 SVG 图标
    const collapseIcon = document.createElement('img')
    collapseIcon.src = icon__collapse
    collapseIcon.alt = 'collapse icon'
    collapseIcon.className = 'collapse-icon'
    collapseButton.appendChild(collapseIcon)

    // 收集 h2 后面的内容直到下一个 h2
    const contentElements: Element[] = []
    let nextSibling = h2.nextElementSibling

    while (nextSibling && nextSibling.tagName !== 'H2') {
      contentElements.push(nextSibling)
      nextSibling = nextSibling.nextElementSibling
    }

    // 如果没有内容，不添加折叠按钮
    if (contentElements.length === 0) return

    // 创建内容容器
    const contentWrapper = document.createElement('div')
    contentWrapper.className = 'collapse-content h2-collapse-content'

    // 移动内容到容器中
    contentElements.forEach((el) => {
      contentWrapper.appendChild(el)
    })

    // 将折叠按钮插入到 h2 内部的末尾
    h2.appendChild(collapseButton)

    // 将内容容器插入到 h2 后面
    h2.parentNode?.insertBefore(contentWrapper, h2.nextSibling)

    // 恢复折叠状态（默认展开）
    const isCollapsed = getCollapseState(`h2_${h2Id}`)
    console.log(
      `[ContentCollapse] H2 ${h2Id} 初始状态: ${isCollapsed ? '折叠' : '展开'}`
    )
    if (isCollapsed) {
      contentWrapper.classList.add('collapsed')
      h2.classList.add('collapsed')
    }

    // 绑定点击事件到整个 h2，支持文本选择
    let mouseDownTime = 0
    let mouseDownX = 0
    let mouseDownY = 0

    h2.addEventListener('mousedown', (e) => {
      // 如果点击的是链接，不记录时间（让链接正常工作）
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.closest('a')) {
        return
      }
      mouseDownTime = Date.now()
      mouseDownX = e.clientX
      mouseDownY = e.clientY
    })

    h2.addEventListener('mouseup', (e) => {
      // 不阻止锚点链接的默认行为
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.closest('a')) {
        return
      }

      const mouseUpTime = Date.now()
      const duration = mouseUpTime - mouseDownTime
      const moveX = Math.abs(e.clientX - mouseDownX)
      const moveY = Math.abs(e.clientY - mouseDownY)

      // 判断是否为点击行为：
      // 1. 持续时间小于 200ms
      // 2. 鼠标移动距离小于 5px
      // 3. 没有选中文本
      const isClick = duration < 200 && moveX < 5 && moveY < 5
      const hasSelection = window.getSelection()?.toString().length ?? 0 > 0

      if (isClick && !hasSelection) {
        console.log(`[ContentCollapse] H2 被点击: ${h2Id}`)
        const isCollapsed = contentWrapper.classList.contains('collapsed')
        contentWrapper.classList.toggle('collapsed')
        h2.classList.toggle('collapsed')
        saveCollapseState(`h2_${h2Id}`, !isCollapsed)
      }
    })
  })

  console.log('[ContentCollapse] H2 折叠功能初始化完成')
}

// 初始化所有折叠功能
function initAllCollapse() {
  // 延迟执行以确保 DOM 已经渲染完成
  setTimeout(() => {
    initTocCollapse()
    initH2Collapse()
  }, 100)
}

// 清理折叠功能
function cleanupCollapse() {
  // 移除所有折叠相关的元素
  document
    .querySelectorAll('.toc-collapse-wrapper')
    .forEach((el) => el.remove())
  document.querySelectorAll('.h2-collapse-toggle').forEach((el) => el.remove())
  document.querySelectorAll('.h2-collapse-content').forEach((el) => {
    // 将内容移回原位
    const parent = el.parentElement
    while (el.firstChild) {
      parent?.insertBefore(el.firstChild, el)
    }
    el.remove()
  })
}

// 清除所有折叠状态
function clearAllCollapseStates() {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith(COLLAPSE_STATE_PREFIX)
  )
  keys.forEach((key) => localStorage.removeItem(key))
  console.log(`已清除 ${keys.length} 个折叠状态`)
  // 重新初始化
  cleanupCollapse()
  initAllCollapse()
}

// 组件挂载时初始化
onMounted(() => {
  initAllCollapse()

  // 添加全局函数，方便调试
  if (typeof window !== 'undefined') {
    ;(window as any).clearAllCollapseStates = clearAllCollapseStates
  }
})

// 路由变化时重新初始化
watch(
  () => route.path,
  () => {
    cleanupCollapse()
    initAllCollapse()
  }
)

// 组件卸载时清理
onUnmounted(() => {
  cleanupCollapse()

  // 清理全局函数
  if (typeof window !== 'undefined') {
    delete (window as any).clearAllCollapseStates
  }
})
</script>
