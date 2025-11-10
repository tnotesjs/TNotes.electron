<template>
  <div
    :class="$style.timeModalContent"
    role="group"
    :aria-label="isHomeReadme ? '知识库提交信息' : '笔记提交信息'"
  >
    <!-- 笔记编号（仅笔记页显示） -->
    <div
      :class="$style.timeLine"
      v-if="!isHomeReadme && currentNoteId"
      title="笔记编号"
    >
      <div :class="$style.timeLabel">
        <strong>🔢 笔记编号</strong>
      </div>
      <div :class="$style.timeValue">{{ currentNoteId }}</div>
    </div>

    <!-- 笔记标题（仅笔记页显示） -->
    <div
      :class="$style.timeLine"
      v-if="!isHomeReadme && currentNoteId"
      title="笔记标题"
    >
      <div :class="$style.timeLabel">
        <strong>📝 笔记标题</strong>
      </div>
      <div :class="$style.timeValue">
        <input
          v-model="editableNoteTitle"
          type="text"
          :class="[$style.titleInput, { [$style.error]: titleError }]"
          :disabled="!isDev"
          @input="onTitleInput"
          @blur="onTitleBlur"
          placeholder="请输入笔记标题"
        />
        <div v-if="titleError" :class="$style.errorMessage">
          {{ titleError }}
        </div>
      </div>
    </div>

    <!-- 笔记简介（仅笔记页显示） -->
    <div
      :class="$style.timeLine"
      v-if="!isHomeReadme && currentNoteId"
      title="笔记简介"
    >
      <div :class="$style.timeLabel">
        <strong>📄 笔记简介</strong>
      </div>
      <div :class="$style.timeValue">
        <textarea
          v-model="editableDescription"
          :class="$style.descriptionInput"
          :disabled="!isDev"
          @input="onDescriptionInput"
          placeholder="请输入笔记的一句话简介（可选）"
          rows="2"
        />
      </div>
    </div>

    <!-- 笔记状态（仅笔记页显示且非开发环境只读） -->
    <div
      :class="$style.timeLine"
      v-if="!isHomeReadme && currentNoteId"
      title="笔记状态"
    >
      <div :class="$style.timeLabel">
        <strong>📝 完成状态</strong>
      </div>
      <div :class="$style.timeValue">
        <select
          v-model="editableNoteStatus"
          :class="$style.statusSelect"
          :disabled="!isDev"
          @change="onConfigChange"
        >
          <option :value="true">✅ 已完成</option>
          <option :value="false">⏰ 待处理</option>
        </select>
      </div>
    </div>

    <!-- 评论状态（仅笔记页显示且非开发环境只读） -->
    <div
      :class="$style.timeLine"
      v-if="!isHomeReadme && currentNoteId"
      title="评论状态"
    >
      <div :class="$style.timeLabel">
        <strong>🫧 评论状态</strong>
      </div>
      <div :class="$style.timeValue">
        <select
          v-model="editableDiscussionsEnabled"
          :class="$style.statusSelect"
          :disabled="!isDev"
          @change="onConfigChange"
        >
          <option :value="true">✅ 开启</option>
          <option :value="false">❌ 关闭</option>
        </select>
      </div>
    </div>

    <!-- 弃用状态（仅笔记页显示且非开发环境只读） -->
    <div
      :class="$style.timeLine"
      v-if="!isHomeReadme && currentNoteId"
      title="弃用状态"
    >
      <div :class="$style.timeLabel">
        <strong>🗑 弃用状态</strong>
      </div>
      <div :class="$style.timeValue">
        <select
          v-model="editableDeprecated"
          :class="$style.statusSelect"
          :disabled="!isDev"
          @change="onConfigChange"
        >
          <option :value="false">✅ 未弃用</option>
          <option :value="true">❌ 已弃用</option>
        </select>
      </div>
    </div>

    <!-- 首次提交时间 -->
    <div :class="$style.timeLine" title="首次提交时间">
      <div :class="$style.timeLabel"><strong>⌛️ 首次提交</strong></div>
      <div :class="$style.timeValue">
        {{ formatDate(modalCreatedAt) }}
      </div>
    </div>

    <!-- 最近提交时间 -->
    <div :class="$style.timeLine" title="最近提交时间">
      <div :class="$style.timeLabel"><strong>⌛️ 最近提交</strong></div>
      <div :class="$style.timeValue">
        {{ formatDate(modalUpdatedAt) }}
      </div>
    </div>

    <!-- GitHub 链接 -->
    <div
      :class="$style.timeLine"
      v-if="modalGithubUrl"
      :title="
        isHomeReadme ? '在 GitHub 中打开知识库' : '在 GitHub 中打开当前笔记'
      "
    >
      <div :class="$style.timeLabel">
        <strong>🔗 GitHub 链接</strong>
      </div>
      <div :class="$style.timeValue">
        <a
          :href="modalGithubUrl"
          target="_blank"
          rel="noopener"
          :class="$style.githubLink"
        >
          {{
            isHomeReadme ? '在 GitHub 中打开知识库' : '在 GitHub 中打开当前笔记'
          }}
        </a>
      </div>
    </div>

    <!-- 完成进度（仅首页显示） -->
    <div
      :class="$style.timeLine"
      v-if="isHomeReadme && completionPercentage !== null"
      title="笔记完成进度"
    >
      <div :class="$style.timeLabel">
        <strong>📊 完成进度</strong>
      </div>
      <div :class="$style.timeValue">
        {{ completionPercentage }}% ({{ doneNotesLen }} / {{ totalNotesLen }})
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '../utils'

const props = defineProps<{
  isHomeReadme: boolean
  currentNoteId: string | null
  isDev: boolean
  editableNoteTitle: string
  editableDescription: string
  editableNoteStatus: boolean
  editableDiscussionsEnabled: boolean
  editableDeprecated: boolean
  titleError: string
  modalCreatedAt: number | undefined
  modalUpdatedAt: number | undefined
  modalGithubUrl: string
  completionPercentage: number | null
  doneNotesLen: number
  totalNotesLen: number
}>()

const emit = defineEmits<{
  'update:editableNoteTitle': [value: string]
  'update:editableDescription': [value: string]
  'update:editableNoteStatus': [value: boolean]
  'update:editableDiscussionsEnabled': [value: boolean]
  'update:editableDeprecated': [value: boolean]
  'update:titleError': [value: string]
  titleInput: []
  titleBlur: []
  descriptionInput: []
  configChange: []
}>()

const editableNoteTitle = computed({
  get: () => props.editableNoteTitle,
  set: (value) => emit('update:editableNoteTitle', value),
})

const editableDescription = computed({
  get: () => props.editableDescription,
  set: (value) => emit('update:editableDescription', value),
})

const editableNoteStatus = computed({
  get: () => props.editableNoteStatus,
  set: (value) => emit('update:editableNoteStatus', value),
})

const editableDiscussionsEnabled = computed({
  get: () => props.editableDiscussionsEnabled,
  set: (value) => emit('update:editableDiscussionsEnabled', value),
})

const editableDeprecated = computed({
  get: () => props.editableDeprecated,
  set: (value) => emit('update:editableDeprecated', value),
})

function onTitleInput() {
  emit('titleInput')
}

function onTitleBlur() {
  emit('titleBlur')
}

function onDescriptionInput() {
  emit('descriptionInput')
}

function onConfigChange() {
  emit('configChange')
}
</script>

<style module src="./Layout.module.scss"></style>
