<script setup lang="ts">
import { useData } from 'vitepress/client'
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { REPO_NAME, AUTHOR } from '../constants'
import Tooltip from '../Tooltip/Tooltip.vue'
import icon__github from '/icon__github.svg'

const props = defineProps({
  /**
   * 留言版 ID
   * 来自于笔记配置文件中的 id 字段的 uuid 值
   */
  id: {
    type: String,
    required: true,
  },
  /**
   * 笔记序号（如 0001）
   */
  noteNumber: {
    type: String,
    default: '',
  },
  /**
   * 笔记标题
   */
  noteTitle: {
    type: String,
    default: '',
  },
})

// 🔍 查阅支持的所有主题 https://giscus.app/zh-CN
const GISCUS_DARK_THEME = 'noborder_dark'
const GISCUS_LIGHT_THEME = 'noborder_light'

// 获取 VitePress 的数据 - 主题状态
const { isDark } = useData()

// 生成 GitHub Discussions 直接链接
const githubDiscussionsUrl = computed(() => {
  return `https://github.com/orgs/tnotesjs/discussions?discussions_q=${props.id}`
})

/**
 * 生成 giscus backlink（带有笔记信息的 GitHub 页面链接）
 *
 * giscus 会在创建新 Discussion 时自动添加返回链接。
 * 通过设置 <meta name="giscus:backlink"> 标签，可以自定义这个链接。
 * 这样在 GitHub Discussions 中就能看到对应笔记的直接链接。
 *
 * 📖 官方文档：https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#giscusbacklink
 */
const giscusBacklink = computed(() => {
  console.log('[Discussions] Props:', {
    noteNumber: props.noteNumber,
    noteTitle: props.noteTitle,
    id: props.id,
  })

  if (!props.noteNumber || !props.noteTitle) {
    console.log('[Discussions] 使用默认 URL:', window.location.href)
    return window.location.href
  }

  // 对笔记标题进行 URL 编码（处理中文和特殊字符）
  const encodedTitle = encodeURIComponent(props.noteTitle)

  // 生成笔记相关链接
  const noteGithubUrl = `https://github.com/${AUTHOR}/${REPO_NAME}/tree/main/notes/${props.noteNumber}.%20${encodedTitle}`
  const notePageUrl = `https://${AUTHOR.toLowerCase()}.github.io/${REPO_NAME}/notes/${
    props.noteNumber
  }.%20${encodedTitle}/README`

  // 生成知识库相关链接
  const repoGithubUrl = `https://github.com/${AUTHOR}/${REPO_NAME}`
  const repoPageUrl = `https://${AUTHOR.toLowerCase()}.github.io/${REPO_NAME}/`

  // 生成当前时间字符串
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = `周${weekDays[now.getDay()]}`
  const hour = now.getHours()
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  const period = hour < 12 ? '上午' : '下午'
  const hour12 = hour % 12 || 12
  const formattedTime = `${year}.${month}.${day} ${weekDay} ${period} ${hour12}:${minute}:${second}`

  // 构建 Markdown 格式的笔记信息
  const backlink = `
- **${props.noteNumber}. ${props.noteTitle}**：[GitHub](${noteGithubUrl})、[GitHub Page](${notePageUrl})
- **${REPO_NAME}**：[GitHub](${repoGithubUrl})、[GitHub Page](${repoPageUrl})
- **评论创建时间**：${formattedTime}
`.trim()

  console.log('[Discussions] 生成的 backlink:', backlink)
  return backlink
})

// 动态注入 giscus backlink meta 标签
const updateGiscusBacklink = () => {
  // 移除旧的 giscus:backlink meta 标签
  const oldMeta = document.querySelector('meta[name="giscus:backlink"]')
  if (oldMeta) {
    oldMeta.remove()
  }

  // 添加新的 giscus:backlink meta 标签
  const meta = document.createElement('meta')
  meta.name = 'giscus:backlink'
  meta.content = giscusBacklink.value
  document.head.appendChild(meta)

  console.log('[Discussions] 已添加 giscus:backlink meta 标签:', meta.content)
}

// 动态注入 giscus 评论脚本
const loadGiscusScript = () => {
  // 更新 giscus:backlink meta 标签
  updateGiscusBacklink()

  // 清除旧的 giscus 脚本和 iframe
  const oldScript = document.getElementById('giscus-script')
  const oldIframe = document.querySelector('iframe.giscus-frame')
  if (oldScript) oldScript.remove()
  if (oldIframe) oldIframe.remove()

  // 创建新的 giscus 脚本
  const giscusScript = document.createElement('script')
  giscusScript.src = 'https://giscus.app/client.js'
  giscusScript.setAttribute('data-repo', 'tnotesjs/TNotes.discussions')
  giscusScript.setAttribute('data-repo-id', 'R_kgDOQauuyw')
  giscusScript.setAttribute('data-category', 'Announcements')
  giscusScript.setAttribute('data-category-id', 'DIC_kwDOQauuy84CyEuQ')
  giscusScript.setAttribute('data-mapping', 'specific')
  giscusScript.setAttribute('data-term', props.id)
  giscusScript.setAttribute('data-strict', '0')
  giscusScript.setAttribute('data-reactions-enabled', '1')
  giscusScript.setAttribute('data-emit-metadata', '0')
  giscusScript.setAttribute('data-input-position', 'top')
  giscusScript.setAttribute('data-lang', 'zh-CN')
  giscusScript.setAttribute('data-loading', 'lazy')
  giscusScript.setAttribute(
    'data-theme',
    isDark.value ? GISCUS_DARK_THEME : GISCUS_LIGHT_THEME
  )
  giscusScript.setAttribute('crossorigin', 'anonymous')
  giscusScript.async = true
  giscusScript.id = 'giscus-script'

  document.getElementById('giscus-comments')?.appendChild(giscusScript)
}

onMounted(() => {
  loadGiscusScript()
})

onUnmounted(() => {
  // 组件卸载时移除 giscus:backlink meta 标签
  const meta = document.querySelector('meta[name="giscus:backlink"]')
  if (meta) {
    meta.remove()
  }
})

watch([() => props.id], ([newId]) => {
  loadGiscusScript()
})

// 切换主题的时候，动态修改 giscus 评论主题，不需要重新 loadGiscusScript。
watch(isDark, (newVal) => {
  const iframe = document.querySelector<HTMLIFrameElement>(
    'iframe.giscus-frame'
  )
  if (iframe) {
    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: newVal ? GISCUS_DARK_THEME : GISCUS_LIGHT_THEME,
          },
        },
      },
      'https://giscus.app'
    )
  }
})
</script>

<template>
  <h2 :class="$style.h2">
    <Tooltip text="在 GitHub 上发表评论（支持上传图片）">
      <a
        :href="githubDiscussionsUrl"
        target="_blank"
        rel="noopener noreferrer"
        :class="$style.discussionsLink"
      >
        <img :src="icon__github" alt="" :class="$style.githubIcon" />
        Discussions
      </a>
    </Tooltip>
  </h2>
  <div id="giscus-comments"></div>
</template>

<style module src="./Discussions.module.scss"></style>
