/**
 * .vitepress/tnotes/types/config.ts
 *
 * 配置相关类型定义
 */

/**
 * .tnotes.json 配置文件类型
 */
export interface TNotesConfig {
  id?: string
  author: string
  ignore_dirs: string[]
  repoName: string
  keywords: string[]
  socialLinks: SocialLink[]
  menuItems: MenuItem[]
  sidebarShowNoteId: boolean
  port?: number
  root_item: RootItem
}

/**
 * 图标配置
 */
export interface IconConfig {
  svg?: string
  src?: string
}

/**
 * 社交链接类型
 */
export interface SocialLink {
  ariaLabel?: string
  icon: string | IconConfig
  link: string
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  text: string
  link: string
}

/**
 * 根项目配置
 */
export interface RootItem {
  icon?: IconConfig
  title: string
  completed_notes_count: number
  details: string
  link: string
  created_at: number
  updated_at: number
  days_since_birth: number
}

/**
 * 侧边栏项类型
 */
export interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

/**
 * 命令执行选项
 */
export interface CommandOptions {
  cwd?: string
  stdio?: 'inherit' | 'pipe' | 'ignore'
  shell?: boolean
}
