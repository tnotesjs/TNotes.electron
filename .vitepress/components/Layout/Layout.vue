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
          <!-- 单个图标，点击打开 modal，只在有笔记数据的页面显示 -->
          <div
            :class="$style.aboutBtn"
            v-show="currentNoteId && created_at && updated_at"
          >
            <button
              :class="$style.aboutIconButton"
              @click="openTimeModal"
              aria-haspopup="dialog"
              :aria-expanded="timeModalOpen.toString()"
              title="关于这篇笔记"
              type="button"
            >
              !
            </button>
          </div>

          <span title="已完成笔记数量" v-show="isHomeReadme"
            >✅ 已完成：{{ doneNotesLen }}</span
          >
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

        <div
          :class="$style.timeModalContent"
          role="group"
          aria-label="笔记提交信息"
        >
          <div
            :class="$style.timeLine"
            v-if="currentNoteGithubUrl"
            title="在 GitHub 中打开当前笔记"
          >
            <div :class="$style.timeLabel">
              <strong>🔗 GitHub 链接</strong>
            </div>
            <div :class="$style.timeValue">
              <a
                :href="currentNoteGithubUrl"
                target="_blank"
                rel="noopener"
                :class="$style.githubLink"
              >
                在 GitHub 中打开当前笔记
              </a>
            </div>
          </div>

          <div :class="$style.timeLine" title="首次提交时间">
            <div :class="$style.timeLabel"><strong>⌛️ 首次提交</strong></div>
            <div :class="$style.timeValue">{{ formatDate(created_at) }}</div>
          </div>

          <div :class="$style.timeLine" title="最近提交时间">
            <div :class="$style.timeLabel"><strong>⌛️ 最近提交</strong></div>
            <div :class="$style.timeValue">{{ formatDate(updated_at) }}</div>
          </div>
        </div>
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
    <template #aside-outline-before>
      <span
        @click="scrollToTop"
        style="cursor: pointer; height: 1em; width: 1em"
        title="回到顶部"
      >
        <img :src="icon__totop" alt="to top" />
      </span>
    </template>

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

import icon__github from '/icon__github.svg'
import icon__totop from '/icon__totop.svg'
import icon__vscode from '/icon__vscode.svg'
import icon__fold from '/icon__fold.svg'
import m2mm from '/m2mm.png'

import { useData, useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'

import { data as allNotesConfig } from '../notesConfig.data.ts'
import { data as tocData } from './toc.data.ts'

import { formatDate, scrollToTop } from '../utils.ts'

import { NOTES_DIR_KEY, TOC_MD } from '../constants.ts'

import AboutModal from './AboutModal.vue' // <- 新增 modal 组件导入

const { Layout } = DefaultTheme
const vpData = useData()
const router = useRouter()
const route = useRoute()

// 提取当前笔记的 ID（前 4 个数字）
const currentNoteId = computed(() => {
  const match = vpData.page.value.relativePath.match(/notes\/(\d{4})\./)
  return match ? match[1] : null
})

// 根据当前笔记 ID 获取配置数据
const currentNoteConfig = computed(() => {
  return currentNoteId.value && allNotesConfig[currentNoteId.value]
    ? allNotesConfig[currentNoteId.value]
    : {
        bilibili: [],
        done: false,
        enableDiscussions: false, // 默认值
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

onMounted(() => {
  updateVscodeNoteDir()
})
watch(
  () => vpData.page.value.relativePath,
  () => {
    updateVscodeNoteDir()
  }
)

const isHomeReadme = computed(() => vpData.page.value.filePath === TOC_MD)
const doneNotesLen = computed(() => tocData?.doneNotesLen)

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
  if (!tocData) return
  layout.clipboard.writeText(tocData.fileContent)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 1000)

  const targetWindow = window.open('https://tdahuyou.github.io/m2mm/', '_blank')
  setTimeout(() => {
    targetWindow.postMessage(
      {
        senderID: '__TNotes__',
        message: tocData.fileContent,
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
  return '关于这篇笔记'
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
</script>

<style module src="./Layout.module.scss"></style>
