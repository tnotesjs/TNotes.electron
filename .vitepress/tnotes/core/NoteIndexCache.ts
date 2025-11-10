/**
 * .vitepress/tnotes/core/NoteIndexCache.ts
 *
 * 笔记索引缓存 - 维护笔记的内存索引，避免重复扫描文件系统
 */
import type { NoteInfo, NoteConfig } from '../types'
import { logger } from '../utils/logger'

/**
 * 索引项结构
 */
export interface NoteIndexItem {
  /** 笔记 ID（文件夹名前 4 位数字，如 "0001"） */
  noteId: string
  /** 完整文件夹名称（如 "0001. TNotes 简介"） */
  folderName: string
  /** 笔记配置（与 .tnotes.json 结构一致） */
  noteConfig: NoteConfig
}

/**
 * 笔记索引缓存类
 * 提供快速的笔记查询和更新能力
 */
export class NoteIndexCache {
  private static instance: NoteIndexCache | null = null

  /** noteId -> NoteIndexItem 的映射 */
  private byNoteId: Map<string, NoteIndexItem> = new Map()

  /** configId (UUID) -> noteId 的映射，用于快速反向查询 */
  private byConfigId: Map<string, string> = new Map()

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): NoteIndexCache {
    if (!NoteIndexCache.instance) {
      NoteIndexCache.instance = new NoteIndexCache()
    }
    return NoteIndexCache.instance
  }

  /**
   * 初始化索引缓存
   * @param notes - 扫描得到的笔记列表
   * @throws 如果检测到重复的笔记 ID
   */
  initialize(notes: NoteInfo[]): void {
    this.byNoteId.clear()
    this.byConfigId.clear()

    // 检测重复的 noteId
    const duplicates = this.findDuplicateNoteIds(notes)
    if (duplicates.length > 0) {
      const errorMsg = `检测到重复的笔记 ID，请修正后再启动服务:\n${duplicates
        .map((d) => `  - ID ${d.id}: ${d.folders.join(', ')}`)
        .join('\n')}`
      logger.error(errorMsg)
      throw new Error(errorMsg)
    }

    // 构建索引
    for (const note of notes) {
      const item: NoteIndexItem = {
        noteId: note.id,
        folderName: note.dirName,
        noteConfig: note.config,
      }

      this.byNoteId.set(note.id, item)
      this.byConfigId.set(note.config.id, note.id)
    }

    logger.info(`笔记索引初始化完成，共 ${notes.length} 篇笔记`)
  }

  /**
   * 检测重复的笔记 ID
   */
  private findDuplicateNoteIds(
    notes: NoteInfo[]
  ): Array<{ id: string; folders: string[] }> {
    const idMap = new Map<string, string[]>()

    for (const note of notes) {
      const existing = idMap.get(note.id) || []
      existing.push(note.dirName)
      idMap.set(note.id, existing)
    }

    const duplicates: Array<{ id: string; folders: string[] }> = []
    for (const [id, folders] of idMap) {
      if (folders.length > 1) {
        duplicates.push({ id, folders })
      }
    }

    return duplicates
  }

  /**
   * 根据 noteId 获取索引项
   */
  getByNoteId(noteId: string): NoteIndexItem | undefined {
    return this.byNoteId.get(noteId)
  }

  /**
   * 根据 configId (UUID) 获取索引项
   */
  getByConfigId(configId: string): NoteIndexItem | undefined {
    const noteId = this.byConfigId.get(configId)
    return noteId ? this.byNoteId.get(noteId) : undefined
  }

  /**
   * 检查 noteId 是否存在
   */
  has(noteId: string): boolean {
    return this.byNoteId.has(noteId)
  }

  /**
   * 获取所有笔记 ID
   */
  getAllNoteIds(): string[] {
    return Array.from(this.byNoteId.keys())
  }

  /**
   * 获取所有索引项
   */
  getAll(): NoteIndexItem[] {
    return Array.from(this.byNoteId.values())
  }

  /**
   * 更新笔记配置
   * @param noteId - 笔记 ID
   * @param configUpdates - 要更新的配置字段
   */
  updateConfig(noteId: string, configUpdates: Partial<NoteConfig>): void {
    const item = this.byNoteId.get(noteId)
    if (!item) {
      logger.warn(`尝试更新不存在的笔记: ${noteId}`)
      return
    }

    Object.assign(item.noteConfig, configUpdates)
    item.noteConfig.updated_at = Date.now()

    logger.debug(`更新笔记配置: ${noteId}`, configUpdates)
  }

  /**
   * 更新笔记的文件夹名称（标题变更时）
   * @param noteId - 笔记 ID
   * @param newFolderName - 新的文件夹名称
   */
  updateFolderName(noteId: string, newFolderName: string): void {
    const item = this.byNoteId.get(noteId)
    if (!item) {
      logger.warn(`尝试更新不存在的笔记: ${noteId}`)
      return
    }

    item.folderName = newFolderName
    logger.debug(`更新笔记文件夹名称: ${noteId} -> ${newFolderName}`)
  }

  /**
   * 删除笔记
   * @param noteId - 笔记 ID
   */
  delete(noteId: string): void {
    const item = this.byNoteId.get(noteId)
    if (!item) {
      logger.warn(`尝试删除不存在的笔记: ${noteId}`)
      return
    }

    // 同时删除两个索引
    this.byNoteId.delete(noteId)
    this.byConfigId.delete(item.noteConfig.id)

    logger.info(`删除笔记索引: ${noteId}`)
  }

  /**
   * 添加新笔记
   * @param note - 笔记信息
   */
  add(note: NoteInfo): void {
    const item: NoteIndexItem = {
      noteId: note.id,
      folderName: note.dirName,
      noteConfig: note.config,
    }

    this.byNoteId.set(note.id, item)
    this.byConfigId.set(note.config.id, note.id)

    logger.info(`添加笔记索引: ${note.id}`)
  }

  /**
   * 更改笔记 ID（文件夹重命名导致 ID 变化）
   * @param oldNoteId - 旧的笔记 ID
   * @param newNoteId - 新的笔记 ID
   * @param newFolderName - 新的文件夹名称
   */
  changeNoteId(
    oldNoteId: string,
    newNoteId: string,
    newFolderName: string
  ): void {
    const item = this.byNoteId.get(oldNoteId)
    if (!item) {
      logger.warn(`尝试更改不存在的笔记 ID: ${oldNoteId}`)
      return
    }

    // 删除旧 ID 的索引
    this.byNoteId.delete(oldNoteId)

    // 更新 item 的数据
    item.noteId = newNoteId
    item.folderName = newFolderName

    // 添加新 ID 的索引
    this.byNoteId.set(newNoteId, item)

    logger.info(`笔记 ID 变更: ${oldNoteId} -> ${newNoteId}`)
  }

  /**
   * 获取索引统计信息
   */
  getStats() {
    return {
      totalNotes: this.byNoteId.size,
      noteIds: Array.from(this.byNoteId.keys()).sort(),
    }
  }
}
