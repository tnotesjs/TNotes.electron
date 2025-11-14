import { onMounted, onUnmounted } from 'vue'
import { createApp } from 'vue'
import CodeBlockFullscreen from './CodeBlockFullscreen.vue'

export function useCodeBlockFullscreen() {
  let fullscreenApp: any = null
  let fullscreenContainer: HTMLElement | null = null

  function addFullscreenButtons() {
    // 找到所有代码块
    const codeBlocks = document.querySelectorAll('div[class*="language-"]')

    codeBlocks.forEach((block) => {
      // 避免重复添加按钮
      if (block.querySelector('.fullscreen-btn')) return

      // 创建全屏按钮
      const button = document.createElement('button')
      button.className = 'fullscreen-btn'
      button.title = '全屏查看代码'
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
      `

      // 点击事件
      button.addEventListener('click', () => {
        openFullscreen(block as HTMLElement)
      })

      // 添加按钮到代码块
      block.appendChild(button)
    })
  }

  function openFullscreen(codeBlock: HTMLElement) {
    // 获取代码内容
    const pre = codeBlock.querySelector('pre')
    if (!pre) return

    const codeHtml = pre.outerHTML

    // 提取语言
    const classList = Array.from(codeBlock.classList)
    const languageClass = classList.find((c) => c.startsWith('language-'))
    const language = languageClass
      ? languageClass.replace('language-', '').toUpperCase()
      : undefined

    // 提取文件名（如果有）
    const filenameSpan = codeBlock.querySelector('.lang')
    const filename = filenameSpan?.textContent?.trim()

    // 创建全屏组件容器
    if (!fullscreenContainer) {
      fullscreenContainer = document.createElement('div')
      document.body.appendChild(fullscreenContainer)
    }

    // 创建 Vue 应用
    fullscreenApp = createApp(CodeBlockFullscreen, {
      isFullscreen: true,
      codeHtml,
      language,
      filename,
      'onUpdate:isFullscreen': (value: boolean) => {
        if (!value) {
          closeFullscreen()
        }
      },
    })

    fullscreenApp.mount(fullscreenContainer)
  }

  function closeFullscreen() {
    if (fullscreenApp) {
      fullscreenApp.unmount()
      fullscreenApp = null
    }
    if (fullscreenContainer && fullscreenContainer.parentNode) {
      fullscreenContainer.parentNode.removeChild(fullscreenContainer)
      fullscreenContainer = null
    }
  }

  function cleanup() {
    closeFullscreen()
    // 移除所有全屏按钮
    document.querySelectorAll('.fullscreen-btn').forEach((btn) => btn.remove())
  }

  onMounted(() => {
    // 初始化
    setTimeout(() => {
      addFullscreenButtons()
    }, 100)

    // 监听路由变化
    const observer = new MutationObserver(() => {
      addFullscreenButtons()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    onUnmounted(() => {
      observer.disconnect()
      cleanup()
    })
  })
}
