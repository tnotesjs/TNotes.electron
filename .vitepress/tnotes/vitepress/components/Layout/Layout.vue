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
      <DocBeforeControls
        :is-full-content-mode="isFullContentMode"
        :vscode-notes-dir="vscodeNotesDir"
        :is-home-readme="isHomeReadme"
        :current-note-id="currentNoteId"
        :created_at="created_at"
        :updated_at="updated_at"
        :home-readme-created-at="homeReadmeCreatedAt"
        :home-readme-updated-at="homeReadmeUpdatedAt"
        :time-modal-open="timeModalOpen"
        :all-collapsed="allCollapsed"
        @open-time-modal="openTimeModal"
        @toggle-all-collapse="toggleAllCollapse"
      />

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
import ContentCollapse from './ContentCollapse.vue'
import AboutModal from './AboutModal.vue'
import AboutPanel from './AboutPanel.vue'
import DocBeforeControls from './DocBeforeControls.vue'

import icon__fold from '/icon__fold.svg'

import { useData, useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, ref, watch } from 'vue'

import { data as allNotesConfig } from '../notesConfig.data.ts'
import { data as readmeData } from './homeReadme.data.ts'

// Composables
import { useRedirect } from './composables/useRedirect'
import { useNoteConfig } from './composables/useNoteConfig'
import { useNoteValidation } from './composables/useNoteValidation'
import { useNoteSave } from './composables/useNoteSave'
import { useSidebarControl } from './composables/useSidebarControl'
import { useCollapseControl } from './composables/useCollapseControl'
import { useVSCodeIntegration } from './composables/useVSCodeIntegration'

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

// #region - Composables
// 404 重定向
const { showNotFound, decodedCurrentPath, initRedirectCheck } =
  useRedirect(allNotesConfig)

// modal 控制
const timeModalOpen = ref(false)

// 笔记配置管理
const {
  editableNoteStatus,
  editableDiscussionsEnabled,
  editableDeprecated,
  editableNoteTitle,
  editableDescription,
  titleError,
  hasConfigChanges,
  resetNoteConfig,
  updateOriginalValues,
} = useNoteConfig(
  currentNoteId,
  currentNoteConfig,
  currentNoteTitle,
  timeModalOpen
)

// 标题验证
const { onTitleInput: validateTitleInput, onTitleBlur: validateTitleBlur } =
  useNoteValidation()

// 保存逻辑
const {
  isSaving,
  showSuccessToast,
  savingMessage,
  saveButtonText,
  saveNoteConfig,
} = useNoteSave(
  currentNoteId,
  computed(() => {
    if (typeof window === 'undefined') return false
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    )
  }),
  hasConfigChanges,
  titleError,
  editableNoteTitle,
  computed(() => currentNoteTitle.value),
  editableNoteStatus,
  computed(() => currentNoteConfig.value.done || false),
  editableDiscussionsEnabled,
  computed(() => currentNoteConfig.value.enableDiscussions || false),
  editableDeprecated,
  computed(() => currentNoteConfig.value.deprecated || false),
  editableDescription,
  computed(() => currentNoteConfig.value.description || ''),
  allNotesConfig,
  updateOriginalValues
)

// 侧边栏控制
const { allSidebarExpanded, toggleAllSidebarSections } = useSidebarControl()

// 折叠控制
const { allCollapsed, toggleAllCollapse } = useCollapseControl()

// VSCode 集成
const { vscodeNotesDir, updateVscodeNoteDir, interceptHomeReadmeLinks } =
  useVSCodeIntegration()

// 判断是否为开发环境
const isDev = computed(() => {
  if (typeof window === 'undefined') return false
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )
})

// #endregion

// modal 标题
const modalTitle = computed(() => {
  return isHomeReadme.value ? '关于这个知识库' : '关于这篇笔记'
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

// 配置变更时的回调
function onConfigChange() {
  // 配置变更时不需要做额外操作，只需要触发 hasConfigChanges 计算
}

// 标题输入事件
function onTitleInput() {
  validateTitleInput(editableNoteTitle, titleError)
}

// 标题失焦事件
function onTitleBlur() {
  validateTitleBlur(editableNoteTitle, titleError)
}

// 简介输入事件
function onDescriptionInput() {
  // 简介没有特殊验证,只需要触发变更检测
}

// #region - 全屏状态检测
const isFullContentMode = ref(false)

function checkFullContentMode() {
  if (typeof document === 'undefined') return

  const vpApp = document.querySelector('.VPContent')
  if (vpApp) {
    const sidebar = document.querySelector('.VPSidebar')
    if (sidebar) {
      const sidebarDisplay = window.getComputedStyle(sidebar).display
      isFullContentMode.value = sidebarDisplay === 'none'
    }
  }
}
// #endregion

// 生命周期钩子
onMounted(() => {
  updateVscodeNoteDir()
  interceptHomeReadmeLinks(isHomeReadme, router)
  initRedirectCheck()

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

// 监听路由变化
watch(
  () => vpData.page.value.relativePath,
  () => {
    updateVscodeNoteDir()
    interceptHomeReadmeLinks(isHomeReadme, router)
  }
)

watch(
  () => route.path,
  () => {
    setTimeout(checkFullContentMode, 100)
  }
)
</script>

<style module src="./Layout.module.scss"></style>
