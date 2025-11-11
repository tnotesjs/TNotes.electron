<template>
  <div class="sidebar-toggle-wrapper">
    <!-- 笔记编号显示切换按钮 -->
    <button
      class="toggle-btn"
      @click="$emit('toggle-note-id')"
      :title="showNoteId ? '隐藏笔记编号' : '显示笔记编号'"
    >
      <img
        :src="showNoteId ? icon__number_purple : icon__number_gray"
        class="toggle-icon"
        alt="切换笔记编号"
      />
    </button>

    <!-- 展开/折叠全部按钮 -->
    <button
      class="toggle-btn"
      @click="$emit('toggle-expand')"
      :title="isExpanded ? '全部折叠' : '全部展开'"
    >
      <img :src="icon__fold" class="toggle-icon" alt="切换展开折叠" />
    </button>

    <!-- 聚焦到当前笔记按钮 -->
    <button
      class="toggle-btn"
      @click="$emit('focus-current')"
      title="聚焦到当前笔记（点击切换多个位置）"
    >
      <img :src="icon__focus" class="toggle-icon" alt="聚焦当前笔记" />
    </button>
  </div>
</template>

<script setup lang="ts">
import icon__fold from '/icon__fold.svg'
import icon__number_purple from '/icon__number_purple.svg'
import icon__number_gray from '/icon__number_gray.svg'
import icon__focus from '/icon__focus.svg'

defineProps<{
  isExpanded: boolean
  showNoteId: boolean
}>()

defineEmits<{
  'toggle-expand': []
  'toggle-note-id': []
  'focus-current': []
}>()
</script>

<style scoped>
.sidebar-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 16px;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--vp-c-bg-soft);
}

.toggle-btn:active .toggle-icon {
  transform: scale(0.95);
}

.toggle-icon {
  width: 20px;
  height: 20px;
  display: block;
  transition: transform 0.2s ease;
}

.toggle-btn:hover .toggle-icon {
  transform: scale(1.1);
}
</style>
