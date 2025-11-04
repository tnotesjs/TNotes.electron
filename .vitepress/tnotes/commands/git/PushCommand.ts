/**
 * .vitepress/tnotes/commands/git/PushCommand.ts
 *
 * Git Push 命令 - 使用 GitService
 */
import { BaseCommand } from '../BaseCommand'
import { GitService } from '../../services'

export class PushCommand extends BaseCommand {
  private gitService: GitService

  constructor() {
    super('push', '将知识库推送到 GitHub')
    this.gitService = new GitService()
  }

  protected async run(): Promise<void> {
    this.logger.info('检查是否有更改...')

    const hasChanges = await this.gitService.hasChanges()

    if (!hasChanges) {
      this.logger.info('没有更改需要推送')
      return
    }

    this.logger.info('正在推送到远程仓库...')

    await this.gitService.quickPush()

    this.logger.success('推送完成')
  }
}
