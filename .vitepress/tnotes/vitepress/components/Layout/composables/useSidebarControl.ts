import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 侧边栏展开/收起控制
 */
export function useSidebarControl() {
  const route = useRoute()
  const allSidebarExpanded = ref(true)

  function toggleAllSidebarSections() {
    if (typeof document === 'undefined') return

    // 查找 VitePress 左侧导航栏中的所有可折叠项
    const sidebar = document.querySelector('.VPSidebar')
    if (!sidebar) return

    // VitePress 侧边栏使用 .group 和 .VPSidebarItem.collapsible 类
    const collapsibleItems = sidebar.querySelectorAll(
      '.VPSidebarItem.collapsible'
    )

    if (collapsibleItems.length === 0) return

    // 切换状态
    allSidebarExpanded.value = !allSidebarExpanded.value

    // 应用到所有可折叠项
    collapsibleItems.forEach((item) => {
      const button = item.querySelector('.caret') as HTMLElement
      if (button) {
        const isCurrentlyExpanded = item.classList.contains('collapsed')

        // 如果想展开但当前是收起的，或想收起但当前是展开的，就点击按钮
        if (allSidebarExpanded.value && isCurrentlyExpanded) {
          button.click()
        } else if (!allSidebarExpanded.value && !isCurrentlyExpanded) {
          button.click()
        }
      }
    })
  }

  // 监听路由变化，重置展开状态
  watch(
    () => route.path,
    () => {
      // 延迟一下，等侧边栏渲染完成
      setTimeout(() => {
        allSidebarExpanded.value = true
      }, 100)
    }
  )

  return {
    allSidebarExpanded,
    toggleAllSidebarSections,
  }
}
