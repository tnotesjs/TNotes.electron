/**
 * .vitepress/tnotes/commands/misc/HelpCommand.ts
 *
 * 帮助命令
 */
import { BaseCommand } from '../BaseCommand'
import { getAllCommands } from '../index'

export class HelpCommand extends BaseCommand {
  constructor() {
    super('help', '显示帮助信息')
  }

  protected async run(): Promise<void> {
    const commands = getAllCommands()

    this.logger.info('TNotes 命令行工具')
    this.logger.info('')
    this.logger.info('用法: npx tsx ./.vitepress/tnotes/index.ts --<command>')
    this.logger.info('或者: pnpm tn:<command>')
    this.logger.info('')
    this.logger.info('可用命令:')
    this.logger.info('')

    // 按类别组织命令
    const categories = {
      开发和构建: ['dev', 'build', 'preview'],
      内容管理: ['update', 'update-completed-count', 'create-notes'],
      'Git 操作': ['push', 'pull', 'sync'],
      其他: ['sync-scripts', 'fix-timestamps', 'help'],
    }

    for (const [category, cmdNames] of Object.entries(categories)) {
      this.logger.info(`  ${category}:`)
      for (const cmdName of cmdNames) {
        const cmd = commands.find((c) => c.name === cmdName)
        if (cmd) {
          const paddingLength = Math.max(25 - cmdName.length, 1)
          const padding = ' '.repeat(paddingLength)
          this.logger.info(`    --${cmdName}${padding}${cmd.description}`)
        }
      }
      this.logger.info('')
    }

    this.logger.info('示例:')
    this.logger.info('  npx tsx ./.vitepress/tnotes/index.ts --dev')
    this.logger.info('  pnpm tn:build')
    this.logger.info('  pnpm tn:create-notes     # 批量创建笔记')
    this.logger.info('  pnpm tn:update')
    this.logger.info('  pnpm tn:update --all     # 更新所有知识库')
    this.logger.info(
      '  pnpm tn:update-completed-count           # 更新当前知识库历史数据'
    )
    this.logger.info(
      '  pnpm tn:update-completed-count --all     # 更新所有知识库历史数据'
    )
    this.logger.info('  pnpm tn:push --all       # 推送所有知识库')
    this.logger.info('')
    this.logger.info('参数:')
    this.logger.info(
      '  --all          批量操作所有知识库 (适用于 update/update-completed-count/push/pull/sync)'
    )
    this.logger.info('  --quiet        静默模式 (适用于 update)')
    this.logger.info('  --force        强制推送 (适用于 push)')
    this.logger.info('  --no-watch     禁用文件监听 (适用于 dev)')
    this.logger.info('')
    this.logger.info('环境变量:')
    this.logger.info('  DEBUG=1        启用调试模式,显示详细日志')
    this.logger.info('')
    this.logger.info('更多信息请查看: .vitepress/tnotes/README.md')
  }
}
