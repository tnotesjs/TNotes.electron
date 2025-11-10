import { ref, computed } from 'vue'
import { useData } from 'vitepress'

/**
 * 处理笔记配置的保存和重置逻辑
 */
export function useNoteSave(
  currentNoteId: any,
  isDev: any,
  hasConfigChanges: any,
  titleError: any,
  editableNoteTitle: any,
  originalNoteTitle: any,
  editableNoteStatus: any,
  originalNoteStatus: any,
  editableDiscussionsEnabled: any,
  originalDiscussionsEnabled: any,
  editableDeprecated: any,
  originalDeprecated: any,
  editableDescription: any,
  originalDescription: any,
  allNotesConfig: Record<string, any>,
  updateOriginalValues: () => void
) {
  const vpData = useData()

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
      updateOriginalValues()

      // 更新本地配置（立即反映在页面上）
      if (allNotesConfig[currentNoteId.value]) {
        allNotesConfig[currentNoteId.value].done = editableNoteStatus.value
        allNotesConfig[currentNoteId.value].enableDiscussions =
          editableDiscussionsEnabled.value
        allNotesConfig[currentNoteId.value].deprecated =
          editableDeprecated.value
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
        '❌ 保存失败: ' +
          (error instanceof Error ? error.message : String(error))
      )
    } finally {
      if (!titleChanged) {
        isSaving.value = false
        savingMessage.value = ''
      }
    }
  }

  return {
    isSaving,
    showSuccessToast,
    savingMessage,
    saveButtonText,
    saveNoteConfig,
  }
}
