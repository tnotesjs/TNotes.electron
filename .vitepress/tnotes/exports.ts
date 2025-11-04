/**
 * .vitepress/tnotes/exports.ts
 *
 * TNotes 模块统一导出 - 供外部模块使用
 */

// ============ Types ============
export * from './types/index'

// ============ Config ============
export { ConfigManager, getConfigManager } from './config/ConfigManager'
export * from './config/constants'
export * from './config/templates'

// ============ Utils ============
export * from './utils/file'
export * from './utils/markdown'
export * from './utils/git'
export * from './utils/common'
export * from './utils/command'
export { logger, Logger } from './utils/logger'
export * from './utils/errorHandler'

// ============ Lib ============
export { GitManager } from './lib/GitManager'
export { ProcessManager } from './lib/ProcessManager'
export type {
  ProcessInfo,
  GitStatus,
  GitFileStatus,
  GitRemoteInfo,
} from './lib'

// ============ Core ============
export { NoteManager } from './core/NoteManager'
export { ReadmeGenerator } from './core/ReadmeGenerator'
export { TocGenerator } from './core/TocGenerator'
export { SidebarGenerator } from './core/SidebarGenerator'
export type { SidebarConfig, SidebarGroup } from './core'

// ============ Services ============
export { NoteService } from './services/NoteService'
export { ReadmeService } from './services/ReadmeService'
export { VitepressService } from './services/VitepressService'
export { GitService } from './services/GitService'
export type {
  CreateNoteOptions,
  UpdateReadmeOptions,
  PushOptions,
  PullOptions,
} from './services'

// ============ Commands ============
export { getCommand, getAllCommands, commands } from './commands'
export type { Command, CommandName } from './types/command'
