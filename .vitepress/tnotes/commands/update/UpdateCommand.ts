/**
 * .vitepress/tnotes/commands/update/UpdateCommand.ts
 *
 * 更新命令 - 使用 ReadmeService
 */
import { BaseCommand } from '../BaseCommand'
import { ReadmeService, NoteService } from '../../services'
import { logger, LogLevel } from '../../utils/logger'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { resolve } from 'path'
import {
  getTnotesConfig,
  ROOT_DIR_PATH,
  TNOTES_BASE_DIR,
  ROOT_CONFIG_PATH,
} from '../../config'
import type { TNotesConfig } from '../../types'

export class UpdateCommand extends BaseCommand {
  private readmeService: ReadmeService
  private noteService: NoteService
  private quiet: boolean = false

  constructor() {
    super('update', '根据笔记内容更新知识库')
    this.readmeService = new ReadmeService()
    this.noteService = new NoteService()
  }

  /**
   * 设置 quiet 模式
   */
  setQuiet(quiet: boolean): void {
    this.quiet = quiet
    if (quiet) {
      // 在 quiet 模式下，只显示 WARN 和 ERROR 级别的日志
      logger.setLevel(LogLevel.WARN)
    } else {
      logger.setLevel(LogLevel.INFO)
    }
  }

  protected async run(): Promise<void> {
    const startTime = Date.now()

    // 先修正所有笔记的标题
    if (!this.quiet) {
      this.logger.info('正在修正笔记标题...')
    }
    const fixedCount = await this.noteService.fixAllNoteTitles()
    if (!this.quiet && fixedCount > 0) {
      this.logger.success(`修正了 ${fixedCount} 个笔记标题`)
    }

    // 更新知识库
    await this.readmeService.updateAllReadmes({
      updateSidebar: true,
      updateHome: true,
    })

    // 更新 root_item 配置
    await this.updateRootItem()

    // 拷贝 sidebar.json 到根 TNotes 项目
    await this.copySidebarToRoot()

    const duration = Date.now() - startTime

    if (this.quiet) {
      // quiet 模式：只显示简洁的完成信息
      this.logger.success(`知识库更新完成 (${duration}ms)`)
    } else {
      this.logger.success('知识库更新完成')
    }
  }

  /**
   * 更新 root_item 配置
   */
  private async updateRootItem(): Promise<void> {
    try {
      // 读取当前配置
      const configContent = readFileSync(ROOT_CONFIG_PATH, 'utf-8')
      const config: TNotesConfig = JSON.parse(configContent)

      // 1. 计算完成的笔记数量（去重）
      const completedNotesCount = await this.getCompletedNotesCount()

      // 2. 获取当前时间作为更新时间
      const updatedAt = Date.now()

      // 更新 root_item（不更新 created_at，由 timestamp-fix 命令统一管理）
      config.root_item = {
        ...config.root_item,
        completed_notes_count: completedNotesCount,
        updated_at: updatedAt,
      }

      // 写入配置文件
      writeFileSync(ROOT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

      if (!this.quiet) {
        this.logger.success(
          `root_item 配置已更新: 完成 ${completedNotesCount} 篇笔记`
        )
      }
    } catch (error) {
      if (!this.quiet) {
        this.logger.error(
          `更新 root_item 失败: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }
    }
  }

  /**
   * 获取完成的笔记数量（去重）
   */
  private async getCompletedNotesCount(): Promise<number> {
    try {
      const allNotes = await this.noteService.getAllNotes()
      // 筛选出 done 为 true 的笔记，使用 Set 去重（基于 id）
      const completedNoteIds = new Set(
        allNotes.filter((note) => note.config?.done).map((note) => note.id)
      )
      return completedNoteIds.size
    } catch (error) {
      this.logger.warn(`获取完成笔记数量失败: ${error}`)
      return 0
    }
  }

  /**
   * 拷贝 sidebar.json 到根 TNotes 项目
   */
  private async copySidebarToRoot(): Promise<void> {
    try {
      const config = getTnotesConfig()
      const rootSidebarDir = config.rootSidebarDir

      // 如果没有配置 rootSidebarDir，跳过
      if (!rootSidebarDir) {
        return
      }

      // 源文件路径：当前项目的 sidebar.json
      const sourcePath = resolve(ROOT_DIR_PATH, 'sidebar.json')

      // 检查源文件是否存在
      if (!existsSync(sourcePath)) {
        if (!this.quiet) {
          this.logger.warn('sidebar.json 文件不存在，跳过拷贝')
        }
        return
      }

      // 目标目录：基于 TNOTES_BASE_DIR 和 rootSidebarDir 构建完整路径
      const targetDir = resolve(TNOTES_BASE_DIR, rootSidebarDir)

      // 确保目标目录存在
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }

      // 目标文件路径：使用仓库名作为文件名
      const repoName = config.repoName
      const targetPath = resolve(targetDir, `${repoName}.json`)

      // 拷贝文件
      copyFileSync(sourcePath, targetPath)

      if (!this.quiet) {
        this.logger.success(`已将 sidebar.json 拷贝到: ${targetPath}`)
      }
    } catch (error) {
      if (!this.quiet) {
        this.logger.error(
          `拷贝 sidebar.json 失败: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }
    }
  }
}
