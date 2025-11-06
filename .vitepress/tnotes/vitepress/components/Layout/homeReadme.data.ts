// .vitepress/components/Layout/homeReadme.data.ts
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

interface ReadmeData {
  fileContent: string
  doneNotesID: string[]
  doneNotesLen: number
  totalNotesLen: number
  created_at?: number
  updated_at?: number
}

export default {
  watch: ['../../../../../README.md', '../../../../../notes'],
  load(watchedFiles: string[]): ReadmeData {
    let readmeData: ReadmeData = {
      fileContent: '',
      doneNotesID: [],
      doneNotesLen: 0,
      totalNotesLen: 0,
    }

    watchedFiles.forEach((file) => {
      if (file.endsWith('README.md')) {
        // console.log('file:', file) // => file: README.md

        const fileContent = fs.readFileSync(file, 'utf-8')
        const doneNotesID = getDoneNotesID(fileContent)
        const doneNotesLen = doneNotesID.length

        // 获取 git 仓库的时间戳
        const timestamps = getGitTimestamps()

        // 计算总笔记数
        const notesDir = path.join(path.dirname(file), 'notes')
        const totalNotesLen = getTotalNotesCount(notesDir)

        readmeData = {
          fileContent,
          doneNotesID,
          doneNotesLen,
          totalNotesLen,
          ...timestamps,
        }
      }
    })
    return readmeData
  },
}

/**
 * 获取 notes 目录下的笔记总数
 * @param notesDir notes 目录路径
 * @returns 笔记总数
 */
function getTotalNotesCount(notesDir: string): number {
  try {
    if (!fs.existsSync(notesDir)) return 0

    const dirs = fs.readdirSync(notesDir, { withFileTypes: true })
    // 统计符合格式 "0001. xxx" 的目录
    return dirs.filter(
      (dirent) => dirent.isDirectory() && /^\d{4}\./.test(dirent.name)
    ).length
  } catch (error) {
    console.error(`获取笔记总数失败:`, error)
    return 0
  }
}

/**
 * 获取 git 仓库的时间戳
 * @returns 包含 created_at 和 updated_at 的对象
 */
function getGitTimestamps(): {
  created_at?: number
  updated_at?: number
} {
  const now = Date.now()
  let created_at = now
  let updated_at = now

  try {
    // 仓库的首次提交时间（最早的提交）
    // 先获取所有提交，然后取第一行
    const createdStdout = execSync(`git log --reverse --format=%ct`, {
      encoding: 'utf-8',
    })
    const createdTs = createdStdout.toString().trim().split('\n')[0]
    if (createdTs) {
      created_at = parseInt(createdTs, 10) * 1000
    }

    // 仓库的最近一次提交时间
    const updatedStdout = execSync(`git log -1 --format=%ct`, {
      encoding: 'utf-8',
    })
    const updatedTs = updatedStdout.toString().trim()
    if (updatedTs) {
      updated_at = parseInt(updatedTs, 10) * 1000
    }

    return { created_at, updated_at }
  } catch (error) {
    console.error(`获取 git 仓库时间戳失败:`, error)
    return { created_at, updated_at }
  }
}

/**
 * 返回已完成的笔记的 ID 列表
 * @param fileContent 文件内容
 * @returns 已完成的笔记的 ID 列表
 */
function getDoneNotesID(fileContent: string): string[] {
  const matches = fileContent.match(/- \[x\]\s\[(\d{4})\./g)
  return matches
    ? [...new Set(matches.map((match) => match.slice(-5, -1)))]
    : []
}
