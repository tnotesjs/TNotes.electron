/**
 * .vitepress/tnotes/lib/index.ts
 *
 * 第三方库封装层统一导出
 */

// Git 管理器
export { GitManager } from './GitManager'
export type { GitFileStatus, GitStatus, GitRemoteInfo } from './GitManager'

// 进程管理器
export { ProcessManager, getProcessManager } from './ProcessManager'
export type { ProcessInfo } from './ProcessManager'
