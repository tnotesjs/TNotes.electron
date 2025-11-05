/**
 * .vitepress/tnotes/commands/index.ts
 *
 * 命令注册中心 - 使用新架构的命令
 */
import type { Command, CommandName } from '../types'

// 新架构的命令（从子目录导入）
import { DevCommand } from './dev'
import { BuildCommand, PreviewCommand } from './build'
import { UpdateCommand } from './update'
import { PushCommand, PullCommand, SyncCommand } from './git'
import { NewCommand } from './note'
import { TimestampFixCommand } from './TimestampFixCommand'

// 旧命令（暂时保持向后兼容）
import { PushAllCommand, PullAllCommand, SyncAllCommand } from './GitCommands'
import { MergeCommand, DistributeCommand } from './NoteCommands'
import { TempSyncCommand } from './TempSyncCommand'
import { HelpCommand } from './HelpCommand'

/**
 * 命令注册表
 */
export const commands: Record<CommandName, Command> = {
  dev: new DevCommand(),
  build: new BuildCommand(),
  preview: new PreviewCommand(),
  update: new UpdateCommand(),
  push: new PushCommand(),
  pushAll: new PushAllCommand(),
  pull: new PullCommand(),
  pullAll: new PullAllCommand(),
  sync: new SyncCommand(),
  syncAll: new SyncAllCommand(),
  new: new NewCommand(),
  merge: new MergeCommand(),
  distribute: new DistributeCommand(),
  tempSync: new TempSyncCommand(),
  'timestamp-fix': new TimestampFixCommand(),
  help: new HelpCommand(),
}

/**
 * 获取命令
 */
export function getCommand(name: CommandName): Command | undefined {
  return commands[name]
}

/**
 * 获取所有命令
 */
export function getAllCommands(): Command[] {
  return Object.values(commands)
}

/**
 * 导出所有命令类（供外部使用）
 */
export * from './BaseCommand'

// 新架构的命令导出
export * from './dev'
export * from './build'
export * from './update'
export * from './git'
export * from './note'
export * from './TimestampFixCommand'

// 旧命令导出（向后兼容，仅导出不冲突的部分）
export { PushAllCommand, PullAllCommand, SyncAllCommand } from './GitCommands'
export { MergeCommand, DistributeCommand } from './NoteCommands'
export * from './TempSyncCommand'
export * from './HelpCommand'
