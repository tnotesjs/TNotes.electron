/**
 * 笔记标题验证
 */
export function useNoteValidation() {
  // 标题验证函数
  function validateTitle(title: string): string | null {
    // 非法字符正则
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/
    const windowsReservedNames = new Set([
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9',
    ])

    if (!title || title.trim().length === 0) {
      return '标题不能为空'
    }

    const trimmedTitle = title.trim()

    if (trimmedTitle.length > 200) {
      return '标题过长(最多200个字符)'
    }

    if (invalidChars.test(trimmedTitle)) {
      return '标题包含非法字符(不允许: < > : " / \\ | ? *)'
    }

    if (/^[.\s]|[.\s]$/.test(trimmedTitle)) {
      return '标题不能以点或空格开头/结尾'
    }

    const upperTitle = trimmedTitle.toUpperCase()
    if (windowsReservedNames.has(upperTitle)) {
      return `"${trimmedTitle}" 是 Windows 系统保留名称`
    }

    const baseName = trimmedTitle.split('.')[0].toUpperCase()
    if (windowsReservedNames.has(baseName)) {
      return `"${trimmedTitle}" 包含 Windows 系统保留名称`
    }

    return null
  }

  // 标题输入事件处理器
  function onTitleInput(editableNoteTitle: any, titleError: any) {
    const error = validateTitle(editableNoteTitle.value)
    titleError.value = error || ''
  }

  // 标题失焦事件处理器
  function onTitleBlur(editableNoteTitle: any, titleError: any) {
    // 去除首尾空格
    editableNoteTitle.value = editableNoteTitle.value.trim()
    onTitleInput(editableNoteTitle, titleError)
  }

  return {
    validateTitle,
    onTitleInput,
    onTitleBlur,
  }
}
