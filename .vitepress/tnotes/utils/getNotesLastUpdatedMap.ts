import fs from 'node:fs'
import { resolve } from 'node:path'
import { ROOT_DIR_PATH } from '../constants'
import { execSync } from 'node:child_process'
import type { NotesLastUpdatedMap } from '../types'

/**
 * 获取 Markdown 文件列表
 * @param dir - 目录路径
 * @returns 文件路径列表
 */
const getMarkdownFiles = (dir: string): string[] => {
  const items = fs.readdirSync(dir)
  const files: string[] = []

  for (const item of items) {
    if (item.match(/^\d{4}.\s/)) {
      const filePath = resolve(dir, item, 'README.md')
      files.push(filePath)
    }
  }

  return files
}

/**
 * 获取文件的 Git 最后提交时间
 * @param filePath - 文件路径
 * @returns 时间戳（毫秒）或 0
 */
const getGitLastCommitTime = (filePath: string): number => {
  try {
    // 检查文件是否被跟踪
    execSync(`git ls-files --error-unmatch -- "${filePath}"`, {
      stdio: 'pipe',
    })

    // 获取提交时间
    const time = execSync(`git log -1 --pretty=format:%ct -- "${filePath}"`)
      .toString()
      .trim()

    return time ? parseInt(time) * 1000 : 0
  } catch (e) {
    console.error(`[${filePath}] 未跟踪或无提交记录`)
    return 0
  }
}

/**
 * 获取所有 README.md 文件的最后更新时间
 * @returns 笔记更新时间映射表
 */
export const getNotesLastUpdatedMap = (): NotesLastUpdatedMap => {
  const lastUpdatedMap: NotesLastUpdatedMap = {}
  const markdownFiles = getMarkdownFiles(resolve(ROOT_DIR_PATH, './notes'))

  for (const file of markdownFiles) {
    const gitTime = getGitLastCommitTime(file)
    const stat = fs.statSync(file)
    const relativePath = file.replace(ROOT_DIR_PATH, '').replace('.md', '')
    lastUpdatedMap[relativePath] = gitTime || Math.floor(stat.mtimeMs)
  }

  return lastUpdatedMap
}
