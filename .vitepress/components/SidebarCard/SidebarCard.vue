<script setup>
import { useData } from 'vitepress'

const { theme, site } = useData()

const baseUrl = site.value.base.replace(/\/$/, '')

// 定义组件属性
const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
  done: {
    type: Boolean,
    default: true,
  },
  deprecated: {
    type: Boolean,
    default: false,
  },
})

// 提取文章并根据类型筛选
function extractArticlesWithGroups(
  sidebar,
  showPending,
  showDone,
  showDeprecated
) {
  const articles = []

  function traverse(items, groupPath = []) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // 如果当前项有子项，更新分组路径
      if (item.items && Array.isArray(item.items)) {
        const newGroupPath = [...groupPath, item.text]
        traverse(item.items, newGroupPath)
      }
      // 根据类型筛选文章
      else if (item.text) {
        let shouldInclude = false
        let status = ''
        let cleanText = ''

        if (item.text.startsWith('✅') && showDone) {
          shouldInclude = true
          status = 'done'
          cleanText = item.text.replace('✅ ', '')
        } else if (item.text.startsWith('⏰') && showPending) {
          shouldInclude = true
          status = 'pending'
          cleanText = item.text.replace('⏰ ', '')
        } else if (item.text.startsWith('❌') && showDeprecated) {
          shouldInclude = true
          status = 'deprecated'
          cleanText = item.text.replace('❌ ', '')
        }

        if (shouldInclude) {
          const group = groupPath.join(' / ')

          // 从 link 中提取真实编号（前4位数字）
          // link 格式: "/notes/0016. 仓库简介/README"
          const realNumber = extractRealNumberFromLink(item.link)

          // 从 cleanText 中提取标题（去除开头的编号部分）
          const title = extractTitleFromText(cleanText)

          // 为 link 添加 base 前缀
          const fullLink = baseUrl ? baseUrl + item.link : item.link

          articles.push({
            text: title,
            realNumber,
            link: fullLink,
            group: group || '未分类',
            status,
          })
        }
      }
    }
  }

  traverse(sidebar)
  return articles
}

// 从 link 中提取真实编号
function extractRealNumberFromLink(link) {
  if (!link) return '0000'

  // 匹配 "/notes/" 后面的4位数字
  const match = link.match(/\/notes\/(\d{4})/)
  return match ? match[1] : '0000'
}

// 从文本中提取标题（去除开头的编号部分）
function extractTitleFromText(text) {
  if (!text) return ''

  // 去除开头的编号格式（如 "0016. " 或 "0016 "）
  const match = text.match(/^\d{4}\.?\s*(.*)/)
  return match ? match[2] : text
}

// 处理参数
const articles = extractArticlesWithGroups(
  theme.value.sidebar,
  props.pending,
  props.done,
  props.deprecated
)

// 处理卡片点击事件
function handleCardClick(link) {
  if (link) {
    window.location.href = link
  }
}
</script>

<template>
  <div class="sidebar-cards">
    <div class="cards-grid">
      <div
        class="card"
        v-for="(article, index) in articles"
        :key="article.link"
        @click="handleCardClick(article.link)"
      >
        <div class="card-header">
          <div class="card-numbers">
            <div
              class="card-number-display"
              :class="`status-${article.status}`"
            >
              {{
                (article.status === 'done'
                  ? '✅ '
                  : article.status === 'pending'
                  ? '⏰ '
                  : article.status === 'deprecated'
                  ? '❌ '
                  : '✅ ') + article.realNumber
              }}
            </div>
          </div>
          <div class="card-index">{{ index + 1 }}</div>
        </div>

        <div class="card-body">
          <h3 class="card-title">
            <a :href="article.link" class="title-link" @click.stop>
              {{ article.text }}
            </a>
          </h3>
          <div class="card-group">
            {{ article.group }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-cards {
  width: 100%;
  padding: 1rem 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 100%;
}

/* 响应式网格：确保每行2-4个卡片 */
@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--vp-c-brand-1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.card:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card:hover::before {
  transform: scaleX(1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-numbers {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-number-display {
  color: var(--vp-c-text-1);
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  transition: background-color 0.25s;
}

.card-index {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 12px;
  opacity: 0.5;
}

.status-done {
  color: var(--vp-c-green-1);
}

.status-pending {
  color: var(--vp-c-yellow-1);
}

.status-deprecated {
  color: var(--vp-c-red-1);
}

.card-body {
  flex: 1;
}

.card-title {
  /* 固定高度，最多两行，超出显示省略号 */
  margin-top: 1.2rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  height: 2.7rem; /* 1.5 * 0.9 rem * 2 lines = 2.7rem */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.title-link {
  /* font-weight: bold; */
  text-decoration: none;
  font-size: 0.9rem;
  color: inherit;
  transition: color 0.3s ease;
  display: block;
  height: 100%;
}

.title-link:hover {
  color: var(--vp-c-brand-1);
}

.card-group {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 0.8rem;
  font-style: italic;
  text-align: right;
  color: var(--vp-c-text-2);
}

/* 暗色主题适配 */
.dark .card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dark .card-index {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .card:hover .card-index {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1rem;
    height: 2.8rem; /* 调整移动端高度 */
  }

  .card-index {
    top: -6px;
    left: -6px;
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
