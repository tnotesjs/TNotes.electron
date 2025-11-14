<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute, onContentUpdated } from 'vitepress'
import icon__collapse from '/icon__collapse.svg'

const route = useRoute()

// 存储折叠状态的 localStorage key 前缀
const COLLAPSE_STATE_PREFIX = 'tnotes_collapse_state_'

// 防止重复初始化的标志
let isInitializing = false
let reinitTimer: ReturnType<typeof setTimeout> | null = null

// 获取当前笔记的唯一标识
function getCurrentNoteKey(): string {
  return route.path.replace(/\//g, '_')
}

// 保存折叠状态
function saveCollapseState(key: string, collapsed: boolean) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return
  }
  const noteKey = getCurrentNoteKey()
  const storageKey = `${COLLAPSE_STATE_PREFIX}${noteKey}_${key}`
  localStorage.setItem(storageKey, collapsed ? '1' : '0')
}

// 获取折叠状态
function getCollapseState(key: string): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false
  }
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
  const vpDoc = document.querySelector('.vp-doc')
  if (!vpDoc) {
    return false
  }

  // 方案1: 查找 region:toc 注释
  const walker = document.createTreeWalker(vpDoc, NodeFilter.SHOW_COMMENT, null)

  let tocStartComment: Comment | null = null
  let tocEndComment: Comment | null = null

  while (walker.nextNode()) {
    const comment = walker.currentNode as Comment
    const commentText = comment.textContent?.trim()

    if (commentText === 'region:toc') {
      tocStartComment = comment
    } else if (commentText === 'endregion:toc') {
      tocEndComment = comment
      break
    }
  }

  // 如果找到注释,使用注释方式处理
  if (tocStartComment && tocEndComment) {
    return initTocCollapseByComments(tocStartComment, tocEndComment)
  }

  // 方案2: 如果注释不存在(生产构建可能移除注释),使用结构化查找
  return initTocCollapseByStructure(vpDoc)
}

// 通过注释初始化 TOC 折叠
function initTocCollapseByComments(
  tocStartComment: Comment,
  tocEndComment: Comment
): boolean {
  // 获取 TOC 区域的所有内容
  const tocElements: Node[] = []
  let current: Node | null = tocStartComment.nextSibling

  while (current && current !== tocEndComment) {
    tocElements.push(current)
    current = current.nextSibling
  }

  if (tocElements.length === 0) {
    return false
  }

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
      const isCollapsed = contentWrapper.classList.contains('collapsed')
      contentWrapper.classList.toggle('collapsed')
      collapseHeader.classList.toggle('collapsed')
      saveCollapseState('toc', !isCollapsed)
    }
  })

  return true
}

// 通过结构化查找初始化 TOC 折叠(用于生产环境)
function initTocCollapseByStructure(vpDoc: Element): boolean {
  // 在生产环境中,尝试查找第一个 h2 之前的所有 ul/ol 元素作为 TOC
  // 通常 TOC 会在文档开头,第一个 h2 之前
  const firstH2 = vpDoc.querySelector('h2')
  if (!firstH2) {
    return false
  }

  // 查找第一个 h2 之前的所有列表元素
  const tocElements: Element[] = []
  let current = firstH2.previousElementSibling

  while (current) {
    // 如果是列表,可能是 TOC
    if (current.tagName === 'UL' || current.tagName === 'OL') {
      tocElements.unshift(current) // 添加到开头保持顺序
    }
    // 如果遇到其他块级元素(如 p, h1 等),停止查找
    else if (
      current.tagName === 'P' ||
      current.tagName === 'H1' ||
      current.tagName === 'DIV'
    ) {
      // 如果是空的 p 标签或只有空白,继续
      if (current.textContent?.trim()) {
        break
      }
    }
    current = current.previousElementSibling
  }

  if (tocElements.length === 0) {
    return false
  }

  // 保存第一个 TOC 元素的位置信息
  const firstTocElement = tocElements[0]
  const insertParent = firstTocElement.parentNode
  const insertBefore = firstTocElement

  // 创建折叠容器
  const collapseWrapper = document.createElement('div')
  collapseWrapper.className = 'toc-collapse-wrapper'

  // 创建折叠头部
  const collapseHeader = document.createElement('div')
  collapseHeader.className = 'collapse-header toc-collapse-header'
  collapseHeader.setAttribute('role', 'button')
  collapseHeader.setAttribute('aria-label', '折叠/展开目录')
  collapseHeader.setAttribute('title', '点击折叠/展开目录')

  // 创建标签
  const collapseLabel = document.createElement('span')
  collapseLabel.className = 'collapse-label'
  collapseLabel.textContent = '目录'

  // 创建折叠按钮
  const collapseButton = document.createElement('button')
  collapseButton.className = 'collapse-toggle toc-collapse-toggle'
  collapseButton.setAttribute('aria-hidden', 'true')

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

  // 组装结构
  collapseWrapper.appendChild(collapseHeader)
  collapseWrapper.appendChild(contentWrapper)

  // 先插入折叠容器
  insertParent?.insertBefore(collapseWrapper, insertBefore)

  // 再移动 TOC 内容到容器中
  tocElements.forEach((el) => {
    contentWrapper.appendChild(el)
  })

  // 恢复折叠状态
  const isCollapsed = getCollapseState('toc')
  if (isCollapsed) {
    contentWrapper.classList.add('collapsed')
    collapseHeader.classList.add('collapsed')
  }

  // 绑定点击事件
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

    const isClick = duration < 200 && moveX < 5 && moveY < 5
    const hasSelection = window.getSelection()?.toString().length ?? 0 > 0

    if (isClick && !hasSelection) {
      const isCollapsed = contentWrapper.classList.contains('collapsed')
      contentWrapper.classList.toggle('collapsed')
      collapseHeader.classList.toggle('collapsed')
      saveCollapseState('toc', !isCollapsed)
    }
  })

  return true
}

// 初始化二级标题折叠功能
function initH2Collapse() {
  const vpDoc = document.querySelector('.vp-doc')
  if (!vpDoc) {
    return
  }

  const h2Elements = vpDoc.querySelectorAll('h2')

  h2Elements.forEach((h2) => {
    // 跳过已经处理过的
    if (h2.querySelector('.collapse-toggle')) return

    // 获取 h2 的 id 作为唯一标识
    const h2Id = h2.id || `h2_${Array.from(h2Elements).indexOf(h2)}`

    // 先清除可能存在的旧状态（避免状态冲突）
    h2.classList.remove('collapsible-h2', 'collapsed')
    h2.removeAttribute('role')
    h2.removeAttribute('aria-label')
    h2.removeAttribute('title')

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
    // console.log(
    //   `[initH2] h2Id: ${h2Id}, isCollapsed from localStorage: ${isCollapsed}`
    // )

    if (isCollapsed) {
      contentWrapper.classList.add('collapsed')
      h2.classList.add('collapsed')
      // console.log(`[initH2] Added collapsed class to h2 and contentWrapper`)
      // console.log(`[initH2] h2.classList:`, h2.classList.toString())
      // console.log(
      //   `[initH2] contentWrapper.classList:`,
      //   contentWrapper.classList.toString()
      // )
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
        // console.log(`[H2 Click] h2Id: ${h2Id}`)
        // console.log('[H2 Click] contentWrapper:', contentWrapper)
        // console.log('[H2 Click] h2 element:', h2)
        // console.log(
        //   '[H2 Click] isCollapsed before toggle:',
        //   contentWrapper.classList.contains('collapsed')
        // )

        const isCollapsed = contentWrapper.classList.contains('collapsed')
        contentWrapper.classList.toggle('collapsed')
        h2.classList.toggle('collapsed')

        // 强制触发重绘（浏览器优化可能导致样式不更新）
        void h2.offsetHeight

        saveCollapseState(`h2_${h2Id}`, !isCollapsed)

        // console.log(
        //   '[H2 Click] isCollapsed after toggle:',
        //   contentWrapper.classList.contains('collapsed')
        // )
        // console.log('[H2 Click] h2.classList:', h2.classList.toString())
      }
    })
  })
}

// 初始化所有折叠功能
function initAllCollapse() {
  // 如果正在初始化，跳过
  if (isInitializing) {
    return
  }

  isInitializing = true

  // 延迟执行以确保 DOM 已经渲染完成
  const attempts = [100, 300, 500, 1000]
  let attemptIndex = 0

  function tryInit() {
    const tocSuccess = initTocCollapse()
    initH2Collapse()

    // 如果 TOC 初始化失败且还有重试次数,继续尝试
    if (!tocSuccess && attemptIndex < attempts.length - 1) {
      attemptIndex++
      setTimeout(tryInit, attempts[attemptIndex])
    } else {
      // 初始化完成，释放锁
      isInitializing = false
    }
  }

  setTimeout(tryInit, attempts[attemptIndex])
}

// 清理折叠功能
function cleanupCollapse() {
  // 清理 TOC 折叠容器（需要先移出内容再删除容器）
  const tocWrappers = document.querySelectorAll('.toc-collapse-wrapper')

  tocWrappers.forEach((wrapper) => {
    const contentContainer = wrapper.querySelector('.toc-collapse-content')
    const parent = wrapper.parentElement

    // 将 TOC 内容移回原位
    if (contentContainer && parent) {
      while (contentContainer.firstChild) {
        parent.insertBefore(contentContainer.firstChild, wrapper)
      }
    }

    // 删除整个包装器
    wrapper.remove()
  })

  // 清理 H2 折叠
  document.querySelectorAll('.h2-collapse-toggle').forEach((el) => el.remove())

  // 清理 H2 标题上的类名和属性
  document.querySelectorAll('h2.collapsible-h2').forEach((h2) => {
    h2.classList.remove('collapsible-h2', 'collapsed')
    h2.removeAttribute('role')
    h2.removeAttribute('aria-label')
    h2.removeAttribute('title')
  })

  document.querySelectorAll('.h2-collapse-content').forEach((el) => {
    // 将内容移回原位
    const parent = el.parentElement
    while (el.firstChild) {
      parent?.insertBefore(el.firstChild, el)
    }
    el.remove()
  })
} // 清除所有折叠状态
function clearAllCollapseStates() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return
  }
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith(COLLAPSE_STATE_PREFIX)
  )
  keys.forEach((key) => localStorage.removeItem(key))

  // 重新初始化
  cleanupCollapse()
  initAllCollapse()
}

// 组件挂载时初始化
onMounted(() => {
  // 确保在客户端环境中才初始化
  if (typeof window !== 'undefined') {
    // 不直接调用 initAllCollapse，让 onContentUpdated 处理
    // 因为首次加载时 onContentUpdated 也会触发

    // 添加全局函数，方便调试
    ;(window as any).clearAllCollapseStates = clearAllCollapseStates
  }
})

// 内容更新时重新初始化（支持 HMR 和路由切换）
onContentUpdated(() => {
  // 清除之前的定时器
  if (reinitTimer) {
    clearTimeout(reinitTimer)
  }

  // 使用防抖，避免短时间内多次触发
  reinitTimer = setTimeout(() => {
    cleanupCollapse()
    initAllCollapse()
    reinitTimer = null
  }, 150)
})

// 组件卸载时清理
onUnmounted(() => {
  cleanupCollapse()

  // 清除定时器
  if (reinitTimer) {
    clearTimeout(reinitTimer)
    reinitTimer = null
  }

  // 清理全局函数
  if (typeof window !== 'undefined') {
    delete (window as any).clearAllCollapseStates
  }
})
</script>
