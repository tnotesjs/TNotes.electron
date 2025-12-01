/**
 * .vitepress/tnotes/commands/update-completed-count/UpdateCompletedCountCommand.ts
 *
 * 更新完成笔记数量历史记录命令
 * 从知识库创建月份到当前月份，基于 Git 历史中的 README.md 统计每个月的完成笔记数量
 */
import { BaseCommand } from '../BaseCommand'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { ROOT_DIR_PATH, ROOT_CONFIG_PATH } from '../../config'
import type { TNotesConfig } from '../../types'
import { execSync } from 'child_process'

export class UpdateCompletedCountCommand extends BaseCommand {
  private updateAll: boolean = false

  constructor() {
    super(
      'update-completed-count',
      '更新完成笔记数量历史记录（从创建月份到当前月份）'
    )
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

    try {
      // 读取当前配置
      const configContent = readFileSync(ROOT_CONFIG_PATH, 'utf-8')
      const config: TNotesConfig = JSON.parse(configContent)

      this.logger.info('开始更新完成笔记数量历史记录...')

      // 计算所有月份的完成笔记数量
      const completedNotesCountHistory =
        await this.getCompletedNotesCountHistory(config.root_item.created_at)

      // 更新配置
      config.root_item = {
        ...config.root_item,
        completed_notes_count: completedNotesCountHistory,
        updated_at: Date.now(),
      }

      // 写入配置文件
      writeFileSync(ROOT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

      const duration = Date.now() - startTime
      const monthKeys = Object.keys(completedNotesCountHistory)
      const currentKey = monthKeys[monthKeys.length - 1]
      const currentCount = completedNotesCountHistory[currentKey] || 0

      this.logger.success(
        `历史数据更新完成: 共 ${monthKeys.length} 个月, 当前 ${currentKey} 月完成 ${currentCount} 篇笔记 (${duration}ms)`
      )
    } catch (error) {
      this.logger.error(
        `更新失败: ${error instanceof Error ? error.message : String(error)}`
      )
      throw error
    }
  }

  /**
   * 更新所有知识库
   */
  private async updateAllRepos(): Promise<void> {
    const { getTargetDirs } = await import('../../utils')
    const { EN_WORDS_DIR, TNOTES_BASE_DIR } = await import(
      '../../config/constants'
    )
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

      this.logger.info(
        `正在更新 ${targetDirs.length} 个知识库的完成数量历史记录...`
      )

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
          await runCommand('pnpm tn:update-completed-count', dir)
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
          `✅ 所有知识库历史数据更新完成: ${successCount}/${targetDirs.length}`
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
   * 获取历史每个月的 completed_notes_count
   * 逻辑:
   * 1. 基于 created_at 计算知识库存在了多少个月
   * 2. 遍历每个月的最后一天，从 Git 历史中读取 README.md
   * 3. 解析 README.md 获取完成笔记数量
   * 4. 返回对象 { '25.03': 0, '25.04': 1, ... }
   */
  private async getCompletedNotesCountHistory(
    createdAt: number
  ): Promise<Record<string, number>> {
    try {
      const { parseReadmeCompletedNotes } = await import('../../utils')

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

      // 2. 先统计第一个月作为兜底值
      const firstYearShort = String(createdYear).slice(-2)
      const firstMonthStr = String(createdMonth + 1).padStart(2, '0')
      const firstKey = `${firstYearShort}.${firstMonthStr}`

      try {
        const firstCount = await this.getMonthCompletedCount(
          createdYear,
          createdMonth
        )
        result[firstKey] = firstCount
        prevCount = firstCount
        this.logger.info(`✓ ${firstKey}: ${firstCount} 篇`)
      } catch (error) {
        this.logger.warn(`${firstKey}: 无数据，使用 0`)
        result[firstKey] = 0
        prevCount = 0
      }

      // 3. 遍历剩余月份
      for (let i = 1; i < totalMonths; i++) {
        const targetYear = createdYear + Math.floor((createdMonth + i) / 12)
        const targetMonth = (createdMonth + i) % 12

        // 生成键名 (如 '25.03', '25.11')
        const yearShort = String(targetYear).slice(-2)
        const monthStr = String(targetMonth + 1).padStart(2, '0')
        const key = `${yearShort}.${monthStr}`

        try {
          const count = await this.getMonthCompletedCount(
            targetYear,
            targetMonth,
            prevCount
          )
          result[key] = count
          prevCount = count
          this.logger.info(`✓ ${key}: ${count} 篇`)
        } catch (error) {
          // 该月没有提交或解析失败，使用上一个月的值
          result[key] = prevCount
          this.logger.warn(`${key}: 无数据，使用 ${prevCount}（上月值）`)
        }
      }

      return result
    } catch (error) {
      this.logger.error(
        `获取历史数据失败: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
      return {}
    }
  }

  /**
   * 获取指定月份的完成笔记数量
   * @param year - 年份
   * @param month - 月份 (0-11)
   * @param fallbackCount - 回退值（如果该月没有数据）
   * @returns 完成笔记数量
   */
  private async getMonthCompletedCount(
    year: number,
    month: number,
    fallbackCount: number = 0
  ): Promise<number> {
    const { parseReadmeCompletedNotes } = await import('../../utils')

    // 计算该月的最后一天
    const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59)
    const yearStr = lastDayOfMonth.getFullYear()
    const monthStr = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(lastDayOfMonth.getDate()).padStart(2, '0')
    const untilDate = `${yearStr}-${monthStr}-${dayStr} 23:59:59 +0800`

    // 查找该月最后一次修改 README.md 的提交
    const commitHash = execSync(
      `git log --until="${untilDate}" --format=%H -1 -- README.md`,
      {
        cwd: ROOT_DIR_PATH,
        encoding: 'utf-8',
      }
    ).trim()

    if (!commitHash) {
      // 该月没有提交，返回回退值
      return fallbackCount
    }

    // 读取该提交中的 README.md 内容
    let readmeContent: string
    try {
      readmeContent = execSync(`git show ${commitHash}:README.md`, {
        cwd: ROOT_DIR_PATH,
        encoding: 'utf-8',
      })
    } catch (error) {
      // README.md 在该提交中不存在
      return fallbackCount
    }

    // 解析 README.md
    const { completedCount } = parseReadmeCompletedNotes(readmeContent)
    return completedCount
  }
}
