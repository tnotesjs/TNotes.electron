/**
 * .vitepress/tnotes/types/index.ts
 *
 * 类型定义统一导出
 */

// 配置相关类型
export type {
  TNotesConfig,
  IconConfig,
  SocialLink,
  MenuItem,
  RootItem,
  SidebarItem,
  CommandOptions,
} from './config'

// 笔记相关类型
export type { NoteConfig, NoteInfo, NotesLastUpdatedMap } from './note'

// Git 相关类型
export type { GitTimestamp } from './git'

// 命令相关类型
export type { CommandName, CommandArgs, Command } from './command'
export { isValidCommand } from './command'
