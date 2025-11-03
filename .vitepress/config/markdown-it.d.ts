/**
 * .vitepress/config/markdown-it.d.ts
 *
 * 第三方库类型声明
 */

declare module 'markdown-it-container' {
  import { PluginWithOptions } from 'markdown-it'
  const markdownItContainer: PluginWithOptions<any>
  export default markdownItContainer
}

declare module 'markdown-it-link-attributes' {
  import { PluginWithOptions } from 'markdown-it'
  const markdownItLinkAttributes: PluginWithOptions<any>
  export default markdownItLinkAttributes
}

declare module 'markdown-it-task-lists' {
  import { PluginWithOptions } from 'markdown-it'
  const markdownItTaskLists: PluginWithOptions<any>
  export default markdownItTaskLists
}
