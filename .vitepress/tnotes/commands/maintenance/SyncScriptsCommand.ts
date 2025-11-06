/**
 * .vitepress/tnotes/commands/maintenance/SyncScriptsCommand.ts
 *
 * 同步脚本命令 - 同步知识库脚本到其它 TNotes.xxx 知识库中
 */
import { BaseCommand } from '../BaseCommand'
import { SyncScriptsService } from '../../services'

export class SyncScriptsCommand extends BaseCommand {
  private syncScriptsService: SyncScriptsService

  constructor() {
    super('sync-scripts', '同步知识库脚本到其它 TNotes.xxx 知识库中')
    this.syncScriptsService = new SyncScriptsService()
  }

  protected async run(): Promise<void> {
    await this.syncScriptsService.syncToAllRepos()
  }
}
