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
import {
  CreateNotesCommand,
  MergeNotesCommand,
  SplitNotesCommand,
} from './note'
import { SyncScriptsCommand, FixTimestampsCommand } from './maintenance'
import { HelpCommand } from './misc'

/**
 * 命令注册表
 */
export const commands: Record<CommandName, Command> = {
  dev: new DevCommand(),
  build: new BuildCommand(),
  preview: new PreviewCommand(),
  update: new UpdateCommand(),
  push: new PushCommand(),
  pull: new PullCommand(),
  sync: new SyncCommand(),
  'create-notes': new CreateNotesCommand(),
  'merge-notes': new MergeNotesCommand(),
  'split-notes': new SplitNotesCommand(),
  'sync-scripts': new SyncScriptsCommand(),
  'fix-timestamps': new FixTimestampsCommand(),
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
export * from './maintenance'
export * from './misc'
