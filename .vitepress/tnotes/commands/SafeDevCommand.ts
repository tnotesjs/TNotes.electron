/**
 * .vitepress/tnotes/commands/SafeDevCommand.ts
 *
 * 安全启动开发服务器命令
 */
import { BaseCommand } from './BaseCommand'
import { startServer } from '../VpManager'

export class SafeDevCommand extends BaseCommand {
  constructor() {
    super('safeDev', '安全启动知识库开发环境（自动管理进程）')
  }

  protected async run(): Promise<void> {
    startServer()
  }
}
