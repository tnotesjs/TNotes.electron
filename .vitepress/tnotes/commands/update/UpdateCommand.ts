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
   */
  private async updateRootItem(): Promise<void> {
    try {
      // 读取当前配置
      const configContent = readFileSync(ROOT_CONFIG_PATH, 'utf-8')
      const config: TNotesConfig = JSON.parse(configContent)

      // 1. 计算每个月的完成笔记数量（全量计算）
      const completedNotesCountHistory =
        await this.getCompletedNotesCountHistory(config.root_item.created_at)

      // 2. 获取当前时间作为更新时间
      const updatedAt = Date.now()

      // 更新 root_item（不更新 created_at，由 timestamp-fix 命令统一管理）
      config.root_item = {
        ...config.root_item,
        completed_notes_count: completedNotesCountHistory,
        updated_at: updatedAt,
      }

      // 删除旧字段（向后兼容）
      delete (config.root_item as any).completed_notes_count_last_month

      // 写入配置文件
      writeFileSync(ROOT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

      if (!this.quiet) {
        const monthKeys = Object.keys(completedNotesCountHistory)
        const currentKey = monthKeys[monthKeys.length - 1]
        const currentCount = completedNotesCountHistory[currentKey] || 0
        this.logger.success(
          `root_item 配置已更新: 当前完成 ${currentCount} 篇笔记 (历史: ${monthKeys.length} 个月)`
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
   * 获取历史每个月的 completed_notes_count
   * 逻辑:
   * 1. 基于 created_at 计算知识库存在了多少个月
   * 2. 遍历每个月的最后一天,从 Git 提取该月的完成数
   * 3. 返回对象 { '25.03': 0, '25.04': 1, ... }
   */
  private async getCompletedNotesCountHistory(
    createdAt: number
  ): Promise<Record<string, number>> {
    try {
      const { execSync } = await import('child_process')

      // 1. 计算知识库创建月份和当前月份
      const createdDate = new Date(createdAt)
      const now = new Date()

      const createdYear = createdDate.getFullYear()
      const createdMonth = createdDate.getMonth() // 0-11
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() // 0-11

      // 计算总月数（包含创建月和当前月）
      const totalMonths =
        (currentYear - createdYear) * 12 + (currentMonth - createdMonth) + 1

      const result: Record<string, number> = {}
      let prevCount = 0

      // 2. 遍历每个月,提取完成数
      for (let i = 0; i < totalMonths; i++) {
        const targetYear = createdYear + Math.floor((createdMonth + i) / 12)
        const targetMonth = (createdMonth + i) % 12

        // 生成键名 (如 '25.03', '25.11')
        const yearShort = String(targetYear).slice(-2)
        const monthStr = String(targetMonth + 1).padStart(2, '0')
        const key = `${yearShort}.${monthStr}`

        // 计算该月的最后一天
        const lastDayOfMonth = new Date(
          targetYear,
          targetMonth + 1,
          0,
          23,
          59,
          59
        )
        const year = lastDayOfMonth.getFullYear()
        const month = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')
        const day = String(lastDayOfMonth.getDate()).padStart(2, '0')
        const untilDate = `${year}-${month}-${day} 23:59:59 +0800`

        try {
          // 查找该月最后一次修改根目录 .tnotes.json 的提交
          const commitHash = execSync(
            `git log --until="${untilDate}" --format=%H -1 -- .tnotes.json`,
            {
              cwd: ROOT_DIR_PATH,
              encoding: 'utf-8',
            }
          ).trim()

          if (!commitHash) {
            // 该月没有提交,使用上一个月的值或 0
            result[key] = prevCount
            continue
          }

          // 读取该提交中的 .tnotes.json 内容
          const configContent = execSync(
            `git show ${commitHash}:.tnotes.json`,
            {
              cwd: ROOT_DIR_PATH,
              encoding: 'utf-8',
            }
          )

          const config: TNotesConfig = JSON.parse(configContent)

          // 处理新旧格式兼容
          let count = 0
          const completedNotesCount = config.root_item?.completed_notes_count

          if (
            typeof completedNotesCount === 'object' &&
            completedNotesCount !== null
          ) {
            if (Array.isArray(completedNotesCount)) {
              // 数组格式:取最后一个值
              count = completedNotesCount[completedNotesCount.length - 1] || 0
            } else {
              // 对象格式:找到当前月或更早月份的最大值
              // 只取 <= 当前计算月份的数据,避免读取到未来月份的错误数据
              const validValues = Object.entries(completedNotesCount)
                .filter(([k]) => k <= key)
                .map(([, v]) => v)
              count =
                validValues.length > 0 ? Math.max(...validValues) : prevCount
            }
          } else if (typeof completedNotesCount === 'number') {
            // 旧格式:直接使用数字
            count = completedNotesCount
          }

          result[key] = count
          prevCount = count
        } catch (error) {
          // Git 命令执行失败,使用上一个月的值或 0
          result[key] = prevCount
        }
      }

      return result
    } catch (error) {
      // 任何错误都返回空对象
      return {}
    }
  }
}
