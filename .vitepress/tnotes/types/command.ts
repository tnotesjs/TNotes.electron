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
  | 'preview'
  | 'pull'
  | 'push'
  | 'rename-note'
  | 'sync-scripts'
  | 'sync'
  | 'update'
  | 'update-note-config'

/**
 * 命令参数类型
 */
export interface CommandArgs {
  dev?: boolean
  build?: boolean
  preview?: boolean
  update?: boolean
  push?: boolean
  pull?: boolean
  sync?: boolean
  'create-notes'?: boolean
  'sync-scripts'?: boolean
  'fix-timestamps'?: boolean
  'update-note-config'?: boolean
  'rename-note'?: boolean
  help?: boolean
  /**
   * 是否包含所有仓库
   */
  all?: boolean
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
 * 检查是否为有效命令
 */
export function isValidCommand(command: string): command is CommandName {
  return [
    'dev',
    'build',
    'preview',
    'update',
    'push',
    'pull',
    'sync',
    'create-notes',
    'sync-scripts',
    'fix-timestamps',
    'update-note-config',
    'rename-note',
    'help',
  ].includes(command)
}
