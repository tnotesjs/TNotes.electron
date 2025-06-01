import fs from 'node:fs'
import { resolve } from 'node:path'
import { ROOT_DIR_PATH } from '../constants.js'
import { execSync } from 'node:child_process'

const getMarkdownFiles = (dir) => {
  const items = fs.readdirSync(dir)

  const files = []

  for (const item of items) {
    if (item.match(/^\d{4}.\s/)) {
      const path = resolve(dir, item, 'README.md')
      files.push(path)
    }
  }

  return files
}

const getGitLastCommitTime = (filePath) => {
  try {
    // 检查文件是否被跟踪
    execSync(`git ls-files --error-unmatch -- "${filePath}"`, { stdio: 'pipe' })

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

// 获取所有 README.md 文件的最后更新时间
export const getNotesLastUpdatedMap = () => {
  const lastUpdatedMap = {}
  const markdownFiles = getMarkdownFiles(resolve(ROOT_DIR_PATH, './notes'))

  for (const file of markdownFiles) {
    const gitTime = getGitLastCommitTime(file)
    const stat = fs.statSync(file)
    const relativePath = file.replace(ROOT_DIR_PATH, '').replace('.md', '')
    lastUpdatedMap[relativePath] = gitTime || Math.floor(stat.mtimeMs)
  }

  // console.log('lastUpdatedMap:', lastUpdatedMap)
  return lastUpdatedMap
}
