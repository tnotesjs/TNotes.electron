/**
 * .vitepress/tnotes/commands/DevCommand.ts
 *
 * 开发服务器命令
 */
import { BaseCommand } from './BaseCommand'
import { runCommandSpawn } from '../utils'
import { ROOT_DIR_PATH, port } from '../constants'

export class DevCommand extends BaseCommand {
  constructor() {
    super('dev', '启动知识库开发服务')
  }

  protected async run(): Promise<void> {
    const PORT = port || 5173
    this.logger.info(`服务端口：${PORT}`)

    // 开发服务器是长时间运行的进程，这里会阻塞直到服务器停止
    await runCommandSpawn(
      `vitepress dev --host --port ${PORT} --open`,
      ROOT_DIR_PATH,
      {
        // 匹配 VitePress 启动完成的标志：只匹配 "Local:" 关键字
        // 使用宽松的匹配规则以适应不同的输出格式
        serverReadyPattern: /Local:/,
        onServerReady: (duration) => {
          this.logger.success(`启动耗时：${duration} ms`)
        },
      }
    )
  }

  /**
   * 重写 execute 方法，因为这是长时间运行的命令
   */
  async execute(): Promise<void> {
    try {
      this.logger.start(this.description)
      await this.run()
      // 如果执行到这里，说明服务器已停止
      this.logger.info('Development server stopped')
    } catch (error) {
      const { handleError } = await import('../utils/errorHandler')
      handleError(error)
      throw error
    }
  }
}
