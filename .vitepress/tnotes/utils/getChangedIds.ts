import path from 'path'
import { execSync } from 'child_process'

/**
 * 获取 Git 中变更的笔记 ID 集合
 * @returns 变更的笔记 ID 集合
 */
export function getChangedIds(): Set<string> {
  const changedFiles = execSync(
    `git diff --name-only HEAD -- "notes/[0-9][0-9][0-9][0-9]*/README.md"`
    // 根据当前仓库状态和最近一次提交之间的比较
  )
    .toString()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((fp) => fp.replace(/^"|"$/g, '')) // 去掉 Git 输出的双引号
    .map((fp) => fp.split('/').join(path.sep)) // 转换为平台路径

  const changedIds = changedFiles
    .map((fp) => {
      const parts = fp.split(path.sep)
      const dirName = parts.find((p, i) => parts[i - 1] === 'notes')
      return dirName?.slice(0, 4)
    })
    .filter((id): id is string => Boolean(id))

  // 移除日志输出，由调用方决定是否输出
  return new Set(changedIds)
}
