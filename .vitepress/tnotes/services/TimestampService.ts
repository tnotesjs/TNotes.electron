/**
 * .vitepress/tnotes/services/TimestampService.ts
 *
 * 时间戳服务 - 管理笔记的创建时间和更新时间
 */
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { logger } from '../utils/logger'
import { NOTES_DIR_PATH } from '../config/constants'
import type { NoteConfig } from '../types'

/**
 * 时间戳服务类
 */
export class TimestampService {
  /**
   * 从 git 获取文件的创建时间和最后修改时间
   * @param noteDirPath - 笔记目录路径
   * @returns 时间戳对象，包含 created_at 和 updated_at
   */
  private getGitTimestamps(noteDirPath: string): {
    created_at: number
    updated_at: number
  } | null {
    try {
      const readmePath = path.join(noteDirPath, 'README.md')

      // 获取 README.md 的首次提交时间（创建时间）
      const createdAtCmd = `git log --diff-filter=A --follow --format=%ct -- "${readmePath}" | tail -1`
      const createdAtOutput = execSync(createdAtCmd, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim()

      // 获取 README.md 的最后修改时间（只看 README.md，忽略 .tnotes.json）
      const updatedAtCmd = `git log -1 --format=%ct -- "${readmePath}"`
      const updatedAtOutput = execSync(updatedAtCmd, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim()

      if (!createdAtOutput || !updatedAtOutput) {
        return null
      }

      return {
        created_at: parseInt(createdAtOutput) * 1000, // 转换为毫秒
        updated_at: parseInt(updatedAtOutput) * 1000,
      }
    } catch (error) {
      // git 命令失败（可能是新文件未提交）
      return null
    }
  }

  /**
   * 修复单个笔记的时间戳
   * @param noteDir - 笔记目录名
   * @param forceUpdate - 是否强制更新（忽略现有值）
   * @returns 是否进行了修复
   */
  private fixNoteTimestamps(
    noteDir: string,
    forceUpdate: boolean = false
  ): boolean {
    const configPath = path.join(NOTES_DIR_PATH, noteDir, '.tnotes.json')

    if (!fs.existsSync(configPath)) {
      return false
    }

    try {
      // 读取配置
      const configContent = fs.readFileSync(configPath, 'utf-8')
      const config: NoteConfig = JSON.parse(configContent)

      // 获取 git 时间戳
      const noteDirPath = path.join(NOTES_DIR_PATH, noteDir)
      const timestamps = this.getGitTimestamps(noteDirPath)

      if (!timestamps) {
        return false
      }

      let modified = false

      // 修复 created_at（设置为首次提交时间）
      if (
        forceUpdate ||
        !config.created_at ||
        config.created_at !== timestamps.created_at
      ) {
        config.created_at = timestamps.created_at
        modified = true
      }

      // 修复 updated_at
      if (forceUpdate) {
        // 强制更新：直接使用 git 时间戳
        if (config.updated_at !== timestamps.updated_at) {
          config.updated_at = timestamps.updated_at
          modified = true
        }
      } else {
        // 常规更新：只在 git 时间戳更新时更新，避免覆盖用户手动修改
        if (!config.updated_at) {
          // 如果没有 updated_at，初始化为 git 时间戳
          config.updated_at = timestamps.updated_at
          modified = true
        } else if (timestamps.updated_at > config.updated_at) {
          // 如果 git 显示有更新（README.md 被修改），才更新时间戳
          config.updated_at = timestamps.updated_at
          modified = true
        }
        // 如果 git 时间戳 <= config 时间戳，说明没有新的提交，保持原值
      }

      if (modified) {
        // 保持字段顺序写回文件
        const lines: string[] = ['{']
        const keys = Object.keys(config)
        keys.forEach((key, index) => {
          const value = (config as any)[key]
          const jsonValue = JSON.stringify(value)
          const comma = index < keys.length - 1 ? ',' : ''
          lines.push(`  "${key}": ${jsonValue}${comma}`)
        })
        lines.push('}')

        fs.writeFileSync(configPath, lines.join('\n') + '\n', 'utf-8')
        return true
      }

      return false
    } catch (error) {
      logger.error(`修复时间戳失败: ${noteDir}`, error)
      return false
    }
  }

  /**
   * 修复所有笔记的时间戳
   * @param forceUpdate - 是否强制更新（忽略现有值，用于修复历史错误数据）
   * @returns 修复统计信息
   */
  async fixAllTimestamps(forceUpdate: boolean = false): Promise<{
    fixed: number
    skipped: number
    total: number
  }> {
    if (forceUpdate) {
      logger.info('正在强制修复笔记时间戳（使用 git 真实时间）...')
    } else {
      logger.info('正在修复笔记时间戳...')
    }

    if (!fs.existsSync(NOTES_DIR_PATH)) {
      logger.error('notes 目录不存在')
      return { fixed: 0, skipped: 0, total: 0 }
    }

    const noteDirs = fs
      .readdirSync(NOTES_DIR_PATH)
      .filter((name) => {
        const fullPath = path.join(NOTES_DIR_PATH, name)
        return fs.statSync(fullPath).isDirectory() && /^\d{4}\./.test(name)
      })
      .sort()

    let fixedCount = 0
    let skippedCount = 0

    for (const noteDir of noteDirs) {
      const fixed = this.fixNoteTimestamps(noteDir, forceUpdate)
      if (fixed) {
        fixedCount++
      } else {
        skippedCount++
      }
    }

    if (fixedCount > 0) {
      logger.success(`时间戳修复完成: ${fixedCount} 个笔记已更新`)
    } else {
      logger.info('所有笔记时间戳均已正确')
    }

    return {
      fixed: fixedCount,
      skipped: skippedCount,
      total: noteDirs.length,
    }
  }

  /**
   * 更新指定笔记的时间戳为当前时间
   * @param noteDirNames - 笔记目录名数组
   * @returns 更新的笔记数量
   */
  async updateNotesTimestamp(noteDirNames: string[]): Promise<number> {
    if (noteDirNames.length === 0) {
      return 0
    }

    const now = Date.now()
    let updatedCount = 0

    for (const noteDir of noteDirNames) {
      const configPath = path.join(NOTES_DIR_PATH, noteDir, '.tnotes.json')

      if (!fs.existsSync(configPath)) {
        continue
      }

      try {
        // 读取配置
        const configContent = fs.readFileSync(configPath, 'utf-8')
        const config: NoteConfig = JSON.parse(configContent)

        // 更新 updated_at 为当前时间
        config.updated_at = now

        // 保持字段顺序写回文件
        const lines: string[] = ['{']
        const keys = Object.keys(config)
        keys.forEach((key, index) => {
          const value = (config as any)[key]
          const jsonValue = JSON.stringify(value)
          const comma = index < keys.length - 1 ? ',' : ''
          lines.push(`  "${key}": ${jsonValue}${comma}`)
        })
        lines.push('}')

        fs.writeFileSync(configPath, lines.join('\n') + '\n', 'utf-8')
        updatedCount++
      } catch (error) {
        logger.error(`更新时间戳失败: ${noteDir}`, error)
      }
    }

    return updatedCount
  }

  /**
   * 获取本次变更中包含 README.md 的笔记列表
   * @param changedFiles - git status 返回的变更文件列表
   * @returns 变更的笔记目录名数组
   */
  getChangedNotes(changedFiles: string[]): string[] {
    const changedNotes = new Set<string>()

    for (let file of changedFiles) {
      // 移除 git 添加的引号（git 对包含特殊字符的路径会加引号）
      // 支持两种格式：
      // 1. "notes/xxx/README.md" (完整包裹)
      // 2. notes/xxx/README.md" (只有末尾引号)
      file = file.replace(/^"(.*)"$/, '$1').replace(/"$/, '')

      // 检查是否是 notes 目录下的 README.md 文件
      const match = file.match(/^notes\/([^/]+)\/README\.md$/)
      if (match) {
        changedNotes.add(match[1])
      }
    }

    return Array.from(changedNotes)
  }
}
