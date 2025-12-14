/**
 * .vitepress/tnotes/types/note.ts
 *
 * 笔记相关类型定义
 */

/**
 * 笔记的 .tnotes.json 配置类型
 */
export interface NoteConfig {
  id: string
  bilibili: string[]
  tnotes: string[]
  yuque: string[]
  done: boolean
  deprecated?: boolean
  category?: string
  enableDiscussions: boolean
  description?: string // 笔记简介(一句话描述)
  created_at: number
  updated_at: number
}

/**
 * 笔记目录信息
 *
 * 示例：
 * {
 *   id: '0001',
 *   path: 'C:\\tnotesjs\\TNotes.introduction\\notes\\0001. TNotes 简介',
 *   dirName: '0001. TNotes 简介',
 *   readmePath: 'C:\\tnotesjs\\TNotes.introduction\\notes\\0001. TNotes 简介\\README.md',
 *   configPath: 'C:\\tnotesjs\\TNotes.introduction\\notes\\0001. TNotes 简介\\.tnotes.json',
 *   config: {
 *     bilibili: [],
 *     tnotes: [],
 *     yuque: [],
 *     done: true,
 *     deprecated: false,
 *     enableDiscussions: true,
 *     description: 'TNotes 是一个基于开源技术构建的免费个人在线知识库系统，采用分仓库模式管理笔记，支持公式渲染和自定义组件扩展，旨在提供高效便捷的知识管理和分享体验。',
 *     id: 'f3625513-ef8b-4ef5-b01b-69875d0fdcd9',
 *     created_at: 1748866888000,
 *     updated_at: 1762784039909
 *   }
 * }
 */
export interface NoteInfo {
  id: string
  path: string
  dirName: string
  readmePath: string
  configPath: string
  config?: NoteConfig
}

/**
 * 笔记更新映射表类型
 */
export type NotesLastUpdatedMap = Record<string, number>
