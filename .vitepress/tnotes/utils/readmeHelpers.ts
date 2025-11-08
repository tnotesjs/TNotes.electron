/**
 * .vitepress/tnotes/utils/readmeHelpers.ts
 *
 * README 更新的公共辅助函数
 */
import type { NoteInfo } from '../types'

/**
 * 笔记行匹配正则表达式
 * 格式: - [x] [0001. 笔记标题] 或   - [x] [0001. 笔记标题] (支持缩进)
 * 要求: 笔记名称必须是 4 个数字开头，后面紧跟着一个小数点和一个空格，随后跟着任意标题内容
 */
export const NOTE_LINE_REGEX = /^( *)- \[.\] \[(\d{4}\. .+?)\]/

/**
 * 笔记链接解析结果
 */
export interface ParsedNoteLine {
  isMatch: boolean // 是否匹配到笔记行
  noteId: string | null // 笔记 ID (如 "0001")
}

/**
 * 解析 home readme 笔记链接行，提取笔记 ID
 * @param line - 要解析的行
 * @returns 解析结果 { isMatch, noteId }
 */
export function parseNoteLine(line: string): ParsedNoteLine {
  // 匹配笔记链接格式: - [x] [0001. xxx](...)
  // 或简单格式: - [ ] [0001. xxx]
  // 支持缩进: "  - [x] [0001. xxx]"
  const noteMatch = line.match(NOTE_LINE_REGEX)

  if (!noteMatch) {
    return {
      isMatch: false,
      noteId: null,
    }
  }

  const [, , text] = noteMatch // 第一个捕获组是缩进，第二个是文本

  // 提取笔记 ID
  const idMatch = text.match(/^(\d{4})\./)
  const noteId = idMatch ? idMatch[1] : null

  return {
    isMatch: true,
    noteId,
  }
}

/**
 * 构建 home readme 笔记链接
 * @param note - 笔记信息
 * @param repoOwner - 仓库所有者
 * @param repoName - 仓库名称
 * @returns 完整的 GitHub URL
 */
export function buildNoteLink(
  note: NoteInfo,
  repoOwner: string,
  repoName: string
): string {
  const encodedDirName = encodeURIComponent(note.dirName)
  return `https://github.com/${repoOwner}/${repoName}/tree/main/notes/${encodedDirName}/README.md`
}

/**
 * 根据笔记配置更新状态
 * @param note - 笔记信息
 * @returns { status, deprecatedMark } 状态字符和弃用标记
 */
export function updateNoteStatus(note: NoteInfo): {
  status: string
  deprecatedMark: string
} {
  let status = ' ' // 默认未完成
  let deprecatedMark = '' // 弃用标记

  if (note.config) {
    if (note.config.deprecated) {
      status = ' ' // 弃用的笔记，复选框不勾选
      deprecatedMark = ' ❌' // 添加弃用标记
    } else if (note.config.done) {
      status = 'x' // 完成的笔记，勾选复选框
    }
  }

  return { status, deprecatedMark }
}

/**
 * 构建完整的笔记行
 * @param note - 笔记信息
 * @param repoOwner - 仓库所有者
 * @param repoName - 仓库名称
 * @returns 完整的 Markdown 行
 */
export function buildNoteLineMarkdown(
  note: NoteInfo,
  repoOwner: string,
  repoName: string
): string {
  const url = buildNoteLink(note, repoOwner, repoName)
  const { status, deprecatedMark } = updateNoteStatus(note)
  return `- [${status}] [${note.dirName}](${url})${deprecatedMark}`
}

/**
 * 检查是否是笔记列表行
 * @param line - 要检查的行
 * @returns 是否是笔记行
 */
export function isNoteLine(line: string): boolean {
  return NOTE_LINE_REGEX.test(line)
}

/**
 * 合并 home readme 连续空行
 * @param lines - 原始行数组
 * @returns 合并后的行数组
 */
export function mergeConsecutiveEmptyLines(lines: string[]): string[] {
  const result: string[] = []
  let previousLineIsEmpty = false

  for (const line of lines) {
    const isCurrentLineEmpty = line === ''

    if (isCurrentLineEmpty) {
      // 只有前一行不是空行时才保留当前空行
      if (!previousLineIsEmpty) {
        result.push(line)
        previousLineIsEmpty = true
      }
    } else {
      result.push(line)
      previousLineIsEmpty = false
    }
  }

  return result
}

/**
 * 移除相邻 home readme 笔记之间的空行
 * @param lines - 行数组
 * @returns 处理后的行数组
 */
export function removeEmptyLinesBetweenNotes(lines: string[]): string[] {
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]
    const prevLine = i > 0 ? lines[i - 1] : null
    const nextLine = i < lines.length - 1 ? lines[i + 1] : null

    // 如果当前行是空行,且前后都是笔记,则跳过这个空行
    if (currentLine === '' && prevLine && nextLine) {
      const isPrevLineNote = isNoteLine(prevLine)
      const isNextLineNote = isNoteLine(nextLine)

      if (isPrevLineNote && isNextLineNote) {
        continue // 跳过笔记之间的空行
      }
    }

    result.push(currentLine)
  }

  return result
}

/**
 * 处理 README 中的空行
 * 1. 合并连续空行
 * 2. 移除相邻笔记之间的空行
 * @param lines - 原始行数组
 * @returns 处理后的行数组
 */
export function processEmptyLines(lines: string[]): string[] {
  const stepOne = mergeConsecutiveEmptyLines(lines)
  const stepTwo = removeEmptyLinesBetweenNotes(stepOne)
  return stepTwo
}
