/**
 * .vitepress/tnotes/commands/git/SyncCommand.ts
 *
 * Git Sync 命令 - 使用 GitService
 */
import { BaseCommand } from '../BaseCommand'
import { GitService } from '../../services'
import { syncAllRepos } from '../../utils'

export class SyncCommand extends BaseCommand {
  private gitService: GitService
  private syncAll: boolean = false

  constructor() {
    super('sync', '同步本地和远程的知识库状态 (使用 --all 同步所有知识库)')
    this.gitService = new GitService()
  }

  /**
   * 设置是否同步所有仓库
   */
  public setSyncAll(value: boolean): void {
    this.syncAll = value
  }

  protected async run(): Promise<void> {
    // 如果是 --all 模式，调用 syncAllRepos
    if (this.syncAll) {
      // 同步操作不建议并行，因为可能有冲突
      await syncAllRepos({ parallel: false })
      return
    }

    // 单仓库同步逻辑
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
