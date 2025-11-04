/**
 * .vitepress/tnotes/core/ReadmeGenerator.ts
 *
 * README 生成器 - 负责生成各种 README 内容
 */
import * as fs from 'fs'
import type { NoteInfo, NoteConfig } from '../types'
import { TocGenerator } from './TocGenerator'
import { ConfigManager } from '../config/ConfigManager'
import { logger } from '../utils/logger'
import { EOL } from '../config/constants'

/**
 * README 生成器类
 */
export class ReadmeGenerator {
  private tocGenerator: TocGenerator
  private configManager: ConfigManager

  constructor() {
    this.tocGenerator = new TocGenerator()
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 更新笔记 README
   * @param noteInfo - 笔记信息
   */
  updateNoteReadme(noteInfo: NoteInfo): void {
    if (!noteInfo.config) {
      logger.warn(`笔记 ${noteInfo.dirName} 缺少配置文件`)
      return
    }

    const content = fs.readFileSync(noteInfo.readmePath, 'utf-8')
    const lines = content.split(EOL)

    const repoName = this.configManager.get('repoName')
    this.tocGenerator.updateNoteToc(
      noteInfo.id,
      lines,
      noteInfo.config,
      repoName
    )

    const updatedContent = lines.join(EOL)
    fs.writeFileSync(noteInfo.readmePath, updatedContent, 'utf-8')
  }

  /**
   * 批量更新所有笔记 README
   * @param notes - 笔记信息数组
   */
  updateAllNoteReadmes(notes: NoteInfo[]): void {
    let successCount = 0
    let failCount = 0

    for (const note of notes) {
      try {
        this.updateNoteReadme(note)
        successCount++
      } catch (error) {
        logger.error(`更新笔记 ${note.dirName} 失败`, error)
        failCount++
      }
    }

    if (failCount > 0) {
      logger.warn(`更新完成：成功 ${successCount} 篇，失败 ${failCount} 篇`)
    } else {
      logger.info(`成功更新 ${successCount} 篇笔记`)
    }
  }

  /**
   * 生成首页 README 的笔记列表部分
   * @param notes - 笔记信息数组
   * @returns 笔记列表的 Markdown 内容
   */
  generateHomeNoteList(notes: NoteInfo[]): string {
    const titles: string[] = []
    const titlesNotesCount: number[] = []

    const repoName = this.configManager.get('repoName')
    const sidebarShowNoteId = this.configManager.get('sidebarShowNoteId')

    for (const note of notes) {
      const { dirName, config } = note
      if (!config) continue

      const notesID = config.id
      const notesName = dirName.replace(/^\d+\.\s*/, '') // 移除前缀编号

      const title = sidebarShowNoteId
        ? `## [${notesID}. ${notesName}](/notes/${dirName}/README.md)`
        : `## [${notesName}](/notes/${dirName}/README.md)`

      titles.push(title)
      titlesNotesCount.push(1)
    }

    return titles.join(EOL + EOL)
  }

  /**
   * 更新首页 README
   * 更新笔记链接的状态标记（[x] 或 [ ]），同时更新 TOC 区域
   * @param notes - 笔记信息数组
   * @param homeReadmePath - 首页 README 路径
   */
  updateHomeReadme(notes: NoteInfo[], homeReadmePath: string): void {
    if (!fs.existsSync(homeReadmePath)) {
      logger.error(`Home README not found: ${homeReadmePath}`)
      return
    }

    const content = fs.readFileSync(homeReadmePath, 'utf-8')
    const lines = content.split(EOL)

    // 创建笔记配置映射，以目录名为键
    const noteConfigMap = new Map<string, NoteConfig>()
    for (const note of notes) {
      if (note.config) {
        noteConfigMap.set(note.dirName, note.config)
      }
    }

    // 更新笔记链接的状态标记
    const titles: string[] = []
    const titlesNotesCount: number[] = []
    let inTocRegion = false
    let currentNoteCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // 跳过 TOC region (后面会重新生成)
      if (line.includes('<!-- region:toc -->')) {
        inTocRegion = true
        continue
      }
      if (line.includes('<!-- endregion:toc -->')) {
        inTocRegion = false
        continue
      }
      if (inTocRegion) {
        continue
      }

      // 匹配笔记链接: - [x] [0001. xxx](https://github.com/...)
      const noteMatch = line.match(
        /^- \[(.)\] \[(.+?)\]\((https:\/\/github\.com\/.+?\/notes\/(.+?)\/README(?:\.md)?)\)/
      )
      if (noteMatch) {
        const [fullMatch, oldStatus, text, url, encodedPath] = noteMatch
        const decodedPath = decodeURIComponent(encodedPath)
        const noteConfig = noteConfigMap.get(decodedPath)

        if (noteConfig) {
          // 根据配置更新状态标记
          let newStatus = ' ' // 默认未完成
          if (noteConfig.deprecated) {
            newStatus = 'x' // 弃用也标记为 x (后续可以在标题中加 ❌)
          } else if (noteConfig.done) {
            newStatus = 'x' // 已完成
          }

          // 更新状态标记
          if (oldStatus !== newStatus) {
            lines[i] = `- [${newStatus}] [${text}](${url})`
          }
        }

        currentNoteCount++
        continue
      }

      // 匹配标题: ## xxx
      const titleMatch = line.match(/^(#{2,})\s+(.+)$/)
      if (titleMatch) {
        // 保存上一个标题的笔记数量
        if (titles.length > 0) {
          titlesNotesCount.push(currentNoteCount)
        }

        titles.push(line)
        currentNoteCount = 0
      }
    }

    // 保存最后一个标题的笔记数量
    if (titles.length > 0) {
      titlesNotesCount.push(currentNoteCount)
    }

    // 更新 TOC 区域
    this.tocGenerator.updateHomeToc(lines, titles, titlesNotesCount)

    const updatedContent = lines.join(EOL)
    fs.writeFileSync(homeReadmePath, updatedContent, 'utf-8')

    logger.info('已更新首页 README')
  }

  /**
   * 生成笔记摘要信息
   * @param noteInfo - 笔记信息
   * @returns 笔记摘要文本
   */
  generateNoteSummary(noteInfo: NoteInfo): string {
    if (!noteInfo.config) {
      return `# ${noteInfo.dirName}\n\nNo configuration found.`
    }

    const { id, config } = noteInfo
    const bilibiliCount = config.bilibili.length
    const tnotesCount = config.tnotes.length
    const yuqueCount = config.yuque.length
    const status = config.done ? '✅ Complete' : '⏳ In Progress'

    return `# ${noteInfo.dirName}

**ID**: ${id}
**Status**: ${status}
**Deprecated**: ${config.deprecated ? 'Yes' : 'No'}
**Discussions**: ${config.enableDiscussions ? 'Enabled' : 'Disabled'}

**External Resources**:
- Bilibili videos: ${bilibiliCount}
- TNotes references: ${tnotesCount}
- Yuque articles: ${yuqueCount}

**Created**: ${new Date(config.created_at).toLocaleString()}
**Updated**: ${new Date(config.updated_at).toLocaleString()}
`
  }
}
