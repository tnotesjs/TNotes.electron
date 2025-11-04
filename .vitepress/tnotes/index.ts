/**
 * .vitepress/tnotes/index.ts
 *
 * TNotes 命令行入口
 */
import minimist from 'minimist'
import { getCommand } from './commands'
import { isValidCommand, type CommandArgs } from './types/command'
import { handleError, createError } from './utils/errorHandler'

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

    // 处理 quiet 模式（适用于 update 命令）
    if (commandName === 'update' && args.quiet) {
      const updateCommand = command as any
      if (typeof updateCommand.setQuiet === 'function') {
        updateCommand.setQuiet(true)
      }
    }

    // 处理 watch 模式（适用于 dev 命令）
    if (commandName === 'dev' && args['no-watch']) {
      const devCommand = command as any
      if (typeof devCommand.setEnableWatch === 'function') {
        devCommand.setEnableWatch(false)
      }
    }

    // 执行命令
    await command.execute()
  } catch (error) {
    handleError(error, true)
  }
})()
