import { ref, watch } from 'vue'
import { useRoute, useData } from 'vitepress'

/**
 * 处理 404 重定向逻辑
 * 当用户访问旧的笔记 URL 时,自动重定向到新的 URL
 */
export function useRedirect(allNotesConfig: Record<string, any>) {
  const route = useRoute()
  const vpData = useData()

  // 控制是否显示 404 内容
  const showNotFound = ref(false)
  const currentPath = ref('')
  const matchedId = ref('')
  const redirectPath = ref('')

  // 解码后的当前路径(用于调试)
  const decodedCurrentPath = ref('')

  // 重定向检查函数
  function checkRedirect() {
    if (typeof window === 'undefined') return false

    currentPath.value = window.location.pathname

    // 匹配路径格式：/TNotes.*/notes/四个数字{任意内容}/README
    const match = currentPath.value.match(
      /\/TNotes[^/]+\/notes\/(\d{4})[^/]*(?:\/.*)?$/
    )

    if (match) {
      matchedId.value = match[1]
      const targetNote = allNotesConfig[matchedId.value]
      redirectPath.value = targetNote ? targetNote.redirect : ''

      if (targetNote && targetNote.redirect) {
        const base = vpData.site.value.base
        // 构建目标路径（包含基础路径）
        const targetPath = `${base}${targetNote.redirect}`

        // 避免重定向死循环
        if (currentPath.value !== targetPath) {
          console.log(`Redirecting from ${currentPath.value} to ${targetPath}`)

          // 使用完整的页面跳转（强制刷新）
          window.location.href = targetPath
          return true
        }
      }
    }
    return false
  }

  // 更新解码后的路径
  function updateDecodedPath() {
    try {
      decodedCurrentPath.value = decodeURIComponent(currentPath.value)
    } catch (e) {
      console.error('Failed to decode URI:', e)
      decodedCurrentPath.value = currentPath.value
    }
  }

  // 初始化检查(在组件挂载后调用)
  function initRedirectCheck() {
    // 延迟执行以确保路由状态稳定
    setTimeout(() => {
      // 如果是 404 页面,尝试重定向
      if (vpData.page.value.isNotFound) {
        const redirected = checkRedirect()

        // 如果重定向失败,显示原始 404 内容
        if (!redirected) {
          showNotFound.value = true
        }
      }
    }, 1000)
  }

  // 监听路由变化
  watch(
    () => route.path,
    () => {
      // 延迟检查以确保路由更新完成
      setTimeout(() => {
        if (vpData.page.value.isNotFound) {
          const redirected = checkRedirect()
          if (!redirected) {
            showNotFound.value = true
          }
        }
      }, 1000)
    }
  )

  // 监听 currentPath 变化,更新解码后的路径
  watch(currentPath, updateDecodedPath, { immediate: true })

  return {
    showNotFound,
    currentPath,
    matchedId,
    redirectPath,
    decodedCurrentPath,
    initRedirectCheck,
  }
}
