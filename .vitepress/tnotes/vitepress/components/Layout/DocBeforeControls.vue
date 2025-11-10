<template>
  <div :class="$style.docBeforeContainer">
    <div :class="$style.leftArea">
      <div
        :class="[$style.toggleSidebarBox, $style.pcOnly]"
        v-show="!isFullContentMode"
      >
        <ToggleSidebar />
      </div>
      <div :class="[$style.vscodeBox, $style.pcOnly]" v-show="vscodeNotesDir">
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
      <div :class="[$style.githubRepoBox, $style.pcOnly]" v-show="isHomeReadme">
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
          @click="$emit('open-time-modal')"
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
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import ToggleSidebar from './ToggleSidebar.vue'
import ToggleFullContent from './ToggleFullContent.vue'

import icon__github from '/icon__github.svg'
import icon__vscode from '/icon__vscode.svg'
import icon__fold from '/icon__fold.svg'

const props = defineProps<{
  isFullContentMode: boolean
  vscodeNotesDir: string
  isHomeReadme: boolean
  currentNoteId: string | null
  created_at: string | undefined
  updated_at: string | undefined
  homeReadmeCreatedAt: string | undefined
  homeReadmeUpdatedAt: string | undefined
  timeModalOpen: boolean
  allCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'open-time-modal'): void
  (e: 'toggle-all-collapse'): void
}>()

const vpData = useData()

function toggleAllCollapse() {
  emit('toggle-all-collapse')
}
</script>

<style module src="./Layout.module.scss"></style>
