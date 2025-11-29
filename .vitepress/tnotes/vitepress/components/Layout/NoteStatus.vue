<template>
  <h1 v-if="shouldShow" class="note-status-title">
    <span v-if="statusEmoji" class="status-emoji">{{ statusEmoji }}</span>
    <Tooltip v-if="githubLink" text="在 GitHub 中打开">
      <a
        :href="githubLink"
        class="note-title-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="note-title">{{ noteTitle }}</span>
      </a>
    </Tooltip>
    <span v-else class="note-title">{{ noteTitle }}</span>
  </h1>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, onMounted, nextTick } from 'vue'
import { useData } from 'vitepress'
import Tooltip from '../Tooltip/Tooltip.vue'

const props = defineProps({
  noteConfig: {
    type: Object,
    default: () => ({}),
  },
  isNotesPage: {
    type: Boolean,
    default: false,
  },
})

const { noteConfig, isNotesPage } = toRefs(props)
const { page } = useData()

// GitHub 链接（从原始 h1 中提取）
const githubLink = ref('')

// 是否应该显示组件
const shouldShow = computed(() => {
  return isNotesPage.value && noteTitle.value
})

// 获取笔记标题（从 page.title 获取）
const noteTitle = computed(() => {
  return page.value?.title || ''
})

// 计算状态 emoji
// 优先级：deprecated > pending (done: false) > done
const statusEmoji = computed(() => {
  const config = noteConfig.value

  if (!config) return ''

  // 弃用状态优先级最高
  if (config.deprecated === true) {
    return '❌'
  }

  // done 为 false 表示待完成
  if (config.done === false) {
    return '⏰'
  }

  // done 为 true 表示已完成
  if (config.done === true) {
    // return '✅'
    // 已完成取消标记
    return ''
  }

  // 默认未完成
  return '⏰'
})

// 从原始 h1 中提取 GitHub 链接
function extractGithubLink() {
  nextTick(() => {
    // 查找被隐藏的原始 h1
    const originalH1 = document.querySelector('.vp-doc h1:first-of-type')
    if (originalH1) {
      // 查找 h1 中的链接
      const link = originalH1.querySelector('a')
      if (link) {
        githubLink.value = link.href
      }
    }
  })
}

// 组件挂载时提取链接
onMounted(() => {
  extractGithubLink()
})
</script>

<style scoped>
.note-status-title {
  margin: 32px 0 0;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  letter-spacing: -0.02em;
  line-height: 40px;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
}

.status-emoji {
  margin-right: 8px;
}

.note-title-link {
  text-decoration: none;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
  position: relative;
  display: inline-block;
}

.note-title-link:hover {
  color: var(--vp-c-brand-1);
}

.note-title {
  color: inherit;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .note-status-title {
    font-size: 28px;
    line-height: 36px;
  }
}
</style>

<!-- 全局样式：隐藏 Markdown 渲染的原始 h1 -->
<style>
/* 只在笔记页面隐藏第一个 h1（Markdown 渲染的） */
.vp-doc h1:first-of-type {
  display: none !important;
}
</style>
