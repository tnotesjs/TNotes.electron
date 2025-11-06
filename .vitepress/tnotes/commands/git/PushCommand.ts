/**
 * .vitepress/tnotes/commands/git/PushCommand.ts
 *
 * Git Push 命令 - 使用 GitService 和 TimestampService
 */
import { BaseCommand } from '../BaseCommand'
import { GitService, TimestampService, serviceManager } from '../../services'
import { pushAllRepos } from '../../utils'

export class PushCommand extends BaseCommand {
  private gitService: GitService
  private timestampService: TimestampService
  private pushAll: boolean = false

  constructor() {
    super('push', '将知识库推送到 GitHub (使用 --all 推送所有知识库)')
    this.gitService = new GitService()
    this.timestampService = new TimestampService()
  }

  /**
   * 设置是否推送所有仓库
   */
  public setPushAll(value: boolean): void {
    this.pushAll = value
  }

  protected async run(): Promise<void> {
    // 如果是 --all 模式，调用 pushAllRepos
    if (this.pushAll) {
      const parallel = process.env.PARALLEL_PUSH === 'true'
      const force = this.options.force === true

      if (parallel) {
        this.logger.info('Parallel push mode enabled')
      }
      if (force) {
        this.logger.warn('使用强制推送模式 (--force)')
      }

      await pushAllRepos({ parallel, force })
      return
    }

    // 单仓库推送逻辑
    // 0. 暂停文件监听（如果正在运行）
    const isWatcherActive = serviceManager.isFileWatcherActive()
    if (isWatcherActive) {
      const fileWatcherService = serviceManager.getFileWatcherService()
      fileWatcherService.pause()
    }

    try {
      // 1. 检查是否有更改
      this.logger.info('检查是否有更改...')
      const status = await this.gitService.getStatus()

      if (!status.hasChanges) {
        this.logger.info('没有更改需要推送')
        return
      }

      // 获取变更的文件列表
      const changedFiles = status.files.map((f) => f.path)

      // 2. 检查本次 push 是否有笔记 README.md 文件变更
      this.logger.info(`变更文件: ${changedFiles.join(', ')}`)
      const changedNotes = this.timestampService.getChangedNotes(changedFiles)
      this.logger.info(`变更笔记: [${changedNotes.join(', ')}]`)

      if (changedNotes.length > 0) {
        this.logger.info(
          `检测到 ${changedNotes.length} 篇笔记的 README.md 有变更，更新时间戳...`
        )
        await this.timestampService.updateNotesTimestamp(changedNotes)
      }

      // 3. 推送到远程仓库
      const force = this.options.force === true
      if (force) {
        this.logger.warn('使用强制推送模式 (--force)')
      }
      this.logger.info('正在推送到远程仓库...')
      await this.gitService.quickPush({ force })

      this.logger.success('推送完成')
    } finally {
      // 恢复文件监听
      if (isWatcherActive) {
        const fileWatcherService = serviceManager.getFileWatcherService()
        fileWatcherService.resume()
      }
    }
  }
}
