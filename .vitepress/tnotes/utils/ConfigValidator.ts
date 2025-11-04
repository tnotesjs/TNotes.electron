/**
 * .vitepress/tnotes/utils/ConfigValidator.ts
 *
 * 配置验证和修复工具 - 确保 .tnotes.json 配置完整性
 */
import * as fs from 'fs'
import { execSync } from 'child_process'
import type { NoteConfig } from '../types'
import { logger } from './logger'

/**
 * 默认配置字段
 */
const DEFAULT_CONFIG_FIELDS = {
  bilibili: [],
  tnotes: [],
  yuque: [],
  done: false,
  deprecated: false,
  enableDiscussions: false,
} as const

/**
 * 必需字段（不能缺失）
 */
const REQUIRED_FIELDS = ['id'] as const

/**
 * 配置字段顺序（用于排序）
 */
const FIELD_ORDER = [
  'bilibili',
  'tnotes',
  'yuque',
  'done',
  'deprecated',
  'category',
  'enableDiscussions',
  'id',
  'created_at',
  'updated_at',
] as const

/**
 * 配置验证器类
 */
export class ConfigValidator {
  /**
   * 验证并修复配置文件
   * @param configPath - 配置文件路径
   * @param noteDirPath - 笔记目录路径（用于获取 git 信息）
   * @returns 修复后的配置对象
   */
  static validateAndFix(
    configPath: string,
    noteDirPath: string
  ): NoteConfig | null {
    try {
      // 读取配置文件
      const configContent = fs.readFileSync(configPath, 'utf-8')
      let config: Partial<NoteConfig>

      try {
        config = JSON.parse(configContent)
      } catch (error) {
        logger.error(`配置文件 JSON 解析失败: ${configPath}`, error)
        return null
      }

      let needsUpdate = false

      // 1. 检查必需字段
      for (const field of REQUIRED_FIELDS) {
        if (!config[field]) {
          logger.error(
            `配置文件缺少必需字段 "${field}": ${configPath}\n` +
              `请手动添加该字段或删除配置文件后重新生成`
          )
          throw new Error(`Missing required field: ${field}`)
        }
      }

      // 2. 补充缺失的可选字段
      for (const [key, defaultValue] of Object.entries(DEFAULT_CONFIG_FIELDS)) {
        if (!(key in config)) {
          ;(config as any)[key] = defaultValue
          needsUpdate = true
          logger.info(`补充缺失字段 "${key}": ${configPath}`)
        }
      }

      // 3. 获取或更新时间戳
      const timestamps = this.getGitTimestamps(noteDirPath)
      if (timestamps) {
        if (!config.created_at || config.created_at !== timestamps.created_at) {
          config.created_at = timestamps.created_at
          needsUpdate = true
        }
        if (!config.updated_at || config.updated_at !== timestamps.updated_at) {
          config.updated_at = timestamps.updated_at
          needsUpdate = true
        }
      } else {
        // 如果无法从 git 获取时间戳，使用当前时间
        const now = Date.now()
        if (!config.created_at) {
          config.created_at = now
          needsUpdate = true
        }
        if (!config.updated_at) {
          config.updated_at = now
          needsUpdate = true
        }
      }

      // 4. 按字段顺序排序
      const sortedConfig = this.sortConfigKeys(config as NoteConfig)

      // 5. 写回文件（如果有变更）
      if (needsUpdate) {
        // 手动构建 JSON 字符串以保持字段顺序
        const jsonLines: string[] = ['{']
        const keys = Object.keys(sortedConfig)
        keys.forEach((key, index) => {
          const value = (sortedConfig as any)[key]
          const jsonValue = JSON.stringify(value)
          const comma = index < keys.length - 1 ? ',' : ''
          jsonLines.push(`  "${key}": ${jsonValue}${comma}`)
        })
        jsonLines.push('}')
        const sortedJson = jsonLines.join('\n')

        fs.writeFileSync(configPath, sortedJson + '\n', 'utf-8')
        logger.info(`配置文件已修复: ${configPath}`)
      }

      return sortedConfig
    } catch (error) {
      logger.error(`配置文件验证失败: ${configPath}`, error)
      return null
    }
  }

  /**
   * 从 git 获取文件的创建时间和最后修改时间
   * @param noteDirPath - 笔记目录路径
   * @returns 时间戳对象，包含 created_at 和 updated_at
   */
  private static getGitTimestamps(noteDirPath: string): {
    created_at: number
    updated_at: number
  } | null {
    try {
      // 获取首次提交时间（创建时间）
      const createdAtCmd = `git log --diff-filter=A --follow --format=%ct -- "${noteDirPath}" | tail -1`
      const createdAtOutput = execSync(createdAtCmd, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim()

      // 获取最后修改时间
      const updatedAtCmd = `git log -1 --format=%ct -- "${noteDirPath}"`
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
   * 按指定顺序排序配置对象的键
   * @param config - 原始配置对象
   * @returns 排序后的配置对象
   */
  private static sortConfigKeys(config: NoteConfig): NoteConfig {
    const sorted: any = {}

    // 按照定义的顺序添加字段
    for (const key of FIELD_ORDER) {
      if (key in config) {
        sorted[key] = (config as any)[key]
      }
    }

    // 添加其他未在顺序列表中的字段（如 category）
    for (const key of Object.keys(config)) {
      if (!(key in sorted)) {
        sorted[key] = (config as any)[key]
      }
    }

    return sorted as NoteConfig
  }

  /**
   * 检测配置变更类型
   * @param oldConfig - 旧配置
   * @param newConfig - 新配置
   * @returns 变更类型：'toc-only'（仅 TOC 相关）或 'full'（需要全局更新）
   */
  static detectChangeType(
    oldConfig: NoteConfig,
    newConfig: NoteConfig
  ): 'toc-only' | 'full' {
    // TOC 相关字段：只影响笔记内部目录
    const tocFields = ['bilibili', 'tnotes', 'yuque']

    // 全局更新字段：影响侧边栏、首页等
    const globalFields = ['done', 'deprecated', 'category', 'enableDiscussions']

    // 检查是否有全局字段变更
    for (const field of globalFields) {
      if (
        JSON.stringify(oldConfig[field]) !== JSON.stringify(newConfig[field])
      ) {
        return 'full'
      }
    }

    // 只有 TOC 字段变更
    for (const field of tocFields) {
      if (
        JSON.stringify(oldConfig[field]) !== JSON.stringify(newConfig[field])
      ) {
        return 'toc-only'
      }
    }

    // 没有影响更新的字段变更
    return 'toc-only'
  }
}
