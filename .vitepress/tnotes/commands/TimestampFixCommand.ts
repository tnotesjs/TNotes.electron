/**
 * .vitepress/tnotes/commands/TimestampFixCommand.ts
 *
 * 时间戳修复命令 - 独立修复所有笔记的时间戳
 */
import { BaseCommand } from './BaseCommand'
import { TimestampService } from '../services'

export class TimestampFixCommand extends BaseCommand {
  private timestampService: TimestampService

  constructor() {
    super('timestamp-fix', '修复所有笔记的时间戳（基于 git 历史）')
    this.timestampService = new TimestampService()
  }

  protected async run(): Promise<void> {
    this.logger.info('开始修复所有笔记的时间戳...')
    this.logger.info('📌 此操作会将所有时间戳更新为 git 真实时间')
    this.logger.info('')

    // 强制修复所有时间戳
    const result = await this.timestampService.fixAllTimestamps(true)

    this.logger.info('')
    this.logger.info('📊 修复统计:')
    this.logger.info(
      `  - 根配置文件: ${result.rootConfigFixed ? '已修复' : '无需修复'}`
    )
    this.logger.info(`  - 总笔记数: ${result.total}`)
    this.logger.info(`  - 已修复: ${result.fixed}`)
    this.logger.info(`  - 跳过: ${result.skipped}`)
    this.logger.info('')

    if (result.fixed > 0 || result.rootConfigFixed) {
      this.logger.success(
        `✅ 成功修复 ${result.fixed} 个笔记${
          result.rootConfigFixed ? ' + 根配置文件' : ''
        }的时间戳！`
      )
      this.logger.info('💡 提示: 运行 pnpm tn:push 提交更改')
    } else {
      this.logger.success('✅ 所有时间戳均已正确！')
    }
  }
}
