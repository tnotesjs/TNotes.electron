/**
 * .vitepress/tnotes/core/NoteManager.ts
 *
 * 笔记管理器 - 负责笔记的扫描、验证和基本操作
 */
import * as fs from 'fs'
import * as path from 'path'
import type { NoteInfo, NoteConfig } from '../types'
import {
  NOTES_PATH,
  TNOTES_JSON_FILENAME,
  README_FILENAME,
} from '../config/constants'
import { logger } from '../utils/logger'
import { ConfigValidator } from '../utils/ConfigValidator'
import { ConfigManager } from '../config/ConfigManager'

/**
 * 笔记管理器类
 */
export class NoteManager {
  private configManager: ConfigManager

  constructor() {
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 扫描所有笔记
   * @returns 笔记信息数组
   */
  scanNotes(): NoteInfo[] {
    const notes: NoteInfo[] = []
    const noteIdMap = new Map<string, string[]>() // 用于检测重复编号：ID -> [dirNames]

    if (!fs.existsSync(NOTES_PATH)) {
      logger.warn(`Notes directory not found: ${NOTES_PATH}`)
      return notes
    }

    const noteDirs = fs
      .readdirSync(NOTES_PATH)
      .filter((dir) => {
        const fullPath = path.join(NOTES_PATH, dir)
        return fs.statSync(fullPath).isDirectory() && !dir.startsWith('.')
      })
      .sort()

    for (const dirName of noteDirs) {
      const notePath = path.join(NOTES_PATH, dirName)
      const readmePath = path.join(notePath, README_FILENAME)
      const configPath = path.join(notePath, TNOTES_JSON_FILENAME)

      if (!fs.existsSync(readmePath)) {
        logger.warn(`README not found in note: ${dirName}`)
        continue
      }

      let config: NoteConfig | undefined
      if (fs.existsSync(configPath)) {
        try {
          // 使用 ConfigValidator 验证并修复配置
          config =
            ConfigValidator.validateAndFix(configPath, notePath) || undefined
        } catch (error) {
          logger.error(`Failed to validate config for note: ${dirName}`, error)
        }
      }

      const id = this.extractNoteId(dirName)

      // 记录笔记编号，用于检测重复
      if (!noteIdMap.has(id)) {
        noteIdMap.set(id, [])
      }
      noteIdMap.get(id)!.push(dirName)

      notes.push({
        id,
        path: notePath,
        dirName,
        readmePath,
        configPath,
        config,
      })
    }

    // 检测并报告重复的笔记编号
    this.checkDuplicateNoteIds(noteIdMap)

    // 移除日志输出，由调用方决定是否输出
    return notes
  }

  /**
   * 检测重复的笔记编号
   * @param noteIdMap - 笔记编号映射表（ID -> [dirNames]）
   */
  private checkDuplicateNoteIds(noteIdMap: Map<string, string[]>): void {
    const duplicates: Array<{ id: string; dirNames: string[] }> = []

    for (const [id, dirNames] of noteIdMap.entries()) {
      if (dirNames.length > 1) {
        duplicates.push({ id, dirNames })
      }
    }

    if (duplicates.length > 0) {
      logger.error('⚠️  检测到重复的笔记编号！')
      for (const { id, dirNames } of duplicates) {
        logger.error(`   编号 ${id} 被以下笔记重复使用：`)
        dirNames.forEach((dirName) => {
          logger.error(`      - ${dirName}`)
        })
      }
      logger.error(
        '\n请检查并删除或重命名重复的笔记文件夹，确保每个笔记编号唯一！\n'
      )
      // 终止执行
      process.exit(1)
    }
  }

  /**
   * 从目录名提取笔记ID
   * @param dirName - 目录名
   * @returns 笔记ID
   */
  private extractNoteId(dirName: string): string {
    const match = dirName.match(/^(\d+)\./)
    return match ? match[1] : dirName
  }

  /**
   * 验证笔记配置
   * @param config - 笔记配置
   * @returns 是否有效
   */
  validateConfig(config: NoteConfig): boolean {
    if (!config.id) {
      logger.error('Note config missing id')
      return false
    }

    if (!Array.isArray(config.bilibili)) {
      logger.error(`Invalid bilibili config in note: ${config.id}`)
      return false
    }

    if (!Array.isArray(config.tnotes)) {
      logger.error(`Invalid tnotes config in note: ${config.id}`)
      return false
    }

    if (!Array.isArray(config.yuque)) {
      logger.error(`Invalid yuque config in note: ${config.id}`)
      return false
    }

    if (typeof config.done !== 'boolean') {
      logger.error(`Invalid done status in note: ${config.id}`)
      return false
    }

    if (typeof config.enableDiscussions !== 'boolean') {
      logger.error(`Invalid enableDiscussions status in note: ${config.id}`)
      return false
    }

    return true
  }

  /**
   * 读取笔记内容
   * @param noteInfo - 笔记信息
   * @returns 笔记内容
   */
  readNoteContent(noteInfo: NoteInfo): string {
    if (!fs.existsSync(noteInfo.readmePath)) {
      throw new Error(`README not found: ${noteInfo.readmePath}`)
    }
    return fs.readFileSync(noteInfo.readmePath, 'utf-8')
  }

  /**
   * 写入笔记内容
   * @param noteInfo - 笔记信息
   * @param content - 笔记内容
   */
  writeNoteContent(noteInfo: NoteInfo, content: string): void {
    fs.writeFileSync(noteInfo.readmePath, content, 'utf-8')
    logger.info(`Updated note: ${noteInfo.dirName}`)
  }

  /**
   * 更新笔记配置
   * @param noteInfo - 笔记信息
   * @param config - 新的配置
   */
  updateNoteConfig(noteInfo: NoteInfo, config: NoteConfig): void {
    if (!this.validateConfig(config)) {
      throw new Error(`Invalid config for note: ${noteInfo.dirName}`)
    }

    config.updated_at = Date.now()
    const configContent = JSON.stringify(config, null, 2)
    fs.writeFileSync(noteInfo.configPath, configContent, 'utf-8')
    logger.info(`Updated config for note: ${noteInfo.dirName}`)
  }

  /**
   * 获取笔记信息（通过ID）- 优化版本，直接查找不扫描所有笔记
   * @param noteId - 笔记ID
   * @returns 笔记信息，未找到时返回 undefined
   */
  getNoteById(noteId: string): NoteInfo | undefined {
    if (!fs.existsSync(NOTES_PATH)) {
      return undefined
    }

    // 直接遍历目录查找匹配的笔记，而不是扫描所有笔记
    const noteDirs = fs.readdirSync(NOTES_PATH)

    for (const dirName of noteDirs) {
      const fullPath = path.join(NOTES_PATH, dirName)

      // 跳过非目录和隐藏目录
      if (!fs.statSync(fullPath).isDirectory() || dirName.startsWith('.')) {
        continue
      }

      // 提取笔记 ID
      const id = this.extractNoteId(dirName)

      // 找到匹配的笔记
      if (id === noteId) {
        const notePath = fullPath
        const readmePath = path.join(notePath, README_FILENAME)
        const configPath = path.join(notePath, TNOTES_JSON_FILENAME)

        if (!fs.existsSync(readmePath)) {
          return undefined
        }

        let config: NoteConfig | undefined
        if (fs.existsSync(configPath)) {
          try {
            config =
              ConfigValidator.validateAndFix(configPath, notePath) || undefined
          } catch (error) {
            logger.error(
              `Failed to validate config for note: ${dirName}`,
              error
            )
          }
        }

        return {
          id,
          path: notePath,
          dirName,
          readmePath,
          configPath,
          config,
        }
      }
    }

    return undefined
  }

  /**
   * 检查笔记是否存在
   * @param noteId - 笔记ID
   * @returns 是否存在
   */
  noteExists(noteId: string): boolean {
    return this.getNoteById(noteId) !== undefined
  }
}
