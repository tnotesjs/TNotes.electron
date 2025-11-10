<template>
  <Layout>
    <template v-if="showNotFound" #not-found>
      <div class="not-found-container">
        <h1>404</h1>
        <p>Page not found</p>
        <!-- <div class="debug-info">
          <p>Current path: {{ decodedCurrentPath }}</p>
          <p>Matched ID: {{ matchedId }}</p>
          <p>Redirect path: {{ redirectPath }}</p>
        </div> -->
      </div>
    </template>
    <template #doc-top>
      <!-- <pre>vscodesNoteDir: {{ vscodeNotesDir }}</pre> -->
      <!-- <pre>vpData.page.value: {{ vpData.page.value }}</pre>
            <pre>currentNoteConfig: {{ currentNoteConfig }}</pre> -->
      <!-- <button @click="copyRawFile" title="Copy raw file">raw</button> -->
      <!-- <pre>{{ tocData }}</pre> -->
      <ImagePreview />
      <Swiper />
      <ContentCollapse />
    </template>
    <!-- <template #doc-bottom>doc-bottom</template> -->
    <template #doc-before>
      <div :class="$style.docBeforeContainer">
        <div :class="$style.leftArea">
          <div
            :class="[$style.toggleSidebarBox, $style.pcOnly]"
            v-show="!isFullContentMode"
          >
            <ToggleSidebar />
          </div>
          <div
            :class="[$style.vscodeBox, $style.pcOnly]"
            v-show="vscodeNotesDir"
          >
            <a
              :href="vscodeNotesDir"
              aria-label="open in vscode"
              title="open in vscode"
              target="_blank"
            >
              <img :src="icon__vscode" alt="open in vscode" />
            </a>
          </div>
          <div :class="[$style.contentToggleBox, $style.pcOnly]">
            <ToggleFullContent />
          </div>
          <!-- 知识库的 GitHub 链接（仅首页显示，PC 端） -->
          <div
            :class="[$style.githubRepoBox, $style.pcOnly]"
            v-show="isHomeReadme"
          >
            <a
              :href="`https://github.com/tnotesjs/${vpData.page.value.title.toLowerCase()}/blob/main/README.md`"
              :aria-label="`tnotesjs github - ${vpData.page.value.title.toLowerCase()} 笔记仓库链接`"
              :title="`tnotesjs github - ${vpData.page.value.title.toLowerCase()} 笔记仓库链接`"
              target="_blank"
              rel="noopener"
            >
              <img :src="icon__github" alt="github icon" />
            </a>
          </div>
          <!-- <div :class="$style.copyBox" v-show="isHomeReadme">
            <span :class="$style.tip" v-show="isCopied">Copied!</span>
            <button
              :class="$style.copyRawFile"
              @click="copyRawFile"
              title="Copy raw file"
            >
              <img :class="$style.icon" :src="m2mm" alt="icon__clipboard" />
            </button>
          </div> -->
        </div>
        <div :class="$style.rightArea">
          <!-- 全局折叠/展开按钮 -->
          <div
            :class="$style.collapseAllBtn"
            v-show="currentNoteId || isHomeReadme"
          >
            <button
              :class="$style.collapseAllButton"
              @click="toggleAllCollapse"
              :title="allCollapsed ? '展开所有区域' : '折叠所有区域'"
              type="button"
            >
              <img :src="icon__fold" alt="collapse all" />
            </button>
          </div>
          <!-- 单个图标，点击打开 modal，只在有笔记数据的页面显示 -->
          <div
            :class="$style.aboutBtn"
            v-show="
              (currentNoteId && created_at && updated_at) ||
              (isHomeReadme && homeReadmeCreatedAt && homeReadmeUpdatedAt)
            "
          >
            <button
              :class="$style.aboutIconButton"
              @click="openTimeModal"
              aria-haspopup="dialog"
              :aria-expanded="timeModalOpen.toString()"
              :title="isHomeReadme ? '关于这个知识库' : '关于这篇笔记'"
              type="button"
            >
              !
            </button>
          </div>
        </div>
      </div>

      <AboutModal
        v-model="timeModalOpen"
        @close="onTimeModalClose"
        :title="modalTitle"
      >
        <template #title>
          {{ modalTitle }}
        </template>

        <AboutPanel
          :is-home-readme="isHomeReadme"
          :current-note-id="currentNoteId"
          :is-dev="isDev"
          v-model:editable-note-title="editableNoteTitle"
          v-model:editable-description="editableDescription"
          v-model:editable-note-status="editableNoteStatus"
          v-model:editable-discussions-enabled="editableDiscussionsEnabled"
          v-model:editable-deprecated="editableDeprecated"
          v-model:title-error="titleError"
          :modal-created-at="modalCreatedAt"
          :modal-updated-at="modalUpdatedAt"
          :modal-github-url="modalGithubUrl"
          :completion-percentage="completionPercentage"
          :done-notes-len="doneNotesLen"
          :total-notes-len="totalNotesLen"
          @title-input="onTitleInput"
          @title-blur="onTitleBlur"
          @description-input="onDescriptionInput"
          @config-change="onConfigChange"
        />

        <!-- 操作按钮（仅开发环境且非首页显示） -->
        <template #footer v-if="isDev && !isHomeReadme">
          <div :class="$style.actionBar">
            <button
              :class="[
                $style.saveButton,
                { [$style.disabled]: !hasConfigChanges },
              ]"
              @click="saveNoteConfig"
              :disabled="!hasConfigChanges || isSaving"
              type="button"
            >
              {{ saveButtonText }}
            </button>
            <button
              v-if="hasConfigChanges"
              @click="resetNoteConfig"
              :class="$style.resetButton"
              type="button"
            >
              重置
            </button>
          </div>

          <!-- 保存进度提示 -->
          <Transition name="toast">
            <div v-if="isSaving && savingMessage" :class="$style.loadingToast">
              <div :class="$style.loadingSpinner"></div>
              <span>{{ savingMessage }}</span>
            </div>
          </Transition>

          <!-- 保存成功提示 -->
          <Transition name="toast">
            <div v-if="showSuccessToast" :class="$style.toast">✓ 保存成功</div>
          </Transition>
        </template>
      </AboutModal>
    </template>
    <template #doc-footer-before>
      <!-- <div class="footer-time-info">
        <p title="首次提交时间">首次提交时间：{{ formatDate(created_at) }}</p>
        <p title="最近提交时间">最近提交时间：{{ formatDate(updated_at) }}</p>
      </div> -->
    </template>
    <template #doc-after>
      <!-- {{ REPO_NAME + '.' + currentNoteId }} -->
      <Discussions v-if="isDiscussionsVisible" :id="currentNoteConfig.id" />
    </template>
    <!-- <template #doc-bottom>
            <Discussions id="TNotes.template.0003" />
        </template> -->

    <template #aside-top>
      <!-- aside-top -->
      <!-- {{ vpData.page.value.title }} -->
    </template>
    <!-- <template #aside-outline-before>
      <span
        @click="scrollToTop"
        style="cursor: pointer; height: 1em; width: 1em"
        title="回到顶部"
      >
        <img :src="icon__totop" alt="to top" />
      </span>
    </template> -->

    <template #sidebar-nav-before>
      <div :class="$style.sidebarControls">
        <span
          @click="toggleAllSidebarSections"
          :class="{ [$style.folded]: !allSidebarExpanded }"
          :title="allSidebarExpanded ? '收起所有章节' : '展开所有章节'"
        >
          <img :src="icon__fold" alt="折叠/展开" />
        </span>
      </div>
    </template>
    <!-- <template #sidebar-nav-after>sidebar-nav-after</template> -->

    <!-- <template #aside-outline-after>aside-outline-after</template> -->
    <!-- <template #aside-bottom>aside-bottom</template> -->
    <!-- <template #aside-ads-before>aside-ads-before</template> -->
    <!-- <template #aside-ads-after>aside-ads-after</template> -->
    <!-- <template #layout-top>layout-top</template> -->
    <!-- <template #layout-bottom>layout-bottom</template> -->
    <!-- <template #nav-bar-title-before>nav-bar-title-before</template> -->
    <!-- <template #nav-bar-title-after>nav-bar-title-after</template> -->
    <!-- <template #nav-bar-content-before>nav-bar-content-before</template> -->
    <!-- <template #nav-bar-content-after>nav-bar-content-after</template> -->

    <!-- !NOTE 不清楚下面的插槽所对应的位置 -->
    <!-- <template #nav-screen-content-before>nav-screen-content-before</template> -->
    <!-- <template #nav-screen-content-after>nav-screen-content-after</template> -->
  </Layout>
</template>

<script setup>
import Discussions from '../Discussions/Discussions.vue'
import ImagePreview from './ImagePreview.vue'
import Swiper from './Swiper.vue'
import ToggleFullContent from './ToggleFullContent.vue'
import ToggleSidebar from './ToggleSidebar.vue'
import ContentCollapse from './ContentCollapse.vue'
import AboutModal from './AboutModal.vue'
import AboutPanel from './AboutPanel.vue'

import icon__github from '/icon__github.svg'
import icon__totop from '/icon__totop.svg'
import icon__vscode from '/icon__vscode.svg'
import icon__fold from '/icon__fold.svg'
import m2mm from '/m2mm.png'

import { useData, useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'

import { data as allNotesConfig } from '../notesConfig.data.ts'
import { data as readmeData } from './homeReadme.data.ts'

import { formatDate, scrollToTop } from '../utils.ts'

import { NOTES_DIR_KEY } from '../constants.ts'

const { Layout } = DefaultTheme
const vpData = useData()
const router = useRouter()
const route = useRoute()

// 提取当前笔记的 ID（前 4 个数字）
const currentNoteId = computed(() => {
  const match = vpData.page.value.relativePath.match(/notes\/(\d{4})\./)
  return match ? match[1] : null
})

// 提取当前笔记的标题（从 relativePath）
const currentNoteTitle = computed(() => {
  // relativePath 格式: notes/0001. 标题/README.md
  const match = vpData.page.value.relativePath.match(
    /notes\/\d{4}\.\s+([^/]+)\//
  )
  return match ? match[1] : ''
})

// 根据当前笔记 ID 获取配置数据
const currentNoteConfig = computed(() => {
  return currentNoteId.value && allNotesConfig[currentNoteId.value]
    ? allNotesConfig[currentNoteId.value]
    : {
        bilibili: [],
        done: false,
        enableDiscussions: false,
      }
})
const isDiscussionsVisible = computed(
  () => currentNoteConfig.value.enableDiscussions
)
const updated_at = computed(() => currentNoteConfig.value.updated_at)
const created_at = computed(() => currentNoteConfig.value.created_at)

const vscodeNotesDir = ref('')

const updateVscodeNoteDir = () => {
  if (typeof window !== 'undefined') {
    const notesDir = localStorage.getItem(NOTES_DIR_KEY)
    vscodeNotesDir.value = notesDir
      ? `vscode://file/${notesDir}/${vpData.page.value.relativePath}`
      : ''
  }
}

/**
 * 拦截 home README 中的笔记链接，将 GitHub 链接转换为站点内跳转
 */
const interceptHomeReadmeLinks = () => {
  if (typeof window === 'undefined') return

  // 只在 home README 页面执行
  if (!isHomeReadme.value) return

  // 延迟执行，确保 DOM 已渲染
  setTimeout(() => {
    const content = document.querySelector('.vp-doc')
    if (!content) return

    // 查找所有指向 GitHub 的笔记链接
    const links = content.querySelectorAll(
      'a[href*="github.com"][href*="/notes/"]'
    )

    links.forEach((link) => {
      const href = link.getAttribute('href')
      if (!href) return

      // 匹配 GitHub 链接格式：https://github.com/{owner}/{repo}/tree/main/notes/{noteDir}/README.md
      const match = href.match(
        /github\.com\/[^/]+\/[^/]+\/tree\/main\/notes\/([^/]+)\/README\.md/
      )

      if (match) {
        const encodedNoteDir = match[1]
        const noteDir = decodeURIComponent(encodedNoteDir)

        // 构建站点内的相对路径
        const base = vpData.site.value.base || '/'
        const internalPath = `${base}notes/${noteDir}/README`

        // 移除原有的点击事件监听器（如果有）
        const newLink = link.cloneNode(true)

        // 添加点击事件拦截
        newLink.addEventListener('click', (e) => {
          e.preventDefault()
          router.go(internalPath)
        })

        // 更新 href 属性（用于悬停显示和右键菜单）
        newLink.setAttribute('href', internalPath)

        // 替换原链接
        link.parentNode?.replaceChild(newLink, link)
      }
    })
  }, 100)
}

onMounted(() => {
  updateVscodeNoteDir()
  interceptHomeReadmeLinks()
})
watch(
  () => vpData.page.value.relativePath,
  () => {
    updateVscodeNoteDir()
    interceptHomeReadmeLinks()
  }
)

// 判断是否为首页 README.md
const isHomeReadme = computed(() => vpData.page.value.filePath === 'README.md')
const doneNotesLen = computed(() => readmeData?.doneNotesLen || 0)
const totalNotesLen = computed(() => readmeData?.totalNotesLen || 0)

// 完成进度百分比
const completionPercentage = computed(() => {
  if (!totalNotesLen.value || totalNotesLen.value === 0) return null
  return Math.round((doneNotesLen.value / totalNotesLen.value) * 100)
})

// 首页 README.md 的时间戳
const homeReadmeCreatedAt = computed(() => readmeData?.created_at)
const homeReadmeUpdatedAt = computed(() => readmeData?.updated_at)

// 计算当前笔记的 GitHub URL
const currentNoteGithubUrl = computed(() => {
  if (!currentNoteId.value) return ''

  // 从 relativePath 提取笔记路径
  // 格式如: notes/0001. xxx/README.md
  const relativePath = vpData.page.value.relativePath
  const match = relativePath.match(/notes\/(\d{4}\.[^/]+)/)

  if (!match) return ''

  const notePath = match[0] // notes/0001. xxx
  const repoName = vpData.site.value.title.toLowerCase() // TNotes.introduction

  return `https://github.com/tnotesjs/${repoName}/tree/main/${notePath}`
})

const isCopied = ref(false)
const copyRawFile = () => {
  if (!readmeData) return
  layout.clipboard.writeText(readmeData.fileContent)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 1000)

  const targetWindow = window.open('https://tdahuyou.github.io/m2mm/', '_blank')
  setTimeout(() => {
    targetWindow.postMessage(
      {
        senderID: '__TNotes__',
        message: readmeData.fileContent,
      },
      '*'
    )
  }, 1000)
}

// #region - 404 redirect
// 控制是否显示 404 内容
const showNotFound = ref(false)
const currentPath = ref('')
const matchedId = ref('')
const redirectPath = ref('')

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

const decodedCurrentPath = computed(() => {
  try {
    return decodeURIComponent(currentPath.value)
  } catch (e) {
    console.error('Failed to decode URI:', e)
    return currentPath.value
  }
})

// 在组件挂载时检查重定向
onMounted(() => {
  // 延迟执行以确保路由状态稳定
  setTimeout(() => {
    // 如果是 404 页面，尝试重定向
    if (vpData.page.value.isNotFound) {
      const redirected = checkRedirect()

      // 如果重定向失败，显示原始 404 内容
      if (!redirected) {
        showNotFound.value = true
      }
    }
  }, 1000)
})

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
// #endregion

// modal 控制
const timeModalOpen = ref(false)
const modalTitle = computed(() => {
  return isHomeReadme.value ? '关于这个知识库' : '关于这篇笔记'
})

// 判断是否为开发环境
const isDev = computed(() => {
  if (typeof window === 'undefined') return false
  // 开发环境通常 location.hostname 为 localhost 或 127.0.0.1
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )
})

// 可编辑的配置项
const editableNoteStatus = ref(false)
const editableDiscussionsEnabled = ref(false)
const editableDeprecated = ref(false)
const editableNoteTitle = ref('')
const editableDescription = ref('')

// 原始配置（用于检测是否有变更）
const originalNoteStatus = ref(false)
const originalDiscussionsEnabled = ref(false)
const originalDeprecated = ref(false)
const originalNoteTitle = ref('')
const originalDescription = ref('')

// 标题验证错误信息
const titleError = ref('')

// 检测是否有配置变更
const hasConfigChanges = computed(() => {
  return (
    editableNoteStatus.value !== originalNoteStatus.value ||
    editableDiscussionsEnabled.value !== originalDiscussionsEnabled.value ||
    editableDeprecated.value !== originalDeprecated.value ||
    editableDescription.value.trim() !== originalDescription.value ||
    (editableNoteTitle.value.trim() !== originalNoteTitle.value &&
      !titleError.value)
  )
})

// 保存状态
const isSaving = ref(false)
const showSuccessToast = ref(false)
const savingMessage = ref('') // 保存进度提示

// 保存按钮文本
const saveButtonText = computed(() => {
  if (isSaving.value) return '保存中...'
  if (!hasConfigChanges.value) return '无更改'
  return '保存配置'
})

// 配置变更时的回调
function onConfigChange() {
  // 配置变更时不需要做额外操作，只需要触发 hasConfigChanges 计算
}

// 标题输入验证
function validateTitle(title) {
  // 非法字符正则
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/
  const windowsReservedNames = new Set([
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ])

  if (!title || title.trim().length === 0) {
    return '标题不能为空'
  }

  const trimmedTitle = title.trim()

  if (trimmedTitle.length > 200) {
    return '标题过长(最多200个字符)'
  }

  if (invalidChars.test(trimmedTitle)) {
    return '标题包含非法字符(不允许: < > : " / \\ | ? *)'
  }

  if (/^[.\s]|[.\s]$/.test(trimmedTitle)) {
    return '标题不能以点或空格开头/结尾'
  }

  const upperTitle = trimmedTitle.toUpperCase()
  if (windowsReservedNames.has(upperTitle)) {
    return `"${trimmedTitle}" 是 Windows 系统保留名称`
  }

  const baseName = trimmedTitle.split('.')[0].toUpperCase()
  if (windowsReservedNames.has(baseName)) {
    return `"${trimmedTitle}" 包含 Windows 系统保留名称`
  }

  return null
}

// 标题输入事件
function onTitleInput() {
  const error = validateTitle(editableNoteTitle.value)
  titleError.value = error || ''
}

// 标题失焦事件
function onTitleBlur() {
  // 去除首尾空格
  editableNoteTitle.value = editableNoteTitle.value.trim()
  onTitleInput()
}

// 简介输入事件
function onDescriptionInput() {
  // 简介没有特殊验证,只需要触发变更检测
}

// 初始化可编辑字段
function initEditableFields() {
  if (!currentNoteConfig.value) return

  editableNoteStatus.value = currentNoteConfig.value.done || false
  editableDiscussionsEnabled.value =
    currentNoteConfig.value.enableDiscussions || false
  editableDeprecated.value = currentNoteConfig.value.deprecated || false
  editableNoteTitle.value = currentNoteTitle.value || ''
  editableDescription.value = currentNoteConfig.value.description || ''

  // 保存原始值
  originalNoteStatus.value = editableNoteStatus.value
  originalDiscussionsEnabled.value = editableDiscussionsEnabled.value
  originalDeprecated.value = editableDeprecated.value
  originalNoteTitle.value = editableNoteTitle.value
  originalDescription.value = editableDescription.value

  // 清除错误信息
  titleError.value = ''
}

// 保存笔记配置
async function saveNoteConfig() {
  if (!currentNoteId.value || !isDev.value || !hasConfigChanges.value) return

  // 验证标题
  if (titleError.value) {
    alert('❌ 请修正标题错误后再保存')
    return
  }

  const titleChanged =
    editableNoteTitle.value.trim() !== originalNoteTitle.value &&
    editableNoteTitle.value.trim()

  isSaving.value = true
  savingMessage.value = '正在保存配置...'

  try {
    // 如果标题有变化,先重命名文件夹
    if (titleChanged) {
      savingMessage.value = '正在重命名文件夹...'

      const renameResponse = await fetch('/__tnotes_rename_note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: currentNoteId.value,
          newTitle: editableNoteTitle.value.trim(),
        }),
      })

      if (!renameResponse.ok) {
        const error = await renameResponse.text()
        throw new Error(`重命名失败: ${error}`)
      }

      // 后端已经完成所有更新,包括文件系统同步
      const result = await renameResponse.json()
      console.log('重命名完成:', result)

      savingMessage.value = '文件已同步,准备跳转...'
    }

    // 检查是否需要更新配置（无论标题是否改变）
    const needConfigUpdate =
      editableNoteStatus.value !== originalNoteStatus.value ||
      editableDiscussionsEnabled.value !== originalDiscussionsEnabled.value ||
      editableDeprecated.value !== originalDeprecated.value ||
      editableDescription.value.trim() !== originalDescription.value

    if (needConfigUpdate) {
      savingMessage.value = '正在更新笔记配置...'

      const response = await fetch('/__tnotes_update_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: currentNoteId.value,
          config: {
            done: editableNoteStatus.value,
            enableDiscussions: editableDiscussionsEnabled.value,
            deprecated: editableDeprecated.value,
            description: editableDescription.value.trim(),
          },
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || '保存失败')
      }
    }

    // 更新原始值
    originalNoteStatus.value = editableNoteStatus.value
    originalDiscussionsEnabled.value = editableDiscussionsEnabled.value
    originalDeprecated.value = editableDeprecated.value
    originalNoteTitle.value = editableNoteTitle.value.trim()
    originalDescription.value = editableDescription.value.trim()

    // 更新本地配置（立即反映在页面上）
    if (allNotesConfig[currentNoteId.value]) {
      allNotesConfig[currentNoteId.value].done = editableNoteStatus.value
      allNotesConfig[currentNoteId.value].enableDiscussions =
        editableDiscussionsEnabled.value
      allNotesConfig[currentNoteId.value].deprecated = editableDeprecated.value
      allNotesConfig[currentNoteId.value].description =
        editableDescription.value.trim()
    }

    savingMessage.value = '保存成功！'

    // 显示成功提示
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)

    // 如果标题改变了,先跳转到loading页,再由loading页根据configId查询目标URL
    if (titleChanged) {
      // 获取当前笔记的 configId (UUID)
      const configId = allNotesConfig[currentNoteId.value]?.id

      if (!configId) {
        throw new Error('无法获取笔记的 configId')
      }

      // 跳转到loading页,传递 configId 参数
      const base = vpData.site.value.base || '/'
      const loadingUrl = `${base}loading?configId=${encodeURIComponent(
        configId
      )}`
      window.location.href = loadingUrl
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    savingMessage.value = ''

    alert(
      '❌ 保存失败: ' + (error instanceof Error ? error.message : String(error))
    )
  } finally {
    if (!titleChanged) {
      isSaving.value = false
      savingMessage.value = ''
    }
  }
}

// 重置笔记配置
function resetNoteConfig() {
  editableNoteStatus.value = originalNoteStatus.value
  editableDiscussionsEnabled.value = originalDiscussionsEnabled.value
  editableDeprecated.value = originalDeprecated.value
  editableNoteTitle.value = originalNoteTitle.value
  editableDescription.value = originalDescription.value
  titleError.value = ''
}

// 监听笔记配置变化，重新初始化字段
watch(
  () => currentNoteConfig.value,
  () => {
    initEditableFields()
  },
  { immediate: true }
)

// modal 打开时重新初始化（确保数据最新）
watch(timeModalOpen, (isOpen) => {
  if (isOpen) {
    initEditableFields()
  }
})

// modal 中显示的 GitHub 链接
const modalGithubUrl = computed(() => {
  if (isHomeReadme.value) {
    const repoName = vpData.site.value.title.toLowerCase()
    return `https://github.com/tnotesjs/${repoName}`
  }
  return currentNoteGithubUrl.value
})

// modal 中显示的创建时间
const modalCreatedAt = computed(() => {
  return isHomeReadme.value ? homeReadmeCreatedAt.value : created_at.value
})

// modal 中显示的更新时间
const modalUpdatedAt = computed(() => {
  return isHomeReadme.value ? homeReadmeUpdatedAt.value : updated_at.value
})

function openTimeModal() {
  timeModalOpen.value = true
}
function onTimeModalClose() {
  timeModalOpen.value = false
}

// #region - 全屏状态检测
const isFullContentMode = ref(false)

function checkFullContentMode() {
  if (typeof document === 'undefined') return

  // 检测 VitePress 的全屏内容模式（通过检查 body 或根元素的 class）
  const vpApp = document.querySelector('.VPContent')
  if (vpApp) {
    // VitePress 全屏模式通常会给容器添加特定的 class 或样式
    // 我们检测 sidebar 是否被隐藏
    const sidebar = document.querySelector('.VPSidebar')
    if (sidebar) {
      const sidebarDisplay = window.getComputedStyle(sidebar).display
      isFullContentMode.value = sidebarDisplay === 'none'
    }
  }
}

// 监听窗口大小变化和全屏事件
onMounted(() => {
  if (typeof window !== 'undefined') {
    checkFullContentMode()
    window.addEventListener('resize', checkFullContentMode)
    // 监听 VitePress 的侧边栏切换事件
    const observer = new MutationObserver(checkFullContentMode)
    const vpLayout = document.querySelector('.Layout')
    if (vpLayout) {
      observer.observe(vpLayout, {
        attributes: true,
        childList: true,
        subtree: true,
      })
    }
  }
})

// 监听路由变化时重新检查
watch(
  () => route.path,
  () => {
    setTimeout(checkFullContentMode, 100)
  }
)
// #endregion

// #region - 侧边栏展开/收起控制
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
    const button = item.querySelector('.caret')
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
// #endregion

// #region - 全局折叠/展开功能
const allCollapsed = ref(false)

function toggleAllCollapse() {
  if (typeof document === 'undefined') return

  allCollapsed.value = !allCollapsed.value

  // 获取所有折叠区域
  const tocHeaders = document.querySelectorAll('.toc-collapse-header')
  const h2Elements = document.querySelectorAll('.vp-doc h2.collapsible-h2')

  // 切换 TOC 区域
  tocHeaders.forEach((header) => {
    const content = header.nextElementSibling
    if (!content) return

    const isCollapsed = content.classList.contains('collapsed')

    // 根据目标状态决定是否需要切换
    if (allCollapsed.value && !isCollapsed) {
      // 需要折叠 - 直接操作 DOM
      content.classList.add('collapsed')
      header.classList.add('collapsed')
      // 保存状态到 localStorage
      const noteKey = route.path.replace(/\//g, '_')
      const storageKey = `tnotes_collapse_state_${noteKey}_toc`
      localStorage.setItem(storageKey, '1')
    } else if (!allCollapsed.value && isCollapsed) {
      // 需要展开 - 直接操作 DOM
      content.classList.remove('collapsed')
      header.classList.remove('collapsed')
      // 保存状态到 localStorage
      const noteKey = route.path.replace(/\//g, '_')
      const storageKey = `tnotes_collapse_state_${noteKey}_toc`
      localStorage.setItem(storageKey, '0')
    }
  })

  // 切换 H2 区域
  h2Elements.forEach((h2) => {
    const content = h2.nextElementSibling
    if (!content || !content.classList.contains('h2-collapse-content')) return

    const isCollapsed = content.classList.contains('collapsed')
    const h2Id = h2.id || `h2_${Array.from(h2Elements).indexOf(h2)}`

    // 根据目标状态决定是否需要切换
    if (allCollapsed.value && !isCollapsed) {
      // 需要折叠 - 直接操作 DOM
      content.classList.add('collapsed')
      h2.classList.add('collapsed')
      // 保存状态到 localStorage
      const noteKey = route.path.replace(/\//g, '_')
      const storageKey = `tnotes_collapse_state_${noteKey}_h2_${h2Id}`
      localStorage.setItem(storageKey, '1')
    } else if (!allCollapsed.value && isCollapsed) {
      // 需要展开 - 直接操作 DOM
      content.classList.remove('collapsed')
      h2.classList.remove('collapsed')
      // 保存状态到 localStorage
      const noteKey = route.path.replace(/\//g, '_')
      const storageKey = `tnotes_collapse_state_${noteKey}_h2_${h2Id}`
      localStorage.setItem(storageKey, '0')
    }
  })
}

// 监听路由变化，重置折叠状态
watch(
  () => route.path,
  () => {
    allCollapsed.value = false
  }
)
// #endregion
</script>

<style module src="./Layout.module.scss"></style>
