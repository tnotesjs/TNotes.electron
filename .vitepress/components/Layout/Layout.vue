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
      <div class="doc-before-container">
        <div class="left-area">
          <div class="toggle-sidebar-box">
            <ToggleSidebar />
          </div>
          <div class="vscode-box" v-show="vscodeNotesDir">
            <a
              :href="vscodeNotesDir"
              aria-label="open in vscode"
              title="open in vscode"
              target="_blank"
            >
              <img :src="icon__vscode" alt="open in vscode" />
            </a>
          </div>
          <div class="content-toggle-box">
            <ToggleFullContent />
          </div>
          <div class="github-box" v-show="isHomeReadme">
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
          <div class="copy-box" v-show="isHomeReadme">
            <span class="tip" v-show="isCopied">Copied!</span>
            <button
              class="copy-raw-file"
              @click="copyRawFile"
              title="Copy raw file"
            >
              <!-- <img class="icon" src="./icon__clipboard.svg" alt="icon__clipboard"> -->
              <img class="icon" :src="m2mm" alt="icon__clipboard" />
            </button>
          </div>
        </div>
        <div class="right-area" v-show="isHomeReadme">
          <span title="已完成笔记数量">✅ 已完成：{{ doneNotesLen }}</span>
        </div>
      </div>
    </template>
    <template #doc-footer-before>
      <div class="footer-update-time" title="笔记更新时间">
        {{ formatDate(vpData.page.value.lastUpdated) }}
      </div>
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

    <!-- <template #sidebar-nav-before>sidebar-nav-before</template> -->
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
import m2mm from '/m2mm.png'

import { useData, useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, ref, watch } from 'vue'

import { data as allNotesConfig } from '../notesConfig.data.js'
import { data as tocData } from './toc.data.js'

// console.log('allNotesConfig', allNotesConfig)

import { formatDate, scrollToTop } from '../utils.js'

import { NOTES_DIR_KEY, TOC_MD } from '../constants.js'

const { Layout } = DefaultTheme
const vpData = useData()
const router = useRouter()
const route = useRoute()

// console.log('notesData:', notesData)
// console.log('vpData:', vpData)
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
const isCopied = ref(false)
const copyRawFile = () => {
  // console.log(notesData, vpData.page.value.title.toLowerCase())
  if (!tocData) return
  navigator.clipboard.writeText(tocData.fileContent)
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

        // !会页面尚未构建完成，不用 vue router，虽然它可以实现无刷新（页面积闪烁）的跳转页面。
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
    // 正常页面也检查是否需要重定向
    // else {
    //   checkRedirect()
    // }
  }, 1000)
})

// 监听路由变化
watch(
  () => route.path,
  () => {
    // 延迟检查以确保路由更新完成
    setTimeout(() => {
      // 如果当前页面是404，则尝试重定向
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
</script>

<style scoped>
.doc-before-container {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: space-between;
}

.doc-before-container .left-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 默认隐藏，当屏幕宽度 >= 960px 时显示，因为当宽度小于 960px 时，侧边栏会自动隐藏 */
.toggle-sidebar-box {
  display: none;
}
@media (min-width: 960px) {
  .toggle-sidebar-box {
    display: block;
  }
}
.vscode-box {
  width: 1.5rem;
  height: 1.5rem;
  padding: 3px;
}
.vscode-box:hover {
  background: var(--vp-c-bg-alt);
}

.copy-box {
  width: 1em;
  height: 1em;
  position: relative;
}

.copy-box .tip {
  position: absolute;
  top: -1.5rem;
  left: -1rem;
}

.copy-box .copy-raw-file {
  vertical-align: top;

  height: 100%;
  line-height: 100%;
}

.right-area {
  display: flex;
  align-items: center;

  font-style: italic;
  font-size: 0.7rem;
}

.update-time {
  vertical-align: middle;
}

.footer-update-time {
  text-align: right;
  font-style: italic;
  font-size: 0.7rem;
}
</style>

<style>
/* 添加 404 页面样式 */
.not-found-container {
  text-align: center;
  padding: 2rem;
  min-height: calc(100vh - var(--vp-nav-height));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.not-found-container h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-container p {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
}

/*
.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}
  */
</style>
