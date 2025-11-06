/**
 * .vitepress/config/_index.ts
 *
 * 配置模块统一导出
 *
 * !注意：文件名使用 _index.ts 而不是 index.ts
 * VitePress 会按优先级查找配置文件，如果使用 index.ts
 * 会导致 VitePress 误将此文件当作配置文件加载，引发错误
 */
export { IGNORE_LIST, GITHUB_PAGE_URL } from './constants'
export { getHeadConfig } from './head.config'
export { getMarkdownConfig } from './markdown.config'
export { getThemeConfig } from './theme.config'
