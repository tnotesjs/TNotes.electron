import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { getChangedIds } from './get_changed_ids.js'

const execAsync = promisify(exec)
const changedIds = getChangedIds()

/**
 * 从 README.md 文件路径解析笔记 ID
 * @param {string} filePath
 * @returns {string | null} 笔记 ID
 */
function parseNoteId(filePath) {
  // 取 notes 下第一层目录名
  const parts = filePath.split(path.sep)
  const notesIndex = parts.findIndex((part) => part === 'notes')
  if (notesIndex >= 0 && parts.length > notesIndex + 1) {
    const dirName = parts[notesIndex + 1]
    const match = dirName.match(/^(\d{4})\./) // 匹配开头的 4 个数字
    if (match) return match[1]
  }
  return null
}

/**
 * 异步获取 Git 时间戳（优化版：使用笔记 ID 缓存）
 * @param {string} filePath README.md 文件绝对路径
 * @returns {Promise<{created_at: number, updated_at: number}>} || null
 */
export async function getGitTimestamps(filePath, noteId) {
  noteId = noteId || parseNoteId(filePath)
  if (!noteId || !changedIds.has(noteId)) return

  const now = Date.now()
  let created_at = now
  let updated_at = now

  try {
    // 首次提交时间
    const { stdout: createdStdout } = await execAsync(
      `git log --diff-filter=A --format=%ct "${filePath}"`
    )
    const createdTs = createdStdout.toString().trim()
    if (createdTs) created_at = parseInt(createdTs, 10) * 1000

    // 最近提交时间
    const { stdout: updatedStdout } = await execAsync(
      `git log -1 --format=%ct "${filePath}"`
    )
    const updatedTs = updatedStdout.toString().trim()
    if (updatedTs) updated_at = parseInt(updatedTs, 10) * 1000
  } catch {
    // 文件可能未在 Git 中提交过，使用当前时间
  }

  const result = { created_at, updated_at }

  console.log(`Git 时间戳: ${filePath}`, result)
  return result
}
