/**
 * .vitepress/tnotes/services/ServiceManager.ts
 *
 * 服务管理器 - 管理全局共享服务实例
 */
import { FileWatcherService } from './FileWatcherService'
import { NoteIndexCache } from '../core/NoteIndexCache'
import { NoteManager } from '../core/NoteManager'
import { logger } from '../utils/logger'

/**
 * 全局服务实例管理
 */
class ServiceManager {
  private static instance: ServiceManager
  private fileWatcherService: FileWatcherService | null = null
  private noteIndexCache: NoteIndexCache
  private noteManager: NoteManager
  private initialized: boolean = false

  private constructor() {
    this.noteIndexCache = NoteIndexCache.getInstance()
    this.noteManager = new NoteManager()
  }

  /**
   * 获取 ServiceManager 单例
   */
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager()
    }
    return ServiceManager.instance
  }

  /**
   * 初始化服务（扫描笔记并初始化索引缓存）
   * @throws 如果检测到重复的笔记 ID
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      logger.warn('ServiceManager 已经初始化')
      return
    }

    logger.info('正在初始化 ServiceManager...')

    try {
      // 1. 扫描所有笔记
      logger.info('扫描笔记目录...')
      const notes = this.noteManager.scanNotes()
      logger.info(`扫描到 ${notes.length} 篇笔记`)

      // 2. 初始化笔记索引缓存（如果有重复 ID 会抛出错误）
      logger.info('初始化笔记索引缓存...')
      this.noteIndexCache.initialize(notes)

      // 3. 输出统计信息
      const stats = this.noteIndexCache.getStats()
      logger.success(`索引缓存初始化完成，共 ${stats.totalNotes} 篇笔记`)

      this.initialized = true
      logger.success('ServiceManager 初始化完成')
    } catch (error) {
      logger.error('ServiceManager 初始化失败:', error)
      throw error
    }
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * 获取笔记索引缓存实例
   */
  getNoteIndexCache(): NoteIndexCache {
    return this.noteIndexCache
  }

  /**
   * 获取 FileWatcherService 实例（如果不存在则创建）
   */
  getFileWatcherService(): FileWatcherService {
    if (!this.fileWatcherService) {
      this.fileWatcherService = new FileWatcherService()
    }
    return this.fileWatcherService
  }

  /**
   * 检查 FileWatcherService 是否存在且正在运行
   */
  isFileWatcherActive(): boolean {
    return this.fileWatcherService?.isWatching() ?? false
  }
}

export const serviceManager = ServiceManager.getInstance()
