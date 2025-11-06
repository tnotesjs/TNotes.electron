/**
 * .vitepress/tnotes/types/command.ts
 *
 * 命令相关类型定义
 */

/**
 * 命令名称类型
 */
export type CommandName =
  | 'build'
  | 'create-notes'
  | 'dev'
  | 'fix-timestamps'
  | 'help'
  | 'merge-notes'
  | 'preview'
  | 'pull'
  | 'push'
  | 'split-notes'
  | 'sync-scripts'
  | 'sync'
  | 'update'

/**
 * 命令参数接口
 */
export interface CommandArgs {
  _: string[]
  [key: string]: any
  // cmds
  build?: boolean
  'create-notes'?: boolean
  dev?: boolean
  'fix-timestamps'?: boolean
  help?: boolean
  'merge-notes'?: boolean
  preview?: boolean
  pull?: boolean
  push?: boolean
  'split-notes'?: boolean
  'sync-scripts'?: boolean
  update?: boolean

  // options
  'no-watch'?: boolean
  all?: boolean
  force?: boolean
  quiet?: boolean
  sync?: boolean
}

/**
 * 命令接口
 */
export interface Command {
  name: CommandName
  description: string
  execute(): Promise<void>
}

/**
 * 类型守卫：检查是否为有效命令名称
 */
export function isValidCommand(cmd: string): cmd is CommandName {
  return [
    'dev',
    'build',
    'preview',
    'update',
    'push',
    'pull',
    'sync',
    'create-notes',
    'merge-notes',
    'split-notes',
    'sync-scripts',
    'fix-timestamps',
    'help',
  ].includes(cmd)
}
