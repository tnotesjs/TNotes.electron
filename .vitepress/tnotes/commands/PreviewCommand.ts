/**
 * .vitepress/tnotes/commands/PreviewCommand.ts
 *
 * 预览命令
 */
import { BaseCommand } from './BaseCommand'
import { runCommandSpawn } from '../utils'
import { ROOT_DIR_PATH } from '../constants'

export class PreviewCommand extends BaseCommand {
  constructor() {
    super('preview', '预览构建后的知识库')
  }

  protected async run(): Promise<void> {
    this.logger.info('启动预览服务...')

    // 预览服务器是长时间运行的进程
    await runCommandSpawn('vitepress preview', ROOT_DIR_PATH, {
      serverReadyPattern: /Built site served at/,
      onServerReady: (duration) => {
        this.logger.success(`启动耗时：${duration} ms`)
      },
    })
  }

  /**
   * 重写 execute 方法，因为这是长时间运行的命令
   */
  async execute(): Promise<void> {
    try {
      this.logger.start(this.description)
      await this.run()
      // 如果执行到这里，说明服务器已停止
      this.logger.info('Preview server stopped')
    } catch (error) {
      const { handleError } = await import('../utils/errorHandler')
      handleError(error)
      throw error
    }
  }
}
