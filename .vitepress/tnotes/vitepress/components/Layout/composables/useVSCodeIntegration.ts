import { ref, watch, onMounted } from 'vue'
import { useData } from 'vitepress'
import { NOTES_DIR_KEY } from '../../constants'

/**
 * VSCode 集成和 GitHub 链接拦截
 */
export function useVSCodeIntegration() {
  const vpData = useData()
  const vscodeNotesDir = ref('')

  // 更新 VSCode 笔记目录
  const updateVscodeNoteDir = () => {
    if (typeof window !== 'undefined') {
      const notesDir = localStorage.getItem(NOTES_DIR_KEY)
      vscodeNotesDir.value = notesDir
        ? `vscode://file/${notesDir}/${vpData.page.value.relativePath}`
        : ''
    }
  }

  // 拦截 home README 中的笔记链接，将 GitHub 链接转换为站点内跳转
  const interceptHomeReadmeLinks = (isHomeReadme: any, router: any) => {
    if (typeof window === 'undefined') return

    // 只在 home README 页面执行
    if (!isHomeReadme.value) return

    // 延迟执行，确保 DOM 已渲染
    setTimeout(() => {
      const content = document.querySelector('.vp-doc')
      if (!content) return

      // 查找所有指向 GitHub 的笔记链接
      const links = content.querySelectorAll(
        'a[href*="github.com"][href*="/notes/"]'
      )

      links.forEach((link) => {
        const href = link.getAttribute('href')
        if (!href) return

        // 匹配 GitHub 链接格式：https://github.com/{owner}/{repo}/tree/main/notes/{noteDir}/README.md
        const match = href.match(
          /github\.com\/[^/]+\/[^/]+\/tree\/main\/notes\/([^/]+)\/README\.md/
        )

        if (match) {
          const encodedNoteDir = match[1]
          const noteDir = decodeURIComponent(encodedNoteDir)

          // 构建站点内的相对路径
          const base = vpData.site.value.base || '/'
          const internalPath = `${base}notes/${noteDir}/README`

          // 移除原有的点击事件监听器（如果有）
          const newLink = link.cloneNode(true) as HTMLElement

          // 添加点击事件拦截
          newLink.addEventListener('click', (e) => {
            e.preventDefault()
            router.go(internalPath)
          })

          // 更新 href 属性（用于悬停显示和右键菜单）
          newLink.setAttribute('href', internalPath)

          // 替换原链接
          link.parentNode?.replaceChild(newLink, link)
        }
      })
    }, 100)
  }

  return {
    vscodeNotesDir,
    updateVscodeNoteDir,
    interceptHomeReadmeLinks,
  }
}
