/**
 * .vitepress/tnotes/commands/update/UpdateCommand.ts
 *
 * 更新命令 - 使用 ReadmeService
 */
import { BaseCommand } from '../BaseCommand'
import { ReadmeService } from '../../services'
import { logger, LogLevel } from '../../utils/logger'

export class UpdateCommand extends BaseCommand {
  private readmeService: ReadmeService
  private quiet: boolean = false

  constructor() {
    super('update', '根据笔记内容更新知识库')
    this.readmeService = new ReadmeService()
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

    await this.readmeService.updateAllReadmes({
      updateSidebar: true,
      updateToc: true,
      updateHome: true,
    })

    const duration = Date.now() - startTime

    if (this.quiet) {
      // quiet 模式：只显示简洁的完成信息
      this.logger.success(`知识库更新完成 (${duration}ms)`)
    } else {
      this.logger.success('知识库更新完成')
    }
  }
}
