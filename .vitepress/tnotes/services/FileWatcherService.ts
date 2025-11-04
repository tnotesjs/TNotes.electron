/**
 * .vitepress/tnotes/services/FileWatcherService.ts
 *
 * 文件监听服务 - 监听笔记文件变化并自动更新
 */
import * as fs from 'fs'
import * as path from 'path'
import { logger } from '../utils/logger'
import { ConfigValidator } from '../utils/ConfigValidator'
import { ReadmeService } from './ReadmeService'
import { NOTES_DIR_PATH } from '../config/constants'
import type { NoteConfig } from '../types'

/**
 * 文件变更类型
 */
interface FileChange {
  path: string
  type: 'readme' | 'config'
  noteId: string
  noteDirName: string
  noteDirPath: string
  configChangeType?: 'toc-only' | 'full' // 配置变更类型
}

/**
 * 文件监听服务类
 */
export class FileWatcherService {
  private readmeService: ReadmeService
  private watcher: fs.FSWatcher | null = null
  private updateTimer: NodeJS.Timeout | null = null
  private readonly debounceDelay = 1000 // 防抖延迟（毫秒）
  private changedFiles: Map<string, FileChange> = new Map()
  private isUpdating: boolean = false // 标记是否正在更新，避免循环触发
  private lastUpdateTime: number = 0 // 上次更新时间
  private readonly minUpdateInterval = 1000 // 最小更新间隔（毫秒），减少到 1s

  constructor() {
    this.readmeService = new ReadmeService()
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

    this.watcher = fs.watch(
      NOTES_DIR_PATH,
      { recursive: true },
      (eventType, filename) => {
        if (!filename) return

        // 如果正在更新，忽略所有变更
        if (this.isUpdating) {
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

    this.watcher.close()
    this.watcher = null
    this.changedFiles.clear()

    logger.info('文件监听已停止')
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

      // 分析变更类型
      const hasReadmeChanges = changes.some((c) => c.type === 'readme')
      const configChanges = changes.filter((c) => c.type === 'config')

      // 处理配置文件变更：验证并检测变更类型
      if (configChanges.length > 0) {
        for (const change of configChanges) {
          const configPath = path.join(change.noteDirPath, '.tnotes.json')

          // 读取变更前的配置（从文件系统缓存或重新读取）
          let oldConfig: NoteConfig | null = null
          try {
            const oldContent = fs.readFileSync(configPath, 'utf-8')
            oldConfig = JSON.parse(oldContent)
          } catch {
            // 无法读取旧配置，跳过变更类型检测
          }

          // 验证并修复配置文件
          const newConfig = ConfigValidator.validateAndFix(
            configPath,
            change.noteDirPath
          )

          // 检测变更类型
          if (oldConfig && newConfig) {
            change.configChangeType = ConfigValidator.detectChangeType(
              oldConfig,
              newConfig
            )
          } else {
            // 无法检测，默认为全局更新
            change.configChangeType = 'full'
          }
        }
      }

      // 判断更新策略
      const hasTocOnlyChanges = configChanges.some(
        (c) => c.configChangeType === 'toc-only'
      )
      const hasFullChanges = configChanges.some(
        (c) => c.configChangeType === 'full'
      )

      // 策略1：只有 README.md 变更或仅 TOC 相关配置变更 - 只更新笔记内 TOC
      if ((hasReadmeChanges || hasTocOnlyChanges) && !hasFullChanges) {
        logger.info(`检测到 ${changes.length} 个笔记内容变更，执行快速更新...`)
        await this.readmeService.updateNoteReadmesOnly(
          changes.map((c) => c.noteId)
        )
        const duration = Date.now() - startTime
        logger.success(`快速更新完成 (耗时 ${duration}ms)`)
      }
      // 策略2：有全局配置变更 - 执行完整更新
      else if (hasFullChanges) {
        logger.info(
          `检测到 ${configChanges.length} 个配置文件变更，执行完整更新...`
        )
        await this.readmeService.updateAllReadmes({
          updateSidebar: true,
          updateToc: true,
          updateHome: true,
        })
        const duration = Date.now() - startTime
        logger.success(`更新完成 (耗时 ${duration}ms)`)
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
}
