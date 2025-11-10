import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 全局折叠/展开功能
 */
export function useCollapseControl() {
  const route = useRoute()
  const allCollapsed = ref(false)

  function toggleAllCollapse() {
    if (typeof document === 'undefined') return

    allCollapsed.value = !allCollapsed.value

    // 获取所有折叠区域
    const tocHeaders = document.querySelectorAll('.toc-collapse-header')
    const h2Elements = document.querySelectorAll('.vp-doc h2.collapsible-h2')

    // 切换 TOC 区域
    tocHeaders.forEach((header) => {
      const content = header.nextElementSibling
      if (!content) return

      const isCollapsed = content.classList.contains('collapsed')

      // 根据目标状态决定是否需要切换
      if (allCollapsed.value && !isCollapsed) {
        // 需要折叠 - 直接操作 DOM
        content.classList.add('collapsed')
        header.classList.add('collapsed')
        // 保存状态到 localStorage
        const noteKey = route.path.replace(/\//g, '_')
        const storageKey = `tnotes_collapse_state_${noteKey}_toc`
        localStorage.setItem(storageKey, '1')
      } else if (!allCollapsed.value && isCollapsed) {
        // 需要展开 - 直接操作 DOM
        content.classList.remove('collapsed')
        header.classList.remove('collapsed')
        // 保存状态到 localStorage
        const noteKey = route.path.replace(/\//g, '_')
        const storageKey = `tnotes_collapse_state_${noteKey}_toc`
        localStorage.setItem(storageKey, '0')
      }
    })

    // 切换 H2 区域
    h2Elements.forEach((h2) => {
      const content = h2.nextElementSibling
      if (!content || !content.classList.contains('h2-collapse-content')) return

      const isCollapsed = content.classList.contains('collapsed')
      const h2Id = h2.id || `h2_${Array.from(h2Elements).indexOf(h2)}`

      // 根据目标状态决定是否需要切换
      if (allCollapsed.value && !isCollapsed) {
        // 需要折叠 - 直接操作 DOM
        content.classList.add('collapsed')
        h2.classList.add('collapsed')
        // 保存状态到 localStorage
        const noteKey = route.path.replace(/\//g, '_')
        const storageKey = `tnotes_collapse_state_${noteKey}_h2_${h2Id}`
        localStorage.setItem(storageKey, '1')
      } else if (!allCollapsed.value && isCollapsed) {
        // 需要展开 - 直接操作 DOM
        content.classList.remove('collapsed')
        h2.classList.remove('collapsed')
        // 保存状态到 localStorage
        const noteKey = route.path.replace(/\//g, '_')
        const storageKey = `tnotes_collapse_state_${noteKey}_h2_${h2Id}`
        localStorage.setItem(storageKey, '0')
      }
    })
  }

  // 监听路由变化，重置折叠状态
  watch(
    () => route.path,
    () => {
      allCollapsed.value = false
    }
  )

  return {
    allCollapsed,
    toggleAllCollapse,
  }
}
