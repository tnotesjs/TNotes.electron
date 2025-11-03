/**
 * .vitepress/tnotes/commands/BaseCommand.ts
 *
 * 命令基类
 */
import type { Command, CommandName } from '../types'
import { logger, type Logger } from '../utils/logger'
import { handleError } from '../utils/errorHandler'

/**
 * 命令基类
 */
export abstract class BaseCommand implements Command {
  protected logger: Logger

  constructor(public name: CommandName, public description: string) {
    this.logger = logger.child(name)
  }

  /**
   * 执行命令（带错误处理）
   */
  async execute(): Promise<void> {
    const startTime = Date.now()

    try {
      this.logger.start(this.description)
      await this.run()
      const duration = Date.now() - startTime
      this.logger.done(`命令执行耗时：${duration} ms`)
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  /**
   * 子类需要实现的运行逻辑
   */
  protected abstract run(): Promise<void>
}
