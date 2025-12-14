/**
 * .vitepress/tnotes/index.ts
 *
 * TNotes 内置命令入口模块
 */
import minimist from 'minimist'
import { getCommand } from './commands'
import { isValidCommand, type CommandArgs } from './types/command'
import { handleError, createError } from './utils/errorHandler'
import type {
  UpdateCommand,
  DevCommand,
  UpdateCompletedCountCommand,
  PushCommand,
  PullCommand,
  SyncCommand,
} from './commands'

/**
 * TNotes 内置命令入口函数
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
      const updateCommand = command as UpdateCommand
      if (typeof updateCommand.setQuiet === 'function') {
        updateCommand.setQuiet(true)
      }
    }

    // 处理 force 模式（适用于 push 命令）
    if (commandName === 'push' && args.force) {
      const baseCommand = command as PushCommand
      if (typeof baseCommand.setOptions === 'function') {
        baseCommand.setOptions({ force: true })
      }
    }

    // 处理 --all 参数（适用于 update/update-completed-count/push/pull/sync 命令）
    if (args.all) {
      if (commandName === 'update') {
        const updateCommand = command as UpdateCommand
        if (typeof updateCommand.setUpdateAll === 'function') {
          updateCommand.setUpdateAll(true)
        }
      } else if (commandName === 'update-completed-count') {
        const updateCompletedCountCommand =
          command as UpdateCompletedCountCommand
        if (typeof updateCompletedCountCommand.setUpdateAll === 'function') {
          updateCompletedCountCommand.setUpdateAll(true)
        }
      } else if (commandName === 'push') {
        const pushCommand = command as PushCommand
        if (typeof pushCommand.setPushAll === 'function') {
          pushCommand.setPushAll(true)
        }
      } else if (commandName === 'pull') {
        const pullCommand = command as PullCommand
        if (typeof pullCommand.setPullAll === 'function') {
          pullCommand.setPullAll(true)
        }
      } else if (commandName === 'sync') {
        const syncCommand = command as SyncCommand
        if (typeof syncCommand.setSyncAll === 'function') {
          syncCommand.setSyncAll(true)
        }
      }
    }

    // 执行命令
    await command.execute()
  } catch (error) {
    handleError(error, true)
  }
})()
