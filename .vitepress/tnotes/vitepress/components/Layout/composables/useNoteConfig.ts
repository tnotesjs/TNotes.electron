import { ref, computed, watch } from 'vue'
import { useData } from 'vitepress'

/**
 * 管理笔记配置状态
 * 包括可编辑字段、原始值、变更检测等
 */
export function useNoteConfig(
  currentNoteId: any,
  currentNoteConfig: any,
  currentNoteTitle: any,
  timeModalOpen: any
) {
  const vpData = useData()

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

  // 重置笔记配置
  function resetNoteConfig() {
    editableNoteStatus.value = originalNoteStatus.value
    editableDiscussionsEnabled.value = originalDiscussionsEnabled.value
    editableDeprecated.value = originalDeprecated.value
    editableNoteTitle.value = originalNoteTitle.value
    editableDescription.value = originalDescription.value
    titleError.value = ''
  }

  // 更新原始值（保存成功后调用）
  function updateOriginalValues() {
    originalNoteStatus.value = editableNoteStatus.value
    originalDiscussionsEnabled.value = editableDiscussionsEnabled.value
    originalDeprecated.value = editableDeprecated.value
    originalNoteTitle.value = editableNoteTitle.value.trim()
    originalDescription.value = editableDescription.value.trim()
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

  return {
    // 可编辑字段
    editableNoteStatus,
    editableDiscussionsEnabled,
    editableDeprecated,
    editableNoteTitle,
    editableDescription,

    // 原始值
    originalNoteStatus,
    originalDiscussionsEnabled,
    originalDeprecated,
    originalNoteTitle,
    originalDescription,

    // 验证
    titleError,

    // 计算属性
    hasConfigChanges,

    // 方法
    initEditableFields,
    resetNoteConfig,
    updateOriginalValues,
  }
}
