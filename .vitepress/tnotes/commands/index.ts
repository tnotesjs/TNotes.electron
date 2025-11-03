/**
 * .vitepress/tnotes/commands/index.ts
 *
 * 命令注册中心
 */
import type { Command, CommandName } from '../types'
import { BuildCommand } from './BuildCommand'
import { DevCommand } from './DevCommand'
import { PreviewCommand } from './PreviewCommand'
import { SafeDevCommand } from './SafeDevCommand'
import { SafeUpdateCommand } from './SafeUpdateCommand'
import { UpdateCommand } from './UpdateCommand'
import {
  PushCommand,
  PullCommand,
  SyncCommand,
  PushAllCommand,
  PullAllCommand,
  SyncAllCommand,
} from './GitCommands'
import { NewCommand, MergeCommand, DistributeCommand } from './NoteCommands'
import { TempSyncCommand } from './TempSyncCommand'
import { HelpCommand } from './HelpCommand'

/**
 * 命令注册表
 */
export const commands: Record<CommandName, Command> = {
  dev: new DevCommand(),
  safeDev: new SafeDevCommand(),
  build: new BuildCommand(),
  preview: new PreviewCommand(),
  update: new UpdateCommand(),
  safeUpdate: new SafeUpdateCommand(),
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
export * from './BuildCommand'
export * from './DevCommand'
export * from './PreviewCommand'
export * from './SafeDevCommand'
export * from './SafeUpdateCommand'
export * from './UpdateCommand'
export * from './GitCommands'
export * from './NoteCommands'
export * from './TempSyncCommand'
export * from './HelpCommand'
