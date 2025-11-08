/**
 * .vitepress/tnotes/utils/index.ts
 *
 * TNotes 工具函数统一导出
 */

export * from './addNumberToTitle'
export * from './copyFile'
export * from './deleteDirectory'
export * from './errorHandler'
export * from './generateAnchor'
export * from './genHierarchicalSidebar'
export * from './getChangedIds'
export * from './getGitTimestamps'
export * from './getNotesLastUpdatedMap'
export * from './getTargetDirs'
export * from './getTnotesConfig'
export * from './logger'
export { generateToc, extractHeaders } from './markdown' // 只导出 generateToc 和 extractHeaders，避免与其他模块冲突
export * from './portUtils'
export * from './runCommand'
export * from './sortObjectKeys'
export * from './syncRepo'
