/**
 * .vitepress/tnotes/commands/git/SyncCommand.ts
 *
 * Git Sync 命令 - 使用 GitService
 */
import { BaseCommand } from '../BaseCommand'
import { GitService } from '../../services'

export class SyncCommand extends BaseCommand {
  private gitService: GitService

  constructor() {
    super('sync', '同步本地和远程的知识库状态')
    this.gitService = new GitService()
  }

  protected async run(): Promise<void> {
    this.logger.info('正在同步仓库...')

    const hasChanges = await this.gitService.hasChanges()

    if (hasChanges) {
      const message = this.gitService.generateCommitMessage()
      await this.gitService.sync(message)
    } else {
      await this.gitService.sync()
    }

    this.logger.success('同步完成')
  }
}
