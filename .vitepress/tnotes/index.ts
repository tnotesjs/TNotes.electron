/**
 * .vitepress/tnotes/index.ts
 *
 * TNotes 命令行入口
 */
import minimist from 'minimist'
import { getCommand } from './commands'
import { isValidCommand, type CommandArgs } from './types'
import { handleError, createError } from './utils/errorHandler'
import { logger } from './utils/logger'

/**
 * 主函数
 */
;(async (): Promise<void> => {
  try {
    // 解析命令行参数
    const args = minimist(process.argv.slice(2)) as CommandArgs

    // 查找第一个为 true 的参数作为命令名
    const commandName = Object.keys(args).find(
      (key) => key !== '_' && args[key] === true
    )

    // 如果没有找到命令，显示帮助信息
    if (!commandName) {
      const helpCommand = getCommand('help')
      if (helpCommand) {
        await helpCommand.execute()
      }
      return
    }

    // 验证命令名
    if (!isValidCommand(commandName)) {
      throw createError.commandNotFound(commandName)
    }

    // 获取命令实例
    const command = getCommand(commandName)
    if (!command) {
      throw createError.commandNotFound(commandName)
    }

    // 执行命令
    await command.execute()
  } catch (error) {
    handleError(error, true)
  }
})()
