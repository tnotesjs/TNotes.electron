/**
 * .vitepress/tnotes/utils/validators.ts
 *
 * 验证工具函数
 */

/**
 * Windows 和 macOS 都不允许的文件名字符
 * Windows: < > : " / \ | ? *
 * macOS: : (冒号会被转换为斜杠)
 *
 * 为了兼容性,我们禁止以下字符:
 * - < > : " / \ | ? *
 * - 控制字符 (0x00-0x1F)
 */
const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1F]/

/**
 * Windows 保留文件名
 */
const WINDOWS_RESERVED_NAMES = new Set([
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

/**
 * 验证标题是否为合法的文件夹名称
 * @param title - 笔记标题
 * @returns 验证结果 { valid: boolean, error?: string }
 */
export function validateNoteTitle(title: string): {
  valid: boolean
  error?: string
} {
  // 检查是否为空
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '标题不能为空' }
  }

  const trimmedTitle = title.trim()

  // 检查长度 (Windows 路径限制 260 字符,留足够空间)
  if (trimmedTitle.length > 200) {
    return { valid: false, error: '标题过长(最多200个字符)' }
  }

  // 检查是否包含非法字符
  if (INVALID_FILENAME_CHARS.test(trimmedTitle)) {
    return {
      valid: false,
      error: '标题包含非法字符(不允许: < > : " / \\ | ? *)',
    }
  }

  // 检查是否以点或空格开头/结尾 (Windows 限制)
  if (/^[.\s]|[.\s]$/.test(trimmedTitle)) {
    return {
      valid: false,
      error: '标题不能以点或空格开头/结尾',
    }
  }

  // 检查 Windows 保留名称
  const upperTitle = trimmedTitle.toUpperCase()
  if (WINDOWS_RESERVED_NAMES.has(upperTitle)) {
    return {
      valid: false,
      error: `"${trimmedTitle}" 是 Windows 系统保留名称`,
    }
  }

  // 检查是否为 Windows 保留名称加扩展名 (例如 CON.txt)
  const baseName = trimmedTitle.split('.')[0].toUpperCase()
  if (WINDOWS_RESERVED_NAMES.has(baseName)) {
    return {
      valid: false,
      error: `"${trimmedTitle}" 包含 Windows 系统保留名称`,
    }
  }

  return { valid: true }
}

/**
 * 清理标题,移除或替换非法字符
 * @param title - 原始标题
 * @returns 清理后的标题
 */
export function sanitizeNoteTitle(title: string): string {
  return (
    title
      .trim()
      // 替换非法字符为下划线
      .replace(INVALID_FILENAME_CHARS, '_')
      // 移除开头的点和空格
      .replace(/^[.\s]+/, '')
      // 移除结尾的点和空格
      .replace(/[.\s]+$/, '')
      // 限制长度
      .slice(0, 200)
  )
}
