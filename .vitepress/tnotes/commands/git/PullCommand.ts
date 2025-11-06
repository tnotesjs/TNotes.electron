/**
 * .vitepress/tnotes/commands/git/PullCommand.ts
 *
 * Git Pull 命令 - 使用 GitService
 */
import { BaseCommand } from '../BaseCommand'
import { GitService } from '../../services'
import { pullAllRepos } from '../../utils'

export class PullCommand extends BaseCommand {
  private gitService: GitService
  private pullAll: boolean = false

  constructor() {
    super('pull', '将 GitHub 的知识库拉下来 (使用 --all 拉取所有知识库)')
    this.gitService = new GitService()
  }

  /**
   * 设置是否拉取所有仓库
   */
  public setPullAll(value: boolean): void {
    this.pullAll = value
  }

  protected async run(): Promise<void> {
    // 如果是 --all 模式，调用 pullAllRepos
    if (this.pullAll) {
      const parallel = process.env.PARALLEL_PULL === 'true'

      if (parallel) {
        this.logger.info('Parallel pull mode enabled')
      }

      await pullAllRepos({ parallel })
      return
    }

    // 单仓库拉取逻辑
    this.logger.info('正在从远程仓库拉取...')

    await this.gitService.pull()

    this.logger.success('拉取完成')
  }
}
