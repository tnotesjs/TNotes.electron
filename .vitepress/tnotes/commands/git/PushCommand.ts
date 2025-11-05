/**
 * .vitepress/tnotes/commands/git/PushCommand.ts
 *
 * Git Push 命令 - 使用 GitService 和 TimestampService
 */
import { BaseCommand } from '../BaseCommand'
import { GitService, TimestampService, serviceManager } from '../../services'

export class PushCommand extends BaseCommand {
  private gitService: GitService
  private timestampService: TimestampService

  constructor() {
    super('push', '将知识库推送到 GitHub')
    this.gitService = new GitService()
    this.timestampService = new TimestampService()
  }

  protected async run(): Promise<void> {
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
