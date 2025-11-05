/**
 * .vitepress/tnotes/services/GitService.ts
 *
 * Git 服务 - 封装 Git 操作相关的业务逻辑
 */
import { GitManager } from '../lib/GitManager'
import { ConfigManager } from '../config/ConfigManager'
import { logger } from '../utils/logger'
import { ROOT_DIR_PATH } from '../config/constants'

/**
 * Git 推送选项
 */
export interface PushOptions {
  message?: string
  branch?: string
  force?: boolean
}

/**
 * Git 拉取选项
 */
export interface PullOptions {
  branch?: string
  rebase?: boolean
}

/**
 * Git 服务类
 */
export class GitService {
  private gitManager: GitManager
  private configManager: ConfigManager

  constructor() {
    this.gitManager = new GitManager(ROOT_DIR_PATH)
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 推送到远程仓库
   * @param options - 推送选项
   */
  async push(options: PushOptions = {}): Promise<void> {
    const { message, branch, force = false } = options

    logger.info('Pushing to remote repository...')

    if (message) {
      // 有提交信息，先提交再推送
      await this.gitManager.pushWithCommit(message, { force })
    } else {
      // 直接推送
      await this.gitManager.push({ setUpstream: !!branch, force })
    }

    logger.info('Push completed successfully')
  }

  /**
   * 从远程仓库拉取
   * @param options - 拉取选项
   */
  async pull(options: PullOptions = {}): Promise<void> {
    const { rebase = false } = options

    logger.info('Pulling from remote repository...')

    await this.gitManager.pull({ rebase })

    logger.info('Pull completed successfully')
  }

  /**
   * 同步本地和远程仓库（先拉取后推送）
   * @param commitMessage - 可选的提交信息
   */
  async sync(commitMessage?: string): Promise<void> {
    logger.info('Syncing with remote repository...')

    await this.gitManager.sync({ commitMessage })

    logger.info('Sync completed successfully')
  }

  /**
   * 获取 Git 状态
   * @returns Git 状态信息
   */
  async getStatus() {
    return await this.gitManager.getStatus()
  }

  /**
   * 显示 Git 状态
   */
  async showStatus(): Promise<void> {
    await this.gitManager.showStatus()
  }

  /**
   * 添加文件到暂存区
   * @param files - 文件路径数组，为空则添加所有文件
   */
  async add(files: string[] = []): Promise<void> {
    logger.info('Adding files to staging area...')

    if (files.length === 0) {
      await this.gitManager.add('.')
    } else {
      for (const file of files) {
        await this.gitManager.add(file)
      }
    }

    logger.info('Files added successfully')
  }

  /**
   * 提交更改
   * @param message - 提交信息
   */
  async commit(message: string): Promise<void> {
    logger.info(`Committing with message: "${message}"`)

    await this.gitManager.commit(message)

    logger.info('Commit completed successfully')
  }

  /**
   * 添加并提交（快捷方法）
   * @param message - 提交信息
   * @param files - 文件路径数组，为空则添加所有文件
   */
  async addAndCommit(message: string, files: string[] = []): Promise<void> {
    await this.add(files)
    await this.commit(message)
  }

  /**
   * 检查是否有未提交的更改
   * @returns 是否有未提交的更改
   */
  async hasChanges(): Promise<boolean> {
    const status = await this.getStatus()
    return status.hasChanges
  }

  /**
   * 检查是否有未推送的提交
   * @returns 是否有未推送的提交
   */
  async hasUnpushedCommits(): Promise<boolean> {
    const status = await this.getStatus()
    return status.ahead > 0
  }

  /**
   * 获取当前分支名
   * @returns 当前分支名
   */
  async getCurrentBranch(): Promise<string> {
    const status = await this.getStatus()
    return status.branch
  }

  /**
   * 检查工作区是否干净
   * @returns 工作区是否干净
   */
  async isClean(): Promise<boolean> {
    return !(await this.hasChanges())
  }

  /**
   * 生成自动提交信息
   * @returns 自动生成的提交信息
   */
  generateCommitMessage(): string {
    const date = new Date().toISOString().split('T')[0]
    const time = new Date().toTimeString().split(' ')[0]
    return `📝 Update notes - ${date} ${time}`
  }

  /**
   * 快速提交并推送（使用自动生成的提交信息）
   */
  async quickPush(options: { force?: boolean } = {}): Promise<void> {
    if (!(await this.hasChanges())) {
      logger.info('No changes to commit')
      return
    }

    const message = this.generateCommitMessage()
    await this.push({ message, force: options.force })
  }

  /**
   * 强制推送（危险操作）
   * @param branch - 分支名
   */
  async forcePush(branch?: string): Promise<void> {
    logger.warn('Force pushing - this is a dangerous operation!')

    await this.gitManager.push({ force: true })

    logger.info('Force push completed')
  }
  /**
   * 获取远程仓库信息
   * @returns 远程仓库信息
   */
  async getRemoteInfo() {
    return await this.gitManager.getRemoteInfo()
  }
}
