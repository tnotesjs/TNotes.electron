<template>
  <div class="custom-sidebar-wrapper">
    <nav class="nav" ref="navRef">
      <!-- 遍历侧边栏组 -->
      <template v-for="group in sidebarGroups" :key="group.text">
        <div class="group">
          <button class="group-title" @click="toggleGroup(group.text)">
            <span>{{ group.text }}</span>

            <span class="arrow" :class="{ collapsed: group.collapsed }">
              <img
                :src="
                  group.collapsed
                    ? icon__sidebar_collapsed
                    : icon__sidebar_opened
                "
                alt=""
              />
            </span>
          </button>

          <div v-show="!group.collapsed" class="group-items">
            <a
              v-for="item in group.items"
              :key="item.link"
              :href="getFullLink(item.link)"
              :class="[
                'nav-item',
                { active: isActive(item.link) },
                `nav-item-${extractNoteIdFromLink(item.link)}`,
              ]"
              :data-note-id="extractNoteIdFromLink(item.link)"
            >
              {{ getNoteDisplayText(item.text, item.link) }}
            </a>
          </div>
        </div>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useData } from 'vitepress'
// @ts-expect-error - VitePress Data Loader
import { data as sidebarConfig } from '../sidebar.data'
// @ts-expect-error - VitePress Data Loader
import { data as tnotesConfig } from '../tnotes-config.data'
import { SIDEBAR_SHOW_NOTE_ID_KEY } from '../constants'
import icon__sidebar_opened from '/icon__sidebar_opened.svg'
import icon__sidebar_collapsed from '/icon__sidebar_collapsed.svg'

interface SidebarItem {
  text: string
  link: string
}

interface SidebarGroup {
  text: string
  collapsed: boolean
  items: SidebarItem[]
}

const route = useRoute()
const { site } = useData()
const sidebarGroups = ref<SidebarGroup[]>([])
const navRef = ref<HTMLElement | null>(null)
const currentFocusIndex = ref(0) // 当前聚焦的笔记索引

// 获取配置：是否显示笔记 ID
// 优先使用 localStorage 中的用户自定义配置，否则使用配置文件中的默认值
const showNoteId = computed(() => {
  if (typeof window === 'undefined') {
    return tnotesConfig.sidebarShowNoteId ?? false
  }

  const savedShowNoteId = localStorage.getItem(SIDEBAR_SHOW_NOTE_ID_KEY)
  if (savedShowNoteId !== null) {
    return savedShowNoteId === 'true'
  }

  return tnotesConfig.sidebarShowNoteId ?? false
})

// 获取 base 路径
const base = computed(() => site.value.base || '/')

// 加载 sidebar 数据
function loadSidebar() {
  if (sidebarConfig && sidebarConfig['/notes/']) {
    sidebarGroups.value = sidebarConfig['/notes/'].map((group: any) => ({
      ...group,
      collapsed: group.collapsed ?? true,
    }))
  }
  // console.log('✅ [CustomSidebar] Sidebar loaded:', sidebarGroups.value[0])
}

// 切换组展开/折叠
function toggleGroup(groupText: string) {
  const group = sidebarGroups.value.find((g) => g.text === groupText)
  if (group) {
    group.collapsed = !group.collapsed
  }
}

// 展开全部
function expandAll() {
  sidebarGroups.value.forEach((group) => {
    group.collapsed = false
  })
}

// 折叠全部
function collapseAll() {
  sidebarGroups.value.forEach((group) => {
    group.collapsed = true
  })
}

// 获取当前笔记的所有出现位置
function getCurrentNotePositions(): HTMLElement[] {
  const currentPath = route.path
  const elements: HTMLElement[] = []

  if (!navRef.value) {
    // console.log('❌ [getCurrentNotePositions] navRef is null')
    return elements
  }

  // console.log('🔍 [getCurrentNotePositions] Current route path:', currentPath)

  // 查找所有 nav-item 元素
  const allItems = navRef.value.querySelectorAll('.nav-item')
  // console.log('🔍 [getCurrentNotePositions] Total nav-items:', allItems.length)

  // 检查每个链接
  // allItems.forEach((item, index) => {
  //   const href = item.getAttribute('href')
  //   const hasActiveClass = item.classList.contains('active')
  //   console.log(`🔍 [${index}] href:`, href, 'hasActive:', hasActiveClass)
  // })

  // 查找所有激活的笔记项
  const activeItems = navRef.value.querySelectorAll('.nav-item.active')
  // console.log(
  //   '🔍 [getCurrentNotePositions] Active nav-items:',
  //   activeItems.length
  // )

  activeItems.forEach((item) => {
    // const href = item.getAttribute('href')
    // console.log('🔍 [getCurrentNotePositions] Active item href:', href)
    elements.push(item as HTMLElement)
  })

  // console.log('🎯 [getCurrentNotePositions] Found positions:', elements.length)
  return elements
}

// 展开指定元素的父级分组
function expandParentGroup(element: HTMLElement) {
  // 查找父级 group
  const groupElement = element.closest('.group')
  if (!groupElement) {
    // console.log('❌ [expandParentGroup] No group element found')
    return
  }

  // 查找 group-title 的文本
  const groupTitle = groupElement.querySelector('.group-title span')
  if (!groupTitle) {
    // console.log('❌ [expandParentGroup] No group title found')
    return
  }

  const groupText = groupTitle.textContent?.trim()
  if (!groupText) {
    // console.log('❌ [expandParentGroup] No group text found')
    return
  }

  // console.log('📂 [expandParentGroup] Expanding group:', groupText)

  // 展开该分组
  const group = sidebarGroups.value.find((g) => g.text === groupText)
  if (group) {
    group.collapsed = false
    // console.log('✅ [expandParentGroup] Group expanded:', groupText)
  }
}

// 滚动到指定元素
function scrollToElement(element: HTMLElement) {
  if (!element || !navRef.value) {
    // console.log('❌ [scrollToElement] No element or navRef')
    return
  }

  const navContainer = navRef.value.closest('.VPSidebar')
  if (!navContainer) {
    // console.log('❌ [scrollToElement] No VPSidebar container found')
    return
  }

  // console.log('📍 [scrollToElement] Scrolling to element')

  // 计算元素相对于容器的位置
  const elementRect = element.getBoundingClientRect()
  const containerRect = navContainer.getBoundingClientRect()

  // 计算需要滚动的距离（将元素放在容器中间）
  const scrollTop =
    navContainer.scrollTop +
    elementRect.top -
    containerRect.top -
    containerRect.height / 2 +
    elementRect.height / 2

  navContainer.scrollTo({
    top: scrollTop,
    behavior: 'smooth',
  })

  // 添加临时高亮动画
  element.classList.add('focus-highlight')
  setTimeout(() => {
    element.classList.remove('focus-highlight')
  }, 1000)
}

// 聚焦到当前笔记（支持多个位置切换）
function focusCurrentNote() {
  // console.log('🎯 [focusCurrentNote] Called')
  const positions = getCurrentNotePositions()

  if (positions.length === 0) {
    // console.log('❌ [focusCurrentNote] No positions found')
    return
  }

  // 循环切换聚焦位置
  currentFocusIndex.value = (currentFocusIndex.value + 1) % positions.length
  const targetElement = positions[currentFocusIndex.value]

  // console.log(
  //   `🎯 [focusCurrentNote] Focusing position ${currentFocusIndex.value + 1}/${
  //     positions.length
  //   }`
  // )

  // 展开该笔记所在的分组
  expandParentGroup(targetElement)

  // 滚动到该笔记
  setTimeout(() => {
    scrollToElement(targetElement)
  }, 100)
}

// 展开当前激活笔记的所有父级分组
function expandActiveItemParents() {
  sidebarGroups.value.forEach((group) => {
    const hasActiveItem = group.items.some((item) => isActive(item.link))
    if (hasActiveItem) {
      group.collapsed = false
    }
  })
}

// 滚动到当前激活的笔记
function scrollToActiveItem() {
  // 等待 DOM 更新
  setTimeout(() => {
    const positions = getCurrentNotePositions()
    if (positions.length > 0) {
      // 展开所有包含当前笔记的分组
      expandActiveItemParents()

      // 滚动到第一个位置
      setTimeout(() => {
        scrollToElement(positions[0])
      }, 100)
    }
  }, 300)
}

// 暴露函数给父组件使用
defineExpose({
  expandAll,
  collapseAll,
  focusCurrentNote,
})

// 获取完整链接（包含 base）
function getFullLink(link: string) {
  // 移除开头的 /，然后拼接 base
  const cleanLink = link.startsWith('/') ? link.slice(1) : link
  return base.value + cleanLink
}

// 判断链接是否激活
function isActive(link: string) {
  const fullLink = getFullLink(link)

  // 对路径进行解码，因为 route.path 可能包含 URL 编码（如 %20）
  const decodedRoutePath = decodeURIComponent(route.path)
  const decodedFullLink = decodeURIComponent(fullLink)

  const isMatch =
    decodedRoutePath === decodedFullLink ||
    decodedRoutePath === decodedFullLink + '.html'

  return isMatch
}

// 从链接中提取笔记 ID（从路径中提取 4 位数字）
function extractNoteIdFromLink(link: string): string | null {
  // 匹配 /notes/0001. 这样的模式
  const match = link.match(/\/notes\/(\d{4})\./)
  return match ? match[1] : null
}

// 提取文本开头的 emoji
function extractEmoji(text: string): { emoji: string; rest: string } {
  // 匹配开头的 emoji（包括常见的完成状态图标）
  const emojiMatch = text.match(
    /^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✅❌⏰]+)\s*/u
  )

  if (emojiMatch) {
    return {
      emoji: emojiMatch[1],
      rest: text.slice(emojiMatch[0].length),
    }
  }

  return { emoji: '', rest: text }
}

// 获取笔记显示文本（根据配置决定是否包含 ID）
function getNoteDisplayText(text: string, link: string): string {
  const show = showNoteId.value

  // 提取 emoji 和剩余文本
  const { emoji, rest } = extractEmoji(text)

  if (show) {
    // 显示完整文本（包含 ID）
    // 格式：emoji + ID + 剩余文本

    // 先检查剩余文本是否已经有 ID（以 4 位数字开头）
    if (/^\d{4}\./.test(rest)) {
      return emoji ? `${emoji} ${rest}` : rest
    }

    // 如果文本没有 ID，尝试从链接中提取
    const noteId = extractNoteIdFromLink(link)
    if (noteId) {
      return emoji ? `${emoji} ${noteId}. ${rest}` : `${noteId}. ${rest}`
    }

    return text
  } else {
    // 不显示 ID
    // 移除 ID 部分（移除开头的 "0001. "）
    const cleanRest = rest.replace(/^\d{4}\.\s*/, '')
    return emoji ? `${emoji} ${cleanRest}` : cleanRest
  }
}

onMounted(() => {
  loadSidebar()

  // 调试：打印配置信息
  // console.log('🔧 [CustomSidebar] showNoteId:', showNoteId.value)
  // if (typeof window !== 'undefined') {
  //   console.log(
  //     '🔧 [CustomSidebar] localStorage value:',
  //     localStorage.getItem(SIDEBAR_SHOW_NOTE_ID_KEY)
  //   )
  // }
  // console.log(
  //   '🔧 [CustomSidebar] tnotesConfig value:',
  //   tnotesConfig.sidebarShowNoteId
  // )

  // 自动滚动到当前激活的笔记
  scrollToActiveItem()
})

// 监听 sidebarConfig 的变化（HMR 会更新这个导入的数据）
watch(
  () => sidebarConfig,
  () => {
    // console.log('🔄 [CustomSidebar] Sidebar config changed, reloading...')
    loadSidebar()
  },
  { deep: true }
)

// 监听 tnotesConfig 的变化
watch(
  () => tnotesConfig,
  () => {
    // console.log(
    //   '🔄 [CustomSidebar] TNotes config changed, sidebarShowNoteId:',
    //   tnotesConfig.sidebarShowNoteId
    // )
  },
  { deep: true }
)

// 监听路由变化，自动展开当前激活项所在的组并滚动
watch(
  () => route.path,
  () => {
    // 重置聚焦索引
    currentFocusIndex.value = 0

    // 展开并滚动到当前笔记
    expandActiveItemParents()
    scrollToActiveItem()
  }
)
</script>

<style scoped>
/* 自定义 sidebar 容器，适配 VitePress 的 sidebar-nav-before 插槽 */
.custom-sidebar-wrapper {
  /* 不需要设置 position 和尺寸，因为它在 VitePress 的 sidebar 容器内 */
}

.nav {
  font-size: 14px;
  line-height: 2;
}

.group {
  margin-bottom: 16px;
}

.group-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px 0;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 0.25s;
}

.group-title:hover {
  color: var(--vp-c-brand-1);
}

.arrow {
  font-size: 10px;
  transform: rotate(90deg);
  transition: transform 0.25s;
}

.arrow.collapsed {
  transform: rotate(0deg);
}

.nav-item {
  display: block;
  padding: 4px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  line-height: 24px;
  transition: all 0.25s;
}

.nav-item:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.nav-item.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* 聚焦高亮动画 */
.nav-item.focus-highlight {
  animation: focusPulse 1s ease-in-out;
}

@keyframes focusPulse {
  0%,
  100% {
    background-color: transparent;
  }
  50% {
    background-color: var(--vp-c-brand-soft);
  }
}
</style>

<!-- 全局样式：隐藏 VitePress 默认的 sidebar nav -->
<style>
/* 隐藏 VitePress 默认的 sidebar 导航内容（保留容器） */
.VPSidebarNav {
  display: none !important;
}
</style>
