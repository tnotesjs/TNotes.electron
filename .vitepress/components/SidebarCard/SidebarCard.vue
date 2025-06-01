<script setup>
import { useData } from 'vitepress'
import { formatDate } from '../utils.js'
import { ref } from 'vue'
import {
  HOME_SIDEBAR_CARD_SHOW_LAST_UPDATED_KEY,
  HOME_SIDEBAR_CARD_SHOW_CATEGORY_KEY,
} from '../constants.js'

const { theme, site } = useData()

// read config ------------------------------------------------------------
const showLastUpdated = ref(
  localStorage.getItem(HOME_SIDEBAR_CARD_SHOW_LAST_UPDATED_KEY) === 'true'
)
const showCategory = ref(
  localStorage.getItem(HOME_SIDEBAR_CARD_SHOW_CATEGORY_KEY) === 'true'
)

// console.log('useData()', useData())
// console.log(window._tnotes_lastupdatedMap)

const lastUpdatedMap = window._tnotes_lastupdatedMap || {}
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

function extractArticlesWithGroups(
  sidebar,
  showPending,
  showDone,
  showDeprecated
) {
  const articles = []
  const groups = {}

  function traverse(items, groupPath = []) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (item.items && Array.isArray(item.items)) {
        const newGroupPath = [...groupPath, item.text]
        traverse(item.items, newGroupPath)
      } else if (item.text) {
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
          const firstLevelCategory = groupPath[0] || '未分类' // 获取第一层级 category

          const realNumber = extractRealNumberFromLink(item.link)
          const title = extractTitleFromText(cleanText)
          const fullLink = baseUrl ? baseUrl + item.link : item.link

          const article = {
            text: title,
            realNumber,
            link: fullLink,
            group: group || '未分类',
            lastUpdated: formatDate(lastUpdatedMap[item.link]),
            status,
            firstLevelCategory, // 添加 firstLevelCategory 字段
          }

          articles.push(article)

          // 根据 firstLevelCategory 分组
          if (!groups[firstLevelCategory]) {
            groups[firstLevelCategory] = []
          }
          groups[firstLevelCategory].push(article)
        }
      }
    }
  }

  traverse(sidebar)
  return { articles, groups }
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

const { articles, groups } = extractArticlesWithGroups(
  theme.value.sidebar,
  props.pending,
  props.done,
  props.deprecated
)

function handleCardClick(link) {
  if (link) {
    window.location.href = link
  }
}

// group collapse --------------------------------------------------------
const expandedGroups = ref(new Set(Object.keys(groups)))

function toggleGroup(groupName) {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
}
</script>

<template>
  <div class="sidebar-cards">
    <div v-for="(groupArticles, groupName, gIndex) in groups" :key="groupName">
      <!-- Group Header -->
      <div @click="toggleGroup(groupName)" class="group-header">
        {{ groupName }}
        <div class="toggle-icon">
          <span v-if="expandedGroups.has(groupName)">📂</span>
          <span v-else>{{ groupArticles.length }} 📂</span>
        </div>
      </div>
      <!-- Group Content -->
      <div class="cards-grid" v-if="expandedGroups.has(groupName)">
        <div
          class="card"
          v-for="(article, aIndex) in groupArticles"
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
            <div class="card-index">
              {{ gIndex + 1 + '.' + (aIndex + 1) }}
              <!-- {{ aIndex + 1 }} -->
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">
              <a :href="article.link" class="title-link" @click.stop>
                {{ article.text }}
              </a>
            </h3>
            <div class="card-group" v-if="showCategory">
              <div class="card-group-display">
                {{ article.group }}
              </div>
            </div>
          </div>

          <div class="card-footer" v-if="showLastUpdated">
            <div class="card-footer-text">
              {{ article.lastUpdated }}
            </div>
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

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.toggle-icon {
  color: var(--vp-c-text-2);
  /* font-size: 0.8rem; */
  transition: transform 0.3s ease;
}

.group-header:hover .toggle-icon {
  transform: scale(1.2);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 100%;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.cards-grid:first-child {
  border-top: none; /* 第一个组不需要上边框 */
}

.cards-grid h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
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
  display: flex;
  justify-content: end;
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.card-group-display {
  /* color: var(--vp-c-brand-1); */
  padding: 0 0.5rem;
  border-radius: 1rem;
  background-color: var(--vp-c-divider);
}

.card-footer {
  padding-top: 1rem;
  border-radius: 0 0 12px 12px;
  background-color: var(--vp-c-bg-alt);
}

.card-footer-text {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  padding: 0.5rem;
}

/* 暗色主题适配 */
.dark .card-footer {
  background-color: var(--vp-c-bg-alt-dark);
}

.dark .card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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

  .card-footer-text {
    font-size: 0.75rem;
    padding: 0.4rem;
  }
}
</style>
