/**
 * .vitepress/tnotes/services/FileWatcherService.ts
 *
 * 文件监听服务 - 监听笔记文件变化并自动更新
 */
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { logger } from '../utils/logger'
import { ConfigValidator } from '../utils/ConfigValidator'
import { ReadmeService } from './ReadmeService'
import { NoteService } from './NoteService'
import { NOTES_DIR_PATH } from '../config/constants'
import type { NoteConfig } from '../types'

/**
 * 文件变更类型
 */
interface FileChange {
  path: string
  type: 'readme' | 'config' | 'folder-rename'
  noteId: string
  noteDirName: string
  noteDirPath: string
  oldNoteDirName?: string // 文件夹重命名时的旧名称
}

/**
 * 文件监听服务类
 */
export class FileWatcherService {
  private readmeService: ReadmeService
  private noteService: NoteService
  private watcher: fs.FSWatcher | null = null
  private updateTimer: NodeJS.Timeout | null = null
  private readonly debounceDelay = 1000 // 防抖延迟（毫秒）
  private changedFiles: Map<string, FileChange> = new Map()
  private isUpdating: boolean = false // 标记是否正在更新，避免循环触发
  private lastUpdateTime: number = 0 // 上次更新时间
  private readonly minUpdateInterval = 1000 // 最小更新间隔（毫秒），减少到 1s
  private initializationTime: number = 0 // 初始化时间
  private readonly initializationPeriod = 3000 // 初始化期（毫秒），忽略启动后的变更事件
  private fileHashes: Map<string, string> = new Map() // 文件内容哈希缓存
  private batchUpdateThreshold = 5 // 批量更新阈值（文件数）
  private batchUpdateWindow = 2000 // 批量更新检测窗口（毫秒）
  private recentChanges: Array<{ time: number; path: string }> = [] // 记录最近的变更
  private noteDirCache: Set<string> = new Set() // 缓存所有笔记文件夹名称
  private folderRenameTimer: NodeJS.Timeout | null = null // 文件夹重命名检测定时器
  private pendingFolderRename: { oldName: string; time: number } | null = null // 待处理的文件夹重命名
  private configCache: Map<string, { done: boolean; deprecated: boolean }> =
    new Map() // 缓存配置状态

  constructor() {
    this.readmeService = new ReadmeService()
    this.noteService = new NoteService()
  }

  /**
   * 计算文件内容的哈希值
   */
  private getFileHash(filePath: string): string | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null
      }
      const content = fs.readFileSync(filePath, 'utf-8')
      return crypto.createHash('md5').update(content).digest('hex')
    } catch {
      return null
    }
  }

  /**
   * 初始化文件哈希和内容缓存
   */
  private initializeFileHashes(): void {
    try {
      const noteDirs = fs.readdirSync(NOTES_DIR_PATH)
      this.noteDirCache.clear()
      this.configCache.clear()

      for (const noteDir of noteDirs) {
        const noteDirPath = path.join(NOTES_DIR_PATH, noteDir)
        if (!fs.statSync(noteDirPath).isDirectory()) continue

        // 缓存文件夹名称
        this.noteDirCache.add(noteDir)

        // 缓存 README.md 的哈希
        const readmePath = path.join(noteDirPath, 'README.md')
        const readmeHash = this.getFileHash(readmePath)
        if (readmeHash) {
          this.fileHashes.set(readmePath, readmeHash)
        }

        // 缓存 .tnotes.json 的哈希和状态
        const configPath = path.join(noteDirPath, '.tnotes.json')
        const configHash = this.getFileHash(configPath)
        if (configHash) {
          this.fileHashes.set(configPath, configHash)
          // 缓存配置状态
          this.cacheConfigStatus(configPath)
        }
      }
    } catch (error) {
      logger.warn('初始化文件哈希缓存失败', error)
    }
  }

  /**
   * 缓存配置文件的状态
   */
  private cacheConfigStatus(configPath: string): void {
    try {
      if (!fs.existsSync(configPath)) return
      const configContent = fs.readFileSync(configPath, 'utf-8')
      const config = JSON.parse(configContent) as NoteConfig
      this.configCache.set(configPath, {
        done: config.done || false,
        deprecated: config.deprecated || false,
      })
    } catch (error) {
      // 忽略解析错误
    }
  }

  /**
   * 启动文件监听
   */
  start(): void {
    if (this.watcher) {
      logger.warn('文件监听已启动')
      return
    }

    logger.info('启动文件监听...')
    logger.info(`监听目录: ${NOTES_DIR_PATH}`)

    // 初始化文件哈希缓存
    this.initializeFileHashes()

    // 记录初始化时间
    this.initializationTime = Date.now()

    this.watcher = fs.watch(
      NOTES_DIR_PATH,
      { recursive: true },
      (eventType, filename) => {
        if (!filename) return

        // 忽略初始化期间的变更事件（避免启动时的误报）
        const timeSinceInit = Date.now() - this.initializationTime
        if (timeSinceInit < this.initializationPeriod) {
          return
        }

        // 如果正在更新，忽略所有变更
        if (this.isUpdating) {
          return
        }

        // 检测文件夹重命名（eventType === 'rename' 且 filename 不包含路径分隔符）
        if (eventType === 'rename' && !filename.includes(path.sep)) {
          this.handleFolderRename(filename)
          return
        }

        // 只监听 README.md 和 .tnotes.json 文件
        if (
          !filename.endsWith('README.md') &&
          !filename.endsWith('.tnotes.json')
        ) {
          return
        }

        // 忽略临时文件和备份文件
        if (filename.includes('~') || filename.includes('.swp')) {
          return
        }

        const fullPath = path.join(NOTES_DIR_PATH, filename)

        // 检查文件内容是否真的发生了变化
        const currentHash = this.getFileHash(fullPath)
        if (!currentHash) {
          return // 文件不存在或无法读取
        }

        const previousHash = this.fileHashes.get(fullPath)
        if (previousHash === currentHash) {
          return // 文件内容未变化，忽略此次事件
        }

        // 更新哈希缓存
        this.fileHashes.set(fullPath, currentHash)

        // 记录此次变更时间
        const now = Date.now()
        this.recentChanges.push({ time: now, path: fullPath })

        // 清理超出窗口期的变更记录
        this.recentChanges = this.recentChanges.filter(
          (change) => now - change.time < this.batchUpdateWindow
        )

        // 检测是否为批量更新（如 pnpm tn:update）
        if (this.recentChanges.length >= this.batchUpdateThreshold) {
          // 检测到批量更新，临时暂停监听
          logger.warn(
            `检测到批量文件变更 (${this.recentChanges.length} 个文件)，可能是 pnpm tn:update 执行中，暂停自动更新`
          )

          // 清空变更记录和待处理队列
          this.changedFiles.clear()
          this.recentChanges = []

          // 设置更新标志，阻止后续变更
          this.isUpdating = true

          // 延迟重置，让批量更新完成
          setTimeout(() => {
            this.isUpdating = false
            // 重新初始化哈希缓存，确保下次检测准确
            this.initializeFileHashes()
            logger.info('批量更新完成，恢复自动监听')
          }, this.batchUpdateWindow + 1000)

          return
        }

        // 解析笔记信息
        const noteDirName = path.basename(path.dirname(fullPath))
        const noteIdMatch = noteDirName.match(/^(\d{4})\./)
        if (!noteIdMatch) {
          return // 不是有效的笔记目录
        }

        const noteId = noteIdMatch[1]
        const noteDirPath = path.dirname(fullPath)
        const fileType = filename.endsWith('README.md') ? 'readme' : 'config'

        // 避免重复添加同一文件
        if (this.changedFiles.has(fullPath)) {
          return
        }

        this.changedFiles.set(fullPath, {
          path: fullPath,
          type: fileType,
          noteId,
          noteDirName,
          noteDirPath,
        })

        logger.info(`检测到文件变更: ${filename}`)

        // 防抖处理：延迟更新，避免频繁触发
        if (this.updateTimer) {
          clearTimeout(this.updateTimer)
        }

        this.updateTimer = setTimeout(() => {
          this.handleFileChange()
        }, this.debounceDelay)
      }
    )

    logger.success('文件监听已启动')
  }

  /**
   * 停止文件监听
   */
  stop(): void {
    if (!this.watcher) {
      logger.warn('文件监听未启动')
      return
    }

    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
      this.updateTimer = null
    }

    if (this.folderRenameTimer) {
      clearTimeout(this.folderRenameTimer)
      this.folderRenameTimer = null
    }

    this.watcher.close()
    this.watcher = null
    this.changedFiles.clear()
    this.fileHashes.clear()
    this.recentChanges = []
    this.noteDirCache.clear()
    this.pendingFolderRename = null

    logger.info('文件监听已停止')
  }

  /**
   * 处理文件夹重命名事件
   */
  private handleFolderRename(folderName: string): void {
    const folderPath = path.join(NOTES_DIR_PATH, folderName)
    const folderExists = fs.existsSync(folderPath)

    // 检查是否是有效的笔记文件夹（以 4 位数字开头）
    const noteIdMatch = folderName.match(/^(\d{4})\./)
    if (!noteIdMatch) {
      return // 不是有效的笔记文件夹
    }

    const noteId = noteIdMatch[1]

    if (!folderExists) {
      // 文件夹被删除或重命名（旧名称）
      if (this.noteDirCache.has(folderName)) {
        logger.info(`检测到文件夹删除/重命名: ${folderName}`)
        this.pendingFolderRename = {
          oldName: folderName,
          time: Date.now(),
        }

        // 设置定时器，等待新文件夹出现
        if (this.folderRenameTimer) {
          clearTimeout(this.folderRenameTimer)
        }

        this.folderRenameTimer = setTimeout(() => {
          // 超时后清除待处理的重命名
          this.pendingFolderRename = null
          this.folderRenameTimer = null
        }, 500) // 500ms 内如果没有新文件夹出现，则认为是删除操作
      }
    } else {
      // 文件夹被创建或重命名（新名称）
      if (!this.noteDirCache.has(folderName)) {
        logger.info(`检测到文件夹创建/重命名: ${folderName}`)

        // 检查是否有待处理的重命名
        if (
          this.pendingFolderRename &&
          Date.now() - this.pendingFolderRename.time < 500
        ) {
          const oldName = this.pendingFolderRename.oldName
          const oldNoteIdMatch = oldName.match(/^(\d{4})\./)

          // 确保是同一个笔记（ID 相同）
          if (oldNoteIdMatch && oldNoteIdMatch[1] === noteId) {
            logger.success(`检测到文件夹重命名: ${oldName} → ${folderName}`)

            // 清除定时器
            if (this.folderRenameTimer) {
              clearTimeout(this.folderRenameTimer)
              this.folderRenameTimer = null
            }

            // 触发全局文件更新
            this.handleFolderRenameUpdate(noteId, oldName, folderName)

            // 清除待处理的重命名
            this.pendingFolderRename = null
          }
        }

        // 更新缓存
        this.noteDirCache.add(folderName)

        // 如果有旧名称，删除旧名称的缓存
        if (this.pendingFolderRename) {
          this.noteDirCache.delete(this.pendingFolderRename.oldName)
        }
      }
    }
  }

  /**
   * 处理文件夹重命名后的更新
   */
  private async handleFolderRenameUpdate(
    noteId: string,
    oldName: string,
    newName: string
  ): Promise<void> {
    if (this.isUpdating) {
      logger.warn('正在更新中，跳过文件夹重命名更新')
      return
    }

    this.isUpdating = true

    try {
      const startTime = Date.now()
      logger.info('正在更新全局文件（sidebar、README）...')

      // 重新扫描所有笔记（因为文件夹名称已变更）
      const allNotes = this.noteService.getAllNotes()

      // 更新全局文件
      await this.readmeService.updateGlobalFiles(allNotes)

      const duration = Date.now() - startTime
      logger.success(`全局文件更新完成 (耗时 ${duration}ms)`)
      logger.info(`  - 已更新 sidebar.json`)
      logger.info(`  - 已更新 README.md`)

      this.lastUpdateTime = Date.now()
    } catch (error) {
      logger.error('文件夹重命名更新失败', error)
    } finally {
      // 延迟重置更新标志
      setTimeout(() => {
        this.isUpdating = false
        // 重新初始化缓存
        this.initializeFileHashes()
      }, 1000)
    }
  }

  /**
   * 检测配置文件状态是否发生变化
   * @param configPath - 配置文件路径
   * @returns 是否发生状态变化
   */
  private hasConfigStatusChanged(configPath: string): boolean {
    try {
      if (!fs.existsSync(configPath)) return false

      const configContent = fs.readFileSync(configPath, 'utf-8')
      const newConfig = JSON.parse(configContent) as NoteConfig
      const cachedStatus = this.configCache.get(configPath)

      if (!cachedStatus) {
        // 首次检测，缓存状态
        this.cacheConfigStatus(configPath)
        return false
      }

      const newDone = newConfig.done || false
      const newDeprecated = newConfig.deprecated || false

      // 检查状态是否变化
      const statusChanged =
        cachedStatus.done !== newDone ||
        cachedStatus.deprecated !== newDeprecated

      if (statusChanged) {
        // 更新缓存
        this.configCache.set(configPath, {
          done: newDone,
          deprecated: newDeprecated,
        })

        logger.info(
          `检测到配置状态变化: done(${cachedStatus.done}→${newDone}), deprecated(${cachedStatus.deprecated}→${newDeprecated})`
        )
      }

      return statusChanged
    } catch (error) {
      logger.error('检测配置状态失败', error)
      return false
    }
  }

  /**
   * 处理文件变更
   */
  private async handleFileChange(): Promise<void> {
    if (this.changedFiles.size === 0) return

    // 检查是否在最小更新间隔内
    const now = Date.now()
    if (now - this.lastUpdateTime < this.minUpdateInterval) {
      logger.warn('更新触发过于频繁，跳过本次更新')
      this.changedFiles.clear()
      return
    }

    // 防止循环更新
    if (this.isUpdating) {
      logger.warn('正在更新中，跳过本次更新')
      return
    }

    this.isUpdating = true
    const changes = Array.from(this.changedFiles.values())
    this.changedFiles.clear()

    try {
      const startTime = Date.now()

      // 检查是否有配置文件的状态变化
      const configChanges = changes.filter((c) => c.type === 'config')
      let hasStatusChange = false

      for (const change of configChanges) {
        if (this.hasConfigStatusChanged(change.path)) {
          hasStatusChange = true
          break
        }
      }

      // 如果有状态变化，需要更新全局文件
      if (hasStatusChange) {
        logger.info('检测到笔记状态变化，更新全局文件...')
        const allNotes = this.noteService.getAllNotes()
        await this.readmeService.updateGlobalFiles(allNotes)

        const duration = Date.now() - startTime
        logger.success(`全局文件更新完成 (耗时 ${duration}ms)`)
        logger.info(`  - 已更新 sidebar.json`)
        logger.info(`  - 已更新 README.md`)
      } else {
        // 没有状态变化，只更新笔记内容
        const noteIdsToUpdate = [...new Set(changes.map((c) => c.noteId))]

        // 先修正 README 变更笔记的标题
        const readmeChangedIds = changes
          .filter((c) => c.type === 'readme')
          .map((c) => c.noteId)

        if (readmeChangedIds.length > 0) {
          for (const noteId of readmeChangedIds) {
            const noteInfo = this.noteService.getNoteById(noteId)
            if (noteInfo) {
              await this.noteService.fixNoteTitle(noteInfo)
            }
          }
        }

        // 只更新变更笔记的 README（包含 TOC）
        logger.info(
          `检测到 ${changes.length} 个文件变更，更新 ${noteIdsToUpdate.length} 个笔记...`
        )
        await this.readmeService.updateNoteReadmesOnly(noteIdsToUpdate)

        const duration = Date.now() - startTime
        logger.success(`更新完成 (耗时 ${duration}ms)`)

        // 输出变更详情
        const readmeChanges = changes.filter((c) => c.type === 'readme')
        if (readmeChanges.length > 0) {
          logger.info(`  - README 变更: ${readmeChanges.length} 个`)
        }
        if (configChanges.length > 0) {
          logger.info(`  - 配置变更: ${configChanges.length} 个`)
        }
      }

      this.lastUpdateTime = Date.now()
    } catch (error) {
      logger.error('自动更新失败', error)
    } finally {
      // 延迟重置更新标志，确保由更新引起的文件变更不会触发新的更新
      setTimeout(() => {
        this.isUpdating = false
      }, 500)
    }
  }

  /**
   * 检查监听状态
   */
  isWatching(): boolean {
    return this.watcher !== null
  }

  /**
   * 暂停文件监听（用于 push 等批量操作）
   */
  pause(): void {
    if (!this.watcher) return
    this.isUpdating = true
    logger.info('文件监听已暂停')
  }

  /**
   * 恢复文件监听
   */
  resume(): void {
    if (!this.watcher) return
    // 重新初始化哈希缓存，确保下次检测准确
    this.initializeFileHashes()
    this.isUpdating = false
    this.changedFiles.clear()
    this.recentChanges = []
    logger.info('文件监听已恢复')
  }
}
