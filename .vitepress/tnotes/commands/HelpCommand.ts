/**
 * .vitepress/tnotes/commands/HelpCommand.ts
 *
 * 帮助命令
 */
import { BaseCommand } from './BaseCommand'
import { getAllCommands } from './index'

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
      开发和构建: ['dev', 'safeDev', 'build', 'preview'],
      内容管理: ['update', 'safeUpdate', 'new', 'merge', 'distribute'],
      'Git 操作': ['push', 'pull', 'sync', 'pushAll', 'pullAll', 'syncAll'],
      其他: ['tempSync', 'help'],
    }

    for (const [category, cmdNames] of Object.entries(categories)) {
      this.logger.info(`  ${category}:`)
      for (const cmdName of cmdNames) {
        const cmd = commands.find((c) => c.name === cmdName)
        if (cmd) {
          const padding = ' '.repeat(15 - cmdName.length)
          this.logger.info(`    --${cmdName}${padding}${cmd.description}`)
        }
      }
      this.logger.info('')
    }

    this.logger.info('示例:')
    this.logger.info('  npx tsx ./.vitepress/tnotes/index.ts --dev')
    this.logger.info('  pnpm tn:build')
    this.logger.info('  pnpm tn:update')
    this.logger.info('')
    this.logger.info('环境变量:')
    this.logger.info('  DEBUG=1        启用调试模式，显示详细日志')
    this.logger.info('')
    this.logger.info('更多信息请查看: .vitepress/tnotes/README.md')
  }
}
