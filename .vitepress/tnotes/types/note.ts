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
  created_at: number
  updated_at: number
}

/**
 * 笔记目录信息
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
