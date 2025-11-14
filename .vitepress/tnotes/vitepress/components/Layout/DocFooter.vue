<template>
  <nav class="custom-doc-footer" v-if="prev || next">
    <div class="container">
      <div class="prev">
        <a v-if="prev" :href="prev.link" class="pager-link prev-link">
          <span class="desc">上一篇</span>
          <span class="title">
            <span v-if="prev.emoji" class="emoji">{{ prev.emoji }}</span>
            {{ prev.title }}
          </span>
        </a>
      </div>

      <div class="next">
        <a v-if="next" :href="next.link" class="pager-link next-link">
          <span class="desc">下一篇</span>
          <span class="title">
            <span v-if="next.emoji" class="emoji">{{ next.emoji }}</span>
            {{ next.title }}
          </span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'
// @ts-expect-error - VitePress Data Loader
import { data as sidebarConfig } from '../sidebar.data'

interface NavItem {
  link: string
  title: string
  emoji: string
}

const route = useRoute()
const { site } = useData()

// 获取 base 路径
const base = computed(() => site.value.base || '/')

// 提取所有笔记为扁平列表（按 sidebar.json 顺序）
const allNotes = computed(() => {
  const notes: NavItem[] = []

  if (!sidebarConfig || !sidebarConfig['/notes/']) {
    return notes
  }

  const groups = sidebarConfig['/notes/']

  // 遍历所有分组
  groups.forEach((group: any) => {
    if (group.items && Array.isArray(group.items)) {
      group.items.forEach((item: any) => {
        if (item.link && item.text) {
          // 提取 emoji 和标题
          const { emoji, title } = extractEmojiAndTitle(item.text)

          // 构建完整链接
          const cleanLink = item.link.startsWith('/')
            ? item.link.slice(1)
            : item.link
          const fullLink = base.value + cleanLink

          notes.push({
            link: fullLink,
            title,
            emoji,
          })
        }
      })
    }
  })

  return notes
})

// 提取 emoji 和标题
function extractEmojiAndTitle(text: string): { emoji: string; title: string } {
  // 匹配开头的 emoji（包括常见的完成状态图标）
  const emojiMatch = text.match(
    /^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✅❌⏰]+)\s*/u
  )

  if (emojiMatch) {
    const emoji = emojiMatch[1]
    const rest = text.slice(emojiMatch[0].length)
    // 移除笔记编号（如 "0001. "）
    const title = rest.replace(/^\d{4}\.\s*/, '')
    return { emoji, title }
  }

  // 没有 emoji，只移除编号
  const title = text.replace(/^\d{4}\.\s*/, '')
  return { emoji: '', title }
}

// 获取当前笔记的索引
const currentIndex = computed(() => {
  // 对路径进行解码，因为 route.path 可能包含 URL 编码
  const decodedRoutePath = decodeURIComponent(route.path)

  return allNotes.value.findIndex((note) => {
    const decodedNoteLink = decodeURIComponent(note.link)
    return (
      decodedRoutePath === decodedNoteLink ||
      decodedRoutePath === decodedNoteLink + '.html'
    )
  })
})

// 上一篇
const prev = computed(() => {
  if (currentIndex.value <= 0) return null
  return allNotes.value[currentIndex.value - 1]
})

// 下一篇
const next = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= allNotes.value.length - 1)
    return null
  return allNotes.value[currentIndex.value + 1]
})
</script>

<style scoped>
.custom-doc-footer {
  margin-top: 64px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 32px;
}

.container {
  display: flex;
  gap: 16px;
}

.prev,
.next {
  flex: 1;
}

.prev {
  display: flex;
  justify-content: flex-start;
}

.next {
  display: flex;
  justify-content: flex-end;
}

.pager-link {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 11px 16px 13px;
  width: 100%;
  max-width: 320px;
  transition: border-color 0.25s, background-color 0.25s;
  text-decoration: none;
}

.pager-link:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.prev-link {
  text-align: left;
}

.next-link {
  text-align: right;
}

.desc {
  display: block;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.title {
  display: block;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
  padding-top: 4px;
}

.pager-link:hover .title {
  color: var(--vp-c-brand-2);
}

.emoji {
  margin-right: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 12px;
  }

  .pager-link {
    max-width: 100%;
  }
}
</style>

<!-- 全局样式：隐藏 VitePress 默认的 doc-footer -->
<style>
.VPDocFooter {
  display: none !important;
}
</style>
