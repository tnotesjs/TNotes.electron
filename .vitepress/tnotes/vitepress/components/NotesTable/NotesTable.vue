<template>
  <div v-if="errorMessage" :class="$style.error">
    {{ errorMessage }}
  </div>

  <div v-else-if="notFoundIds.length > 0" :class="$style.warning">
    以下笔记 ID 未找到配置: {{ notFoundIds.join(', ') }}
  </div>

  <table v-if="tableData.length > 0" :class="$style.notesTable">
    <thead>
      <tr>
        <th>笔记</th>
        <th>简介</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="note in tableData" :key="note.id">
        <td>
          <a :href="note.url" :class="$style.noteLink">
            <span :class="$style.noteId">{{ note.id }}.</span>
            <span>{{ note.title }}</span>
          </a>
        </td>
        <td>
          <span
            :class="[$style.description, { [$style.empty]: !note.description }]"
          >
            {{ note.description || '暂无简介' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
// @ts-expect-error - VitePress data loader exports data at runtime
import { data as allNotesConfig } from '../notesConfig.data.ts'

interface Props {
  ids: string[]
}

const props = defineProps<Props>()
const vpData = useData()

// 错误消息
const errorMessage = computed(() => {
  if (!props.ids || !Array.isArray(props.ids)) {
    return '错误: ids 属性必须是一个数组'
  }
  if (props.ids.length === 0) {
    return '错误: ids 数组不能为空'
  }
  return null
})

// 未找到的笔记 ID
const notFoundIds = computed(() => {
  if (errorMessage.value) return []

  return props.ids.filter((id) => !allNotesConfig[id])
})

// 表格数据
const tableData = computed(() => {
  if (errorMessage.value) return []

  return props.ids
    .filter((id) => allNotesConfig[id]) // 只保留存在的笔记
    .map((id) => {
      const config = allNotesConfig[id]
      const base = vpData.site.value.base || '/'

      // 从 redirect 路径中提取笔记标题
      // redirect 格式: notes/0001. 标题/README
      let title = id
      if (config.redirect) {
        const match = config.redirect.match(/notes\/\d{4}\.\s*([^/]+)\/README/)
        if (match) {
          title = match[1]
        }
      }

      return {
        id,
        title,
        description: config.description || '',
        url: config.redirect ? `${base}${config.redirect}` : '#',
      }
    })
})
</script>

<style module src="./NotesTable.module.scss"></style>
