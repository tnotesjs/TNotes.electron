/**
 * .vitepress/tnotes/commands/GitCommands.ts
 *
 * Git 相关命令
 */
import { BaseCommand } from './BaseCommand'
import {
  pushRepo,
  pullRepo,
  syncRepo,
  pushAllRepos,
  pullAllRepos,
  syncAllRepos,
} from '../utils'
import { ROOT_DIR_PATH } from '../config/constants'

export class PushCommand extends BaseCommand {
  constructor() {
    super('push', '将知识库推送到 GitHub')
  }

  protected async run(): Promise<void> {
    // 直接推送，不显示详细状态
    await pushRepo()
  }
}

export class PullCommand extends BaseCommand {
  constructor() {
    super('pull', '将 GitHub 的知识库拉下来')
  }

  protected async run(): Promise<void> {
    await pullRepo()
  }
}

export class SyncCommand extends BaseCommand {
  constructor() {
    super('sync', '同步本地和远程的知识库状态')
  }

  protected async run(): Promise<void> {
    await syncRepo()
  }
}

export class PushAllCommand extends BaseCommand {
  constructor() {
    super('pushAll', '推送所有 TNotes.xxx 知识库到 GitHub')
  }

  protected async run(): Promise<void> {
    // 支持并行推送（通过环境变量控制）
    const parallel = process.env.PARALLEL_PUSH === 'true'

    if (parallel) {
      this.logger.info('Parallel push mode enabled')
    }

    await pushAllRepos({ parallel })
  }
}

export class PullAllCommand extends BaseCommand {
  constructor() {
    super('pullAll', '拉取所有 TNotes.xxx 知识库')
  }

  protected async run(): Promise<void> {
    // 支持并行拉取
    const parallel = process.env.PARALLEL_PULL === 'true'

    if (parallel) {
      this.logger.info('Parallel pull mode enabled')
    }

    await pullAllRepos({ parallel })
  }
}

export class SyncAllCommand extends BaseCommand {
  constructor() {
    super('syncAll', '同步所有知识库')
  }

  protected async run(): Promise<void> {
    // 同步操作不建议并行，因为可能有冲突
    await syncAllRepos({ parallel: false })
  }
}
