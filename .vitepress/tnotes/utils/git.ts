/**
 * .vitepress/tnotes/utils/git.ts
 *
 * Git 相关工具函数
 */
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import type { GitTimestamp } from '../types'

const execAsync = promisify(exec)

/**
 * 从 README.md 文件路径解析笔记 ID
 * @param filePath - 文件路径
 * @returns 笔记 ID 或 null
 */
function parseNoteId(filePath: string): string | null {
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
 * 异步获取 Git 时间戳
 * @param filePath - README.md 文件绝对路径
 * @param noteId - 笔记 ID（可选，会自动解析）
 * @param changedIds - 已更改的 ID 集合（可选）
 * @returns Git 时间戳对象或 undefined
 */
export async function getGitTimestamps(
  filePath: string,
  noteId?: string,
  changedIds?: Set<string>
): Promise<GitTimestamp | undefined> {
  const id = noteId || parseNoteId(filePath)
  if (changedIds && id && !changedIds.has(id)) return

  const now = Date.now()
  let created = now
  let updated = now

  try {
    // 首次提交时间
    const { stdout: createdStdout } = await execAsync(
      `git log --diff-filter=A --format=%ct "${filePath}"`
    )
    const createdTs = createdStdout.toString().trim()
    if (createdTs) created = parseInt(createdTs, 10) * 1000

    // 上一次 commit 的时间
    // const { stdout: updatedStdout } = await execAsync(
    //   `git log -1 --format=%ct "${filePath}"`
    // )
    // const updatedTs = updatedStdout.toString().trim()
    // if (updatedTs) updated = parseInt(updatedTs, 10) * 1000
  } catch {
    // 文件可能未在 Git 中提交过，使用当前时间
  }

  const result: GitTimestamp = { created, updated }

  console.log(`Git 时间戳: ${filePath}`, result)
  return result
}
