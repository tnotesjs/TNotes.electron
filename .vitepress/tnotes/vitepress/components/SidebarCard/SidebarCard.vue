<script setup>
import { useData } from 'vitepress'
import { formatDate } from '../utils.ts'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vitepress'
// @ts-expect-error - VitePress Data Loader
import { data as sidebarConfig } from '../sidebar.data'

import {
  NOTES_DIR_KEY,
  NOTES_VIEW_KEY,
  REPO_NAME,
  AUTHOR,
  ROOT_ITEM,
} from '../constants.ts'

import icon__fold from '/icon__fold.svg'
import icon__github from '/icon__github.svg'
import icon__vscode from '/icon__vscode.svg'
import icon__card from '/icon__card.svg'
import icon__folder from '/icon__folder.svg'

// #region props
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
// #endregion

// #region data
/**
 * 视图模式
 * 可选值 'cards' 或 'folder'
 */
const viewMode = ref('cards')
const expandedGroupsFolder = ref(new Set())
// #endregion

// #region watch
// 监听视图模式变化并保存到 localStorage
watch(viewMode, (newMode) => {
  localStorage.setItem(NOTES_VIEW_KEY, newMode)
})
// #endregion

// #region hooks
onMounted(() => {
  const savedViewMode = localStorage.getItem(NOTES_VIEW_KEY)
  if (savedViewMode) {
    viewMode.value = savedViewMode
  }
  // console.log('folderViewData', folderViewData.value)
})
// #endregion

// #region computed
const folderViewData = computed(() => {
  const result = {}

  // 按完整分组路径构建层级结构（平铺模式）
  articles.forEach((article) => {
    // 将所有层级铺出来，路径信息作为分组名
    // eg. 1. 第一层级/第一个第二层级
    //          article 1
    //          article 2
    //          ……
    //     1. 第一层级/第二个第二层级
    //          article 1
    //          article 2
    //          ……
    //     1. 第一层级/第三个第二层级
    //          article 1
    //          article 2
    //          ……
    // const group = article.group
    // if (!result[group]) {
    //   result[group] = {
    //     name: group,
    //     articles: [],
    //     fullPath: group,
    //   }
    // }
    // result[group].articles.push(article)

    // 只铺出第一层级
    const firstLevelCategory = article.firstLevelCategory
    if (!result[firstLevelCategory]) {
      result[firstLevelCategory] = {
        name: firstLevelCategory,
        articles: [],
        fullPath: firstLevelCategory,
      }
    }
    result[firstLevelCategory].articles.push(article)
  })

  return result
})
// #endregion

const router = useRouter()
const { site } = useData()
const baseUrl = site.value.base.replace(/\/$/, '')

// 使用 VitePress Data Loader 读取的 sidebar 数据
const sidebarData = computed(() => {
  return sidebarConfig && sidebarConfig['/notes/']
    ? sidebarConfig['/notes/']
    : []
})

const { articles, groups } = extractArticlesWithGroups(
  sidebarData.value,
  props.pending,
  props.done,
  props.deprecated
)
const expandedGroups = ref(new Set(Object.keys(groups)))

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
          const firstLevelCategory = groupPath[0] || '未分类'

          const realNumber = extractRealNumberFromLink(item.link)
          const title = extractTitleFromText(cleanText)
          const fullLink = baseUrl ? baseUrl + item.link : item.link

          // 添加 relativePath 字段
          const article = {
            text: title,
            realNumber,
            link: fullLink,
            relativePath: item.link, // 存储相对路径
            group: group || '未分类',
            status,
            firstLevelCategory,
          }

          articles.push(article)

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

  const match = link.match(/\/notes\/(\d{4})/)
  return match ? match[1] : '0000'
}

// 从文本中提取标题（去除开头的编号部分）
function extractTitleFromText(text) {
  if (!text) return ''

  return text.replace(/^\d{4}\.?\s/, '')
}

function handleCardClick(link) {
  // open in new tab
  if (link) {
    window.open(link, '_blank')
  }

  // open in current tab
  // if (link) {
  //   window.location.href = link
  // }
}

function toggleGroup(groupName) {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
}

// 在文件夹视图中切换分组展开状态
function toggleGroupFolder(groupName) {
  if (expandedGroupsFolder.value.has(groupName)) {
    expandedGroupsFolder.value.delete(groupName)
  } else {
    expandedGroupsFolder.value.add(groupName)
  }
}

// 切换所有折叠状态
function toggleAllFold() {
  const isAllExpanded =
    viewMode.value === 'cards'
      ? expandedGroups.value.size === Object.keys(groups).length
      : expandedGroupsFolder.value.size ===
        Object.keys(folderViewData.value).length

  if (viewMode.value === 'cards') {
    if (isAllExpanded) {
      expandedGroups.value.clear()
    } else {
      Object.keys(groups).forEach((groupName) => {
        expandedGroups.value.add(groupName)
      })
    }
  } else {
    if (isAllExpanded) {
      expandedGroupsFolder.value.clear()
    } else {
      Object.keys(folderViewData.value).forEach((folderName) => {
        expandedGroupsFolder.value.add(
          folderViewData.value[folderName].fullPath
        )
      })
    }
  }
}

// 打开 GitHub 仓库
function openGithubRepo() {
  window.open(`https://github.com/${AUTHOR}/${REPO_NAME}`, '_blank')
}

// 打开 VS Code 知识库
function openVSCodeRepo() {
  const notesDir = localStorage.getItem(NOTES_DIR_KEY)

  if (!notesDir) {
    const shouldRedirect = confirm(
      '请先配置本地知识库所在位置，点击确定跳转到设置页面'
    )
    if (shouldRedirect) {
      router.go(`${REPO_NAME}/Settings`)
    }
    return
  }

  window.open('vscode://file/' + notesDir, '_blank')
}

// 打开 VS Code 中的笔记目录
function openVSCodeArticle(article) {
  const notesDir = localStorage.getItem(NOTES_DIR_KEY)

  if (!notesDir) {
    const shouldRedirect = confirm(
      '请先配置本地知识库所在位置，点击确定跳转到设置页面'
    )
    if (shouldRedirect) {
      router.go(`${REPO_NAME}/Settings`)
    }
    return
  }

  // 构建笔记目录路径
  const notePath = `${notesDir}/${article.relativePath.replace('/README', '')}`
  // console.log(notePath, encodeURI(notePath))
  window.open('vscode://file/' + encodeURI(notePath), '_blank')
}
</script>

<template>
  <div class="sidebar-view-container">
    <!-- 控制栏区域 -->
    <div class="control-bar">
      <!-- 左侧视图切换按钮 -->
      <div class="view-toggle">
        <button
          :class="{ active: viewMode === 'cards' }"
          @click="viewMode = 'cards'"
        >
          <img :src="icon__card" alt="卡片视图" />
        </button>
        <button
          :class="{ active: viewMode === 'folder' }"
          @click="viewMode = 'folder'"
        >
          <img :src="icon__folder" alt="文件夹视图" />
        </button>
      </div>

      <!-- 右侧控制按钮 -->
      <div class="actions">
        <!-- 折叠/展开按钮 -->
        <button class="fold-toggle" @click="toggleAllFold">
          <img :src="icon__fold" alt="折叠/展开" />
        </button>

        <!-- GitHub 按钮 -->
        <button class="github-link" @click="openGithubRepo">
          <img :src="icon__github" alt="GitHub仓库" />
        </button>

        <!-- VS Code 按钮 -->
        <button class="vscode-open" @click="openVSCodeRepo">
          <img :src="icon__vscode" alt="使用 VS Code 打开本地知识库" />
        </button>
      </div>
    </div>
    <!-- 卡片视图 -->
    <div class="sidebar-cards" v-if="viewMode === 'cards'">
      <div
        v-for="(groupArticles, groupName, gIndex) in groups"
        :key="groupName"
      >
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
              </div>
            </div>

            <div class="card-body">
              <h3 class="card-title">
                <a :href="article.link" class="title-link" @click.stop>
                  {{ article.text }}
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 文件夹视图 -->
    <div class="folder-view" v-if="viewMode === 'folder'">
      <div class="folder-tree">
        <div
          v-for="(folder, folderName) in folderViewData"
          :key="folderName"
          class="folder-group"
        >
          <!-- 文件夹组 -->
          <div
            class="folder-header"
            @click="toggleGroupFolder(folder.fullPath)"
          >
            <span class="folder-icon">
              {{ expandedGroupsFolder.has(folder.fullPath) ? '📂' : '📁' }}
            </span>
            <span class="folder-name">{{ folderName }}</span>
            <span class="folder-count">{{ folder.articles.length }} 篇</span>
          </div>

          <!-- 展开的文章 -->
          <div
            class="folder-content"
            v-if="expandedGroupsFolder.has(folder.fullPath)"
          >
            <!-- 当前文件夹中的文章 -->
            <div
              v-for="article in folder.articles"
              :key="article.link"
              class="folder-article"
            >
              <div class="article-info" @click="handleCardClick(article.link)">
                <span
                  class="article-status"
                  :class="`status-${article.status}`"
                >
                  {{
                    article.status === 'done'
                      ? '✅'
                      : article.status === 'pending'
                      ? '⏰'
                      : article.status === 'deprecated'
                      ? '❌'
                      : '📄'
                  }}
                </span>
                <!-- <span class="article-number">{{ article.realNumber }}</span> -->
                <span class="article-title">{{ article.text }}</span>
              </div>

              <button
                class="vscode-article"
                @click.stop="openVSCodeArticle(article)"
                title="在 VS Code 中打开笔记目录"
              >
                <img :src="icon__vscode" alt="打开笔记目录" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="stats-info">
      <div class="stat-item">
        <span class="stat-label">🗓 创建时间</span>
        <span class="stat-value">{{ formatDate(ROOT_ITEM.created_at) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">♻️ 更新时间</span>
        <span class="stat-value">{{ formatDate(ROOT_ITEM.updated_at) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">✅ 完成进度</span>
        <span class="stat-value"
          >{{
            (() => {
              const keys = Object.keys(ROOT_ITEM.completed_notes_count)
              if (keys.length === 0) return 0
              // 找到年月最大的键 (如 '25.12' > '25.11' > '24.12')
              const latestKey = keys.reduce((max, key) =>
                key > max ? key : max
              )
              return ROOT_ITEM.completed_notes_count[latestKey] || 0
            })()
          }}
          / {{ articles.length }} ≈
          {{
            (() => {
              const keys = Object.keys(ROOT_ITEM.completed_notes_count)
              if (keys.length === 0) return 0
              const latestKey = keys.reduce((max, key) =>
                key > max ? key : max
              )
              const count = ROOT_ITEM.completed_notes_count[latestKey] || 0
              return Math.floor((count / articles.length) * 100)
            })()
          }}%</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  font-size: 0.8rem;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .stat-label {
    color: var(--vp-c-text-2);
    margin-bottom: 0.25rem;
  }

  .stat-value {
    color: var(--vp-c-brand-1);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-info {
    flex-direction: column;
    gap: 0.75rem;

    .stat-item {
      flex-direction: row;
      justify-content: space-between;
      padding: 0.25rem 0;
      border-bottom: 1px solid var(--vp-c-divider);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.sidebar-cards {
  width: 100%;
  padding: 1rem 0;

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

    .toggle-icon {
      color: var(--vp-c-text-2);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 100%;
    margin-bottom: 2rem;
    padding-top: 1rem;

    &:first-child {
      border-top: none;
    }

    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--vp-c-text-1);
    }

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1280px) {
      grid-template-columns: repeat(4, 1fr);
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

      &::before {
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

      &:hover {
        background: var(--vp-c-bg-elv);
        border-color: var(--vp-c-brand-1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

        &::before {
          transform: scaleX(1);
        }
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

        &.status-done {
          color: var(--vp-c-green-1);
        }

        &.status-pending {
          color: var(--vp-c-yellow-1);
        }

        &.status-deprecated {
          color: var(--vp-c-red-1);
        }
      }

      .card-index {
        display: flex;
        align-items: center;
        color: var(--vp-c-text-2);
        font-style: italic;
        font-size: 12px;
        opacity: 0.5;
      }

      .card-body {
        flex: 1;
      }

      .card-title {
        margin-top: 1.2rem;
        line-height: 1.5;
        color: var(--vp-c-text-1);
        height: 2.7rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .title-link {
        text-decoration: none;
        font-size: 0.9rem;
        color: inherit;
        transition: color 0.3s ease;
        display: block;
        height: 100%;

        &:hover {
          color: var(--vp-c-brand-1);
        }
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
        padding: 0 0.5rem;
        border-radius: 1rem;
        background-color: var(--vp-c-divider);
      }

      .card-footer {
        padding-top: 1rem;
        border-radius: 0 0 12px 12px;
        background-color: var(--vp-c-bg-alt);

        .card-footer-text {
          font-size: 0.875rem;
          color: var(--vp-c-text-2);
          line-height: 1.4;
          padding: 0.5rem;
        }
      }
    }
  }

  /* 暗色主题适配 */
  .dark {
    .card-footer {
      background-color: var(--vp-c-bg-alt-dark);
    }

    .card:hover {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
  }

  /* 移动端适配 */
  @media (max-width: 640px) {
    .cards-grid {
      grid-template-columns: 1fr;
      gap: 1rem;

      .card {
        padding: 1rem;

        .card-title {
          font-size: 1rem;
          height: 2.8rem;
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
    }
  }
}

/* 文件夹视图样式 */
.folder-view {
  width: 100%;
  padding: 1rem 0;

  .folder-tree {
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
    padding: 1rem;

    .folder-group {
      margin-bottom: 1rem;
      border: 1px solid var(--vp-c-divider);
      border-radius: 8px;
      overflow: hidden;

      .folder-header {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: var(--vp-c-bg-soft);
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: var(--vp-c-bg-elv);
        }

        .folder-icon {
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }

        .folder-name {
          flex: 1;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .folder-count {
          background-color: var(--vp-c-default-soft);
          color: var(--vp-c-text-2);
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
      }

      .folder-content {
        padding: 0.5rem 1rem;
        background-color: var(--vp-c-bg);

        .folder-article {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.8rem;
          margin: 0.4rem 0;
          border-radius: 6px;
          transition: background-color 0.3s;

          &:hover {
            background-color: var(--vp-c-bg-soft);
          }

          .article-info {
            display: flex;
            align-items: center;
            flex: 1;
            cursor: pointer;
            overflow: hidden;

            .article-status {
              margin-right: 0.8rem;
              font-size: 0.9rem;
              width: 1.2rem;
              text-align: center;
              flex-shrink: 0;

              &.status-done {
                color: var(--vp-c-green-1);
              }

              &.status-pending {
                color: var(--vp-c-yellow-1);
              }

              &.status-deprecated {
                color: var(--vp-c-red-1);
              }
            }

            .article-number {
              background-color: var(--vp-c-default-soft);
              color: var(--vp-c-text-2);
              font-size: 0.75rem;
              padding: 0.2rem 0.5rem;
              border-radius: 4px;
              font-family: var(--vp-font-family-mono);
              flex-shrink: 0;
              margin-right: 0.8rem;
            }

            .article-title {
              font-size: 0.9rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .vscode-article {
            background: none;
            border: none;
            padding: 0.3rem;
            cursor: pointer;
            border-radius: 4px;
            flex-shrink: 0;
            opacity: 0.5;
            transition: opacity 0.3s ease;

            &:hover {
              opacity: 1;
              background-color: var(--vp-c-bg-soft-down);
            }

            img {
              display: block;
              height: 1rem;
              width: 1rem;
            }
          }
        }
      }
    }
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .folder-content {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
}

/* 控制栏样式 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.view-toggle {
  display: flex;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

/* 折叠/展开按钮和GitHub按钮样式 */
.fold-toggle,
.github-link,
.vscode-open {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--vp-c-bg-soft);
  }

  img {
    display: block;
    height: 1rem;
    width: 1rem;
    opacity: 0.7;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
}

/* 原有视图切换按钮样式调整 */
.view-toggle {
  button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &.active {
      background-color: var(--vp-c-bg-soft);

      &::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--vp-c-brand);
      }
    }

    &:hover:not(.active) {
      background-color: var(--vp-c-bg-soft);
    }

    img {
      display: block;
      height: 1rem;
      width: 1rem;
      opacity: 0.7;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
