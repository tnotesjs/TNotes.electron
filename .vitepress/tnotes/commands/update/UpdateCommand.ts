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
  private updateAll: boolean = false

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

  /**
   * 设置是否更新所有知识库
   */
  setUpdateAll(updateAll: boolean): void {
    this.updateAll = updateAll
  }

  protected async run(): Promise<void> {
    if (this.updateAll) {
      await this.updateAllRepos()
    } else {
      await this.updateCurrentRepo()
    }
  }

  /**
   * 更新当前知识库
   */
  private async updateCurrentRepo(): Promise<void> {
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

    const duration = Date.now() - startTime

    if (this.quiet) {
      // quiet 模式：只显示简洁的完成信息
      this.logger.success(`知识库更新完成 (${duration}ms)`)
    } else {
      this.logger.success('知识库更新完成')
    }
  }

  /**
   * 更新所有知识库
   */
  private async updateAllRepos(): Promise<void> {
    const { getTargetDirs } = await import('../../utils')
    const { EN_WORDS_DIR } = await import('../../config/constants')
    const { runCommand } = await import('../../utils/runCommand')

    try {
      // 获取所有目标知识库
      const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [
        ROOT_DIR_PATH,
        EN_WORDS_DIR,
      ])

      if (targetDirs.length === 0) {
        this.logger.warn('未找到符合条件的知识库')
        return
      }

      this.logger.info(`正在更新 ${targetDirs.length} 个知识库...`)

      // 依次更新每个知识库
      let successCount = 0
      let failCount = 0

      for (let i = 0; i < targetDirs.length; i++) {
        const dir = targetDirs[i]
        const repoName = dir.split('/').pop() || dir

        try {
          process.stdout.write(
            `\r  [${i + 1}/${targetDirs.length}] 正在更新: ${repoName}...`
          )

          // 执行更新命令
          await runCommand('pnpm tn:update --quiet', dir)
          successCount++
        } catch (error) {
          failCount++
          console.log() // 换行
          this.logger.error(
            `更新失败: ${repoName} - ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        }
      }

      console.log() // 换行

      // 显示汇总
      if (failCount === 0) {
        this.logger.success(
          `✅ 所有知识库更新完成: ${successCount}/${targetDirs.length}`
        )
      } else {
        this.logger.warn(
          `⚠️  更新完成: ${successCount} 成功, ${failCount} 失败 (共 ${targetDirs.length} 个)`
        )
      }
    } catch (error) {
      this.logger.error(
        `批量更新失败: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
      throw error
    }
  }

  /**
   * 更新 root_item 配置
   * 只更新当前月份的完成笔记数量
   */
  private async updateRootItem(): Promise<void> {
    try {
      // 读取当前配置
      const configContent = readFileSync(ROOT_CONFIG_PATH, 'utf-8')
      const config: TNotesConfig = JSON.parse(configContent)

      // 1. 读取根目录 README.md
      const readmePath = resolve(ROOT_DIR_PATH, 'README.md')
      if (!existsSync(readmePath)) {
        throw new Error('根目录 README.md 不存在')
      }

      const readmeContent = readFileSync(readmePath, 'utf-8')

      // 2. 解析完成笔记数量
      const { parseReadmeCompletedNotes } = await import('../../utils')
      const { completedCount } = parseReadmeCompletedNotes(readmeContent)

      // 3. 生成当前月份的键名（如 '25.12'）
      const now = new Date()
      const yearShort = String(now.getFullYear()).slice(-2)
      const monthStr = String(now.getMonth() + 1).padStart(2, '0')
      const currentKey = `${yearShort}.${monthStr}`

      // 4. 更新当前月份的完成数量
      const completedNotesCount = {
        ...(config.root_item.completed_notes_count || {}),
        [currentKey]: completedCount,
      }

      // 5. 获取当前时间作为更新时间
      const updatedAt = Date.now()

      // 更新 root_item（不更新 created_at，由 timestamp-fix 命令统一管理）
      config.root_item = {
        ...config.root_item,
        completed_notes_count: completedNotesCount,
        updated_at: updatedAt,
      }

      // 删除旧字段（向后兼容）
      delete (config.root_item as any).completed_notes_count_last_month

      // 写入配置文件
      writeFileSync(ROOT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

      if (!this.quiet) {
        this.logger.success(
          `root_item 配置已更新: ${currentKey} 月完成 ${completedCount} 篇笔记`
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
      throw error
    }
  }
}
