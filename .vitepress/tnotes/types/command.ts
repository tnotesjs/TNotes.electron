/**
 * .vitepress/tnotes/types/command.ts
 *
 * 命令相关类型定义
 */

/**
 * 命令名称类型
 */
export type CommandName =
  | 'dev'
  | 'build'
  | 'preview'
  | 'update'
  | 'push'
  | 'pushAll'
  | 'pull'
  | 'pullAll'
  | 'sync'
  | 'syncAll'
  | 'new'
  | 'merge'
  | 'distribute'
  | 'tempSync'
  | 'help'

/**
 * 命令参数接口
 */
export interface CommandArgs {
  _: string[]
  [key: string]: any
  dev?: boolean
  build?: boolean
  preview?: boolean
  update?: boolean
  push?: boolean
  pushAll?: boolean
  pull?: boolean
  pullAll?: boolean
  sync?: boolean
  syncAll?: boolean
  new?: boolean
  merge?: boolean
  distribute?: boolean
  tempSync?: boolean
  help?: boolean
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
    'pushAll',
    'pull',
    'pullAll',
    'sync',
    'syncAll',
    'new',
    'merge',
    'distribute',
    'tempSync',
    'help',
  ].includes(cmd)
}
