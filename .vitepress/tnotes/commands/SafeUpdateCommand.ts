/**
 * .vitepress/tnotes/commands/SafeUpdateCommand.ts
 *
 * 安全更新命令
 */
import { BaseCommand } from './BaseCommand'
import { safeUpdate } from '../VpManager'

export class SafeUpdateCommand extends BaseCommand {
  constructor() {
    super('safeUpdate', '安全更新知识库（自动重启服务）')
  }

  protected async run(): Promise<void> {
    await safeUpdate()
  }
}
