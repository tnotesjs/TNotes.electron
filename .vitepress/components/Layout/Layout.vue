<template>
  <Layout>
    <template v-if="showNotFound" #not-found>
      <div class="not-found-container">
        <h1>404</h1>
        <p>Page not found</p>
        <div class="debug-info">
          <p>Current path: {{ currentPath }}</p>
          <p>Matched ID: {{ matchedId }}</p>
          <p>Redirect path: {{ redirectPath }}</p>
        </div>
      </div>
    </template>
    <template #doc-top>
      <!-- <pre>vscodesNoteDir: {{ vscodeNotesDir }}</pre> -->
      <!-- <pre>vpData.page.value: {{ vpData.page.value }}</pre>
            <pre>currentNoteConfig: {{ currentNoteConfig }}</pre> -->
      <!-- <button @click="copyRawFile" title="Copy raw file">raw</button> -->
      <!-- <pre>{{ tocData }}</pre> -->
    </template>
    <!-- <template #doc-bottom>doc-bottom</template> -->
    <template #doc-before>
      <div class="doc-before-container">
        <div class="left-area">
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
          <div class="github-box" v-show="isHomeReadme">
            <a
              :href="`https://github.com/Tdahuyou/${vpData.page.value.title.toLowerCase()}/blob/main/README.md`"
              :aria-label="`Tdahuyou github - ${vpData.page.value.title.toLowerCase()} 笔记仓库链接`"
              :title="`Tdahuyou github - ${vpData.page.value.title.toLowerCase()} 笔记仓库链接`"
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
import icon__vscode from '/icon__vscode.svg'
import icon__totop from '/icon__totop.svg'
import m2mm from '/m2mm.png'
import icon__github from '/icon__github.svg'

import DefaultTheme from 'vitepress/theme'
import { useData, useRouter, useRoute } from 'vitepress'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

import Discussions from '../Discussions/Discussions.vue'

import { data as tocData } from './toc.data.js'
import { data as allNotesConfig } from '../notesConfig.data.js'

// console.log('allNotesConfig', allNotesConfig)

import { formatDate, scrollToTop } from '../utils.js'

import { NOTES_DIR_KEY, TOC_MD, REPO_NAME } from '../constants.js'

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
  initSwiper()
})
watch(
  () => vpData.page.value.relativePath,
  () => {
    updateVscodeNoteDir()
    initSwiper()
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

// 重定向检查函数
function checkRedirect() {
  if (typeof window === 'undefined') return false

  const currentPath = window.location.pathname
  // 匹配路径格式：/TNotes.*/notes/四个数字
  const match = currentPath.match(/\/TNotes[^/]+\/notes\/(\d{4})(?:\/.*)?$/)

  if (match) {
    const noteId = match[1]
    const targetNote = allNotesConfig[noteId]

    if (targetNote && targetNote.redirect) {
      const base = vpData.site.value.base
      // 构建目标路径（包含基础路径）
      const targetPath = `${base}${targetNote.redirect}`

      // 避免重定向死循环
      if (currentPath !== targetPath) {
        console.log(`Redirecting from ${currentPath} to ${targetPath}`)

        // 使用完整的页面跳转（强制刷新）
        window.location.href = targetPath
        return true
      }
    }
  }
  return false
}

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
    else {
      checkRedirect()
    }
  }, 50) // 缩短延迟时间
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
      } else {
        checkRedirect()
      }
    }, 30) // 进一步缩短延迟时间
  }
)
// #endregion

// --------------------------------------------------------------
// #region - swiper
// --------------------------------------------------------------
// doc: https://swiperjs.com/demos

// import Swiper from 'swiper'
// import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const swiperInstance = ref(null)

const initSwiper = () => {
  import('swiper').then(({ default: Swiper }) => {
    import('swiper/modules').then(({ Navigation, Pagination }) => {
      swiperInstance.value = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        modules: [Navigation, Pagination],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    })
  })
}

function destroySwiper() {
  // ! unknow error
  if (swiperInstance.value && swiperInstance.value.destroy) {
    try {
      swiperInstance.value.destroy(true, true)
    } catch (error) {
      console.log(error)
    }
  }

  // document.querySelectorAll('.swiper-container').forEach(el => el.remove())
  // swiperInstance.value = null
}

onBeforeUnmount(destroySwiper)
// --------------------------------------------------------------
// #endregion - swiper
// --------------------------------------------------------------
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

.vscode-box {
  width: 1em;
  height: 1em;
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
/* add some custom styles to set Swiper size */
.swiper-container {
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
}

.swiper-container img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* .swiper-container .swiper-pagination-bullet {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #1a1a1a;
    opacity: .2;
    background: rgba(0, 0, 0, 0.2);
} */

.swiper-container .swiper-pagination-bullet:hover {
  opacity: 0.8;
}

.swiper-container .swiper-pagination-bullet-active {
  color: #fff;
  background: var(--vp-c-brand-1);
  opacity: 0.8;
}

.swiper-container .swiper-button-prev:after,
.swiper-container .swiper-button-next:after {
  font-size: 1.5rem;
}

.swiper-container .swiper-button-prev,
.swiper-container .swiper-button-next {
  transition: all 0.3s;
  opacity: 0.5;
}

.swiper-container .swiper-button-prev:hover,
.swiper-container .swiper-button-next:hover {
  transform: scale(1.5);
  opacity: 1;
}

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

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
