/**
 * .vitepress/tnotes/core/SidebarGenerator.ts
 *
 * 侧边栏生成器 - 负责生成 VitePress 侧边栏配置
 */
import type { NoteInfo } from '../types'

export interface SidebarGroup {
  text: string
  items: Array<{
    text: string
    link: string
  }>
}

export interface SidebarConfig {
  '/notes/': SidebarGroup[]
}

/**
 * 侧边栏生成器类
 */
export class SidebarGenerator {
  /**
   * 生成侧边栏配置
   * @param notes - 笔记信息数组
   * @returns 侧边栏配置对象
   */
  generate(notes: NoteInfo[]): SidebarConfig {
    const notesGroupedByCategory = this.groupNotesByCategory(notes)

    const sidebarGroups = Object.entries(notesGroupedByCategory).map(
      ([category, categoryNotes]) => ({
        text: category,
        items: categoryNotes.map((note) => ({
          text: note.dirName,
          link: `/notes/${note.dirName}/README`,
        })),
      })
    )

    return {
      '/notes/': sidebarGroups,
    }
  }

  /**
   * 根据分类分组笔记
   * @param notes - 笔记信息数组
   * @returns 分类笔记映射
   */
  private groupNotesByCategory(notes: NoteInfo[]): Record<string, NoteInfo[]> {
    const grouped: Record<string, NoteInfo[]> = {}

    for (const note of notes) {
      const category = note.config.category || '未分类'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(note)
    }

    return grouped
  }

  /**
   * 生成简化的侧边栏配置（仅笔记列表）
   * @param notes - 笔记信息数组
   * @returns 侧边栏项数组
   */
  generateSimple(notes: NoteInfo[]): Array<{ text: string; link: string }> {
    return notes.map((note) => ({
      text: note.dirName,
      link: `/notes/${note.dirName}/README`,
    }))
  }
}
