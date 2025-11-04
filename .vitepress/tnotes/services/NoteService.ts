/**
 * .vitepress/tnotes/services/NoteService.ts
 *
 * 笔记服务 - 封装笔记相关的业务逻辑
 */
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import type { NoteInfo, NoteConfig } from '../types'
import { NoteManager } from '../core/NoteManager'
import { ConfigManager } from '../config/ConfigManager'
import { getNewNotesTnotesJsonTemplate } from '../config/templates'
import {
  NOTES_PATH,
  README_FILENAME,
  TNOTES_JSON_FILENAME,
  CONSTANTS,
} from '../config/constants'
import { NEW_NOTES_README_MD_TEMPLATE } from '../config/templates'
import { logger } from '../utils/logger'
import { ensureDirectory } from '../utils/file'

/**
 * 创建新笔记的选项
 */
export interface CreateNoteOptions {
  title?: string
  category?: string
  enableDiscussions?: boolean
}

/**
 * 笔记服务类
 */
export class NoteService {
  private noteManager: NoteManager
  private configManager: ConfigManager

  constructor() {
    this.noteManager = new NoteManager()
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 获取所有笔记
   * @returns 笔记信息数组
   */
  getAllNotes(): NoteInfo[] {
    return this.noteManager.scanNotes()
  }

  /**
   * 获取笔记（通过ID）
   * @param noteId - 笔记ID
   * @returns 笔记信息，未找到时返回 undefined
   */
  getNoteById(noteId: string): NoteInfo | undefined {
    return this.noteManager.getNoteById(noteId)
  }

  /**
   * 创建新笔记
   * @param options - 创建选项
   * @returns 新创建的笔记信息
   */
  async createNote(options: CreateNoteOptions = {}): Promise<NoteInfo> {
    const { title = 'New Note', category, enableDiscussions = false } = options

    // 生成新笔记ID
    const noteId = this.generateNextNoteId()
    const dirName = `${noteId}. ${title}`
    const notePath = path.join(NOTES_PATH, dirName)

    // 确保目录存在
    await ensureDirectory(notePath)

    // 创建 README.md
    const readmePath = path.join(notePath, README_FILENAME)
    fs.writeFileSync(readmePath, NEW_NOTES_README_MD_TEMPLATE, 'utf-8')

    // 创建 .tnotes.json
    const configPath = path.join(notePath, TNOTES_JSON_FILENAME)
    const config: NoteConfig = {
      id: noteId,
      bilibili: [],
      tnotes: [],
      yuque: [],
      done: false,
      category,
      enableDiscussions,
      created_at: Date.now(),
      updated_at: Date.now(),
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')

    logger.info(`Created new note: ${dirName}`)

    return {
      id: noteId,
      path: notePath,
      dirName,
      readmePath,
      configPath,
      config,
    }
  }

  /**
   * 生成下一个笔记ID
   * @returns 新的笔记ID（4位数字字符串）
   */
  private generateNextNoteId(): string {
    const notes = this.getAllNotes()

    if (notes.length === 0) {
      return '0001'
    }

    // 找到最大的ID
    const maxId = notes.reduce((max, note) => {
      const id = parseInt(note.id, 10)
      return isNaN(id) ? max : Math.max(max, id)
    }, 0)

    const nextId = maxId + 1
    return nextId.toString().padStart(CONSTANTS.NOTE_ID_LENGTH, '0')
  }

  /**
   * 删除笔记
   * @param noteId - 笔记ID
   */
  async deleteNote(noteId: string): Promise<void> {
    const note = this.getNoteById(noteId)
    if (!note) {
      throw new Error(`Note not found: ${noteId}`)
    }

    // 删除笔记目录
    fs.rmSync(note.path, { recursive: true, force: true })
    logger.info(`Deleted note: ${note.dirName}`)
  }

  /**
   * 更新笔记配置
   * @param noteId - 笔记ID
   * @param updates - 配置更新
   */
  async updateNoteConfig(
    noteId: string,
    updates: Partial<NoteConfig>
  ): Promise<void> {
    const note = this.getNoteById(noteId)
    if (!note || !note.config) {
      throw new Error(`Note not found or no config: ${noteId}`)
    }

    const updatedConfig: NoteConfig = {
      ...note.config,
      ...updates,
      updated_at: Date.now(),
    }

    this.noteManager.updateNoteConfig(note, updatedConfig)
  }

  /**
   * 标记笔记为完成
   * @param noteId - 笔记ID
   */
  async markNoteAsDone(noteId: string): Promise<void> {
    await this.updateNoteConfig(noteId, { done: true })
    logger.info(`Marked note as done: ${noteId}`)
  }

  /**
   * 标记笔记为未完成
   * @param noteId - 笔记ID
   */
  async markNoteAsUndone(noteId: string): Promise<void> {
    await this.updateNoteConfig(noteId, { done: false })
    logger.info(`Marked note as undone: ${noteId}`)
  }

  /**
   * 标记笔记为废弃
   * @param noteId - 笔记ID
   */
  async deprecateNote(noteId: string): Promise<void> {
    await this.updateNoteConfig(noteId, { deprecated: true })
    logger.info(`Deprecated note: ${noteId}`)
  }

  /**
   * 验证所有笔记配置
   * @returns 验证结果 { valid: 有效数量, invalid: 无效数量 }
   */
  validateAllNotes(): { valid: number; invalid: number } {
    const notes = this.getAllNotes()
    let valid = 0
    let invalid = 0

    for (const note of notes) {
      if (note.config && this.noteManager.validateConfig(note.config)) {
        valid++
      } else {
        invalid++
        logger.warn(`Invalid config for note: ${note.dirName}`)
      }
    }

    logger.info(`Validation complete: ${valid} valid, ${invalid} invalid`)
    return { valid, invalid }
  }

  /**
   * 获取笔记统计信息
   * @returns 统计信息对象
   */
  getStatistics() {
    const notes = this.getAllNotes()

    const total = notes.length
    const done = notes.filter((n) => n.config?.done).length
    const deprecated = notes.filter((n) => n.config?.deprecated).length
    const withDiscussions = notes.filter(
      (n) => n.config?.enableDiscussions
    ).length

    const bilibiliCount = notes.reduce(
      (sum, n) => sum + (n.config?.bilibili?.length || 0),
      0
    )
    const tnotesCount = notes.reduce(
      (sum, n) => sum + (n.config?.tnotes?.length || 0),
      0
    )
    const yuqueCount = notes.reduce(
      (sum, n) => sum + (n.config?.yuque?.length || 0),
      0
    )

    return {
      total,
      done,
      inProgress: total - done - deprecated,
      deprecated,
      withDiscussions,
      externalResources: {
        bilibili: bilibiliCount,
        tnotes: tnotesCount,
        yuque: yuqueCount,
      },
    }
  }

  /**
   * 搜索笔记
   * @param keyword - 搜索关键词
   * @returns 匹配的笔记数组
   */
  searchNotes(keyword: string): NoteInfo[] {
    const notes = this.getAllNotes()
    const lowerKeyword = keyword.toLowerCase()

    return notes.filter((note) => {
      const dirNameMatch = note.dirName.toLowerCase().includes(lowerKeyword)
      const idMatch = note.id.includes(lowerKeyword)
      const categoryMatch = note.config?.category
        ?.toLowerCase()
        .includes(lowerKeyword)

      return dirNameMatch || idMatch || categoryMatch
    })
  }
}
