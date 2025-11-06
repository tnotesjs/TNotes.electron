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
import {
  getNewNotesTnotesJsonTemplate,
  generateNoteTitle,
} from '../config/templates'
import {
  NOTES_PATH,
  README_FILENAME,
  TNOTES_JSON_FILENAME,
  CONSTANTS,
  REPO_NOTES_URL,
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
  configId?: string // 配置文件中的 UUID（跨所有知识库唯一）
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
    const {
      title = 'new',
      category,
      enableDiscussions = false,
      configId,
    } = options

    // 生成笔记编号 ID（填充空缺）
    const noteNumberId = this.generateNextNoteId()
    const dirName = `${noteNumberId}. ${title}`
    const notePath = path.join(NOTES_PATH, dirName)

    // 确保目录存在
    await ensureDirectory(notePath)

    // 创建 README.md（包含一级标题）
    const readmePath = path.join(notePath, README_FILENAME)
    const noteTitle = generateNoteTitle(noteNumberId, title, REPO_NOTES_URL)
    const readmeContent = noteTitle + '\n' + NEW_NOTES_README_MD_TEMPLATE
    fs.writeFileSync(readmePath, readmeContent, 'utf-8')

    // 创建 .tnotes.json（使用 UUID 作为配置 ID）
    const configPath = path.join(notePath, TNOTES_JSON_FILENAME)
    const now = Date.now()
    const config: NoteConfig = {
      id: configId || uuidv4(), // 配置 ID 使用 UUID（跨知识库唯一）
      bilibili: [],
      tnotes: [],
      yuque: [],
      done: false,
      deprecated: false, // 添加 deprecated 字段，避免后续修复
      category,
      enableDiscussions,
      created_at: now,
      updated_at: now,
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')

    logger.info(`Created new note: ${dirName}`)

    return {
      id: noteNumberId, // 返回的 id 是笔记编号 ID
      path: notePath,
      dirName,
      readmePath,
      configPath,
      config,
    }
  }

  /**
   * 生成下一个笔记编号 ID（填充空缺）
   * @returns 新的笔记编号 ID（4位数字字符串，从 0001 到 9999）
   */
  private generateNextNoteId(): string {
    const notes = this.getAllNotes()

    if (notes.length === 0) {
      return '0001'
    }

    // 获取所有已使用的编号
    const usedIds = new Set<number>()
    for (const note of notes) {
      const id = parseInt(note.id, 10)
      if (!isNaN(id) && id >= 1 && id <= 9999) {
        usedIds.add(id)
      }
    }

    // 从 1 开始查找第一个未使用的编号
    for (let i = 1; i <= 9999; i++) {
      if (!usedIds.has(i)) {
        return i.toString().padStart(CONSTANTS.NOTE_ID_LENGTH, '0')
      }
    }

    // 如果所有编号都被占用（极端情况）
    throw new Error('所有笔记编号 (0001-9999) 已被占用，无法创建新笔记')
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

  /**
   * 修正笔记标题
   * @param noteInfo - 笔记信息
   * @returns 是否进行了修正
   */
  async fixNoteTitle(noteInfo: NoteInfo): Promise<boolean> {
    try {
      const readmeContent = fs.readFileSync(noteInfo.readmePath, 'utf-8')
      const lines = readmeContent.split('\n')

      // 提取目录名中的标题（去掉编号）
      const match = noteInfo.dirName.match(/^\d{4}\.\s+(.+)$/)
      if (!match) {
        logger.warn(`Invalid dir name format: ${noteInfo.dirName}`)
        return false
      }

      const expectedTitle = match[1]
      const expectedDirName = `${noteInfo.id}. ${expectedTitle}`
      const expectedH1 = generateNoteTitle(
        noteInfo.id,
        expectedTitle,
        REPO_NOTES_URL
      )

      // 检查第一行是否为一级标题
      const firstLine = lines[0].trim()

      if (!firstLine.startsWith('# ')) {
        // 缺少一级标题，在第一行插入
        lines.unshift(expectedH1)
        fs.writeFileSync(noteInfo.readmePath, lines.join('\n'), 'utf-8')
        logger.info(`Added title to: ${noteInfo.dirName}`)
        return true
      }

      // 检查标题是否正确
      if (firstLine !== expectedH1) {
        // 标题不正确，替换第一行
        lines[0] = expectedH1
        fs.writeFileSync(noteInfo.readmePath, lines.join('\n'), 'utf-8')
        logger.info(`Fixed title for: ${noteInfo.dirName}`)
        return true
      }

      return false
    } catch (error) {
      logger.error(`Failed to fix title for: ${noteInfo.dirName}`, error)
      return false
    }
  }

  /**
   * 修正所有笔记的标题
   * @returns 修正的笔记数量
   */
  async fixAllNoteTitles(): Promise<number> {
    const notes = this.getAllNotes()
    let fixedCount = 0

    for (const note of notes) {
      const fixed = await this.fixNoteTitle(note)
      if (fixed) {
        fixedCount++
      }
    }

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} note titles`)
    }

    return fixedCount
  }
}
