/**
 * .vitepress/tnotes/commands/TempSyncCommand.ts
 *
 * 临时同步命令
 */
import { BaseCommand } from './BaseCommand'
import { tempSync } from '../tempSync'

export class TempSyncCommand extends BaseCommand {
  constructor() {
    super('tempSync', '同步知识库脚本到其它 TNotes.xxx 知识库中')
  }

  protected async run(): Promise<void> {
    await tempSync()
  }
}
