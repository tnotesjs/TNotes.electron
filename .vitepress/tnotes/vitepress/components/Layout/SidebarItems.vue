<template>
  <template v-for="item in items" :key="getItemKey(item)">
    <!-- 只有在不超过最大层级时才渲染组 -->
    <div
      v-if="hasChildren(item) && depth < maxDepth - 1"
      class="group"
      :style="getGroupStyle(depth)"
    >
      <button
        class="group-title"
        :class="`group-title-level-${depth}`"
        @click="toggleItem(item)"
      >
        <span>{{ item.text }}</span>

        <span class="arrow" :class="{ collapsed: item.collapsed }">
          <img
            :src="
              item.collapsed ? icon__sidebar_collapsed : icon__sidebar_opened
            "
            alt=""
          />
        </span>
      </button>

      <div v-show="!item.collapsed" class="group-items">
        <SidebarItems
          :items="item.items"
          :depth="depth + 1"
          :max-depth="maxDepth"
          :show-note-id="showNoteId"
          :base="base"
          :current-path="currentPath"
          :item-depth="depth"
        />
      </div>
    </div>

    <!-- 如果是链接项，或者是超过最大层级的组，都不渲染 -->
    <a
      v-else-if="!hasChildren(item)"
      :href="getFullLink(item.link)"
      :class="[
        'nav-item',
        { active: isActive(item.link) },
        `nav-item-${extractNoteIdFromLink(item.link)}`,
        `nav-item-level-${actualItemDepth + 1}`,
      ]"
      :data-note-id="extractNoteIdFromLink(item.link)"
      :style="getItemStyle(actualItemDepth)"
    >
      {{ getNoteDisplayText(item.text, item.link) }}
    </a>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import icon__sidebar_opened from '/icon__sidebar_opened.svg'
import icon__sidebar_collapsed from '/icon__sidebar_collapsed.svg'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

interface Props {
  items: SidebarItem[]
  depth: number
  maxDepth: number
  showNoteId: boolean
  base: string
  currentPath: string
  itemDepth?: number // 用于计算链接项的缩进，默认等于 depth
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
  maxDepth: 3,
  showNoteId: false,
  base: '/',
  currentPath: '',
  itemDepth: undefined,
})

// 获取实际的 item depth（用于链接项的缩进）
const actualItemDepth = computed(() => props.itemDepth ?? props.depth)

// 判断项是否有子项
function hasChildren(item: SidebarItem): boolean {
  return !!(item.items && item.items.length > 0)
}

// 获取项的唯一 key
function getItemKey(item: SidebarItem): string {
  return item.link || item.text
}

// 切换项的展开/折叠状态
function toggleItem(item: SidebarItem) {
  item.collapsed = !item.collapsed
}

// 根据深度获取组的缩进样式
function getGroupStyle(depth: number) {
  // 从第二层组开始才需要缩进（depth >= 1）
  if (depth === 0) {
    return {}
  }
  return {
    paddingLeft: `${depth * 16}px`,
  }
}

// 根据深度获取项的缩进样式
function getItemStyle(depth: number) {
  // 项的缩进基于其父组的depth
  // 第一层组（depth=0）的子项不需要额外缩进
  // 第二层组（depth=1）的子项需要缩进 16px
  if (depth === 0) {
    return {}
  }
  return {
    paddingLeft: `${depth * 16}px`,
  }
}

// 获取完整链接（包含 base）
function getFullLink(link?: string) {
  if (!link) return '#'
  const cleanLink = link.startsWith('/') ? link.slice(1) : link
  return props.base + cleanLink
}

// 判断链接是否激活
function isActive(link?: string) {
  if (!link) return false
  const fullLink = getFullLink(link)
  const decodedRoutePath = decodeURIComponent(props.currentPath)
  const decodedFullLink = decodeURIComponent(fullLink)

  return (
    decodedRoutePath === decodedFullLink ||
    decodedRoutePath === decodedFullLink + '.html'
  )
}

// 从链接中提取笔记 ID
function extractNoteIdFromLink(link?: string): string | null {
  if (!link) return null
  const match = link.match(/\/notes\/(\d{4})\./)
  return match ? match[1] : null
}

// 提取文本开头的 emoji
function extractEmoji(text: string): { emoji: string; rest: string } {
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

// 获取笔记显示文本
function getNoteDisplayText(text: string, link?: string): string {
  const { emoji, rest } = extractEmoji(text)

  if (props.showNoteId) {
    if (/^\d{4}\./.test(rest)) {
      return emoji ? `${emoji} ${rest}` : rest
    }

    const noteId = extractNoteIdFromLink(link)
    if (noteId) {
      return emoji ? `${emoji} ${noteId}. ${rest}` : `${noteId}. ${rest}`
    }

    return text
  } else {
    const cleanRest = rest.replace(/^\d{4}\.\s*/, '')
    return emoji ? `${emoji} ${cleanRest}` : cleanRest
  }
}
</script>

<style scoped>
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
