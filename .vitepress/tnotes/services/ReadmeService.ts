/**
 * .vitepress/tnotes/services/ReadmeService.ts
 *
 * README 服务 - 封装 README 更新相关的业务逻辑
 */
import type { NoteInfo } from '../types'
import { NoteManager } from '../core/NoteManager'
import { ReadmeGenerator } from '../core/ReadmeGenerator'
import { SidebarGenerator } from '../core/SidebarGenerator'
import { TocGenerator } from '../core/TocGenerator'
import { ConfigManager } from '../config/ConfigManager'
import { logger } from '../utils/logger'
import {
  ROOT_README_PATH,
  VP_SIDEBAR_PATH,
  VP_TOC_PATH,
} from '../config/constants'
import * as fs from 'fs'

/**
 * README 更新选项
 */
export interface UpdateReadmeOptions {
  updateSidebar?: boolean
  updateToc?: boolean
  updateHome?: boolean
}

/**
 * README 服务类
 */
export class ReadmeService {
  private noteManager: NoteManager
  private readmeGenerator: ReadmeGenerator
  private sidebarGenerator: SidebarGenerator
  private tocGenerator: TocGenerator
  private configManager: ConfigManager

  constructor() {
    this.noteManager = new NoteManager()
    this.readmeGenerator = new ReadmeGenerator()
    this.sidebarGenerator = new SidebarGenerator()
    this.tocGenerator = new TocGenerator()
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 更新所有笔记的 README
   * @param options - 更新选项
   */
  async updateAllReadmes(options: UpdateReadmeOptions = {}): Promise<void> {
    const {
      updateSidebar = true,
      updateToc = true,
      updateHome = true,
    } = options

    logger.info('开始更新知识库...')

    // 1. 扫描所有笔记
    const notes = this.noteManager.scanNotes()
    logger.info(`扫描到 ${notes.length} 篇笔记`)

    // 2. 检测变更的笔记（增量更新优化）
    const changedIds = await this.getChangedNoteIds()
    const shouldIncrementalUpdate =
      changedIds.size > 0 && changedIds.size < notes.length * 0.3 // 少于30%变更才增量更新

    let notesToUpdate = notes
    if (shouldIncrementalUpdate) {
      notesToUpdate = notes.filter((note) => changedIds.has(note.id))
      logger.info(`检测到 ${changedIds.size} 篇笔记有变更，使用增量更新模式`)
    } else {
      logger.info('使用全量更新模式')
    }

    // 3. 并行更新笔记的 README
    const startTime = Date.now()
    await this.updateNoteReadmesInParallel(notesToUpdate)
    const updateTime = Date.now() - startTime

    logger.info(`更新了 ${notesToUpdate.length} 篇笔记 (耗时 ${updateTime}ms)`)

    // 4. 更新侧边栏配置（始终更新，因为需要全局视图）
    if (updateSidebar) {
      await this.updateSidebar(notes)
    }

    // 5. 更新目录文件（始终更新）
    if (updateToc) {
      await this.updateTocFile(notes)
    }

    // 6. 更新首页 README（始终更新）
    if (updateHome) {
      await this.updateHomeReadme(notes)
    }

    logger.info('知识库更新完成！')
  }

  /**
   * 只更新指定笔记的 README（不更新 sidebar、TOC、home）
   * @param noteIds - 笔记 ID 数组
   */
  async updateNoteReadmesOnly(noteIds: string[]): Promise<void> {
    if (noteIds.length === 0) return

    // 1. 扫描所有笔记
    const allNotes = this.noteManager.scanNotes()

    // 2. 过滤出需要更新的笔记
    const notesToUpdate = allNotes.filter((note) => noteIds.includes(note.id))

    if (notesToUpdate.length === 0) {
      logger.warn('没有找到需要更新的笔记')
      return
    }

    // 3. 只更新笔记的 README 内容（TOC 等）
    for (const note of notesToUpdate) {
      try {
        this.readmeGenerator.updateNoteReadme(note)
      } catch (error) {
        logger.error(`更新笔记 ${note.dirName} 失败`, error)
      }
    }
  }

  /**
   * 获取变更的笔记 ID 集合
   * @returns 变更的笔记 ID 集合
   */
  private async getChangedNoteIds(): Promise<Set<string>> {
    try {
      const { getChangedIds } = await import('../utils/getChangedIds')
      return getChangedIds()
    } catch (error) {
      // 如果获取失败（比如不在 Git 仓库中），返回空集合，触发全量更新
      return new Set()
    }
  }

  /**
   * 并行更新多个笔记的 README
   * @param notes - 笔记信息数组
   */
  private async updateNoteReadmesInParallel(notes: NoteInfo[]): Promise<void> {
    const batchSize = 10 // 每批处理10个，避免过多并发
    const batches: NoteInfo[][] = []

    for (let i = 0; i < notes.length; i += batchSize) {
      batches.push(notes.slice(i, i + batchSize))
    }

    let successCount = 0
    let failCount = 0

    for (const batch of batches) {
      const results = await Promise.allSettled(
        batch.map((note) =>
          Promise.resolve().then(() => {
            this.readmeGenerator.updateNoteReadme(note)
          })
        )
      )

      for (const result of results) {
        if (result.status === 'fulfilled') {
          successCount++
        } else {
          failCount++
          logger.error('更新笔记失败', result.reason)
        }
      }
    }

    if (failCount > 0) {
      logger.warn(`更新完成：成功 ${successCount} 篇，失败 ${failCount} 篇`)
    }
  }

  /**
   * 更新单个笔记的 README
   * @param noteId - 笔记ID
   */
  async updateNoteReadme(noteId: string): Promise<void> {
    const note = this.noteManager.getNoteById(noteId)
    if (!note) {
      throw new Error(`Note not found: ${noteId}`)
    }

    this.readmeGenerator.updateNoteReadme(note)
    logger.info(`Updated README for note: ${noteId}`)
  }

  /**
   * 更新侧边栏配置
   * @param notes - 笔记信息数组
   */
  private async updateSidebar(notes: NoteInfo[]): Promise<void> {
    // 读取 README.md 解析层次结构
    if (!fs.existsSync(ROOT_README_PATH)) {
      logger.error('未找到首页 README，无法生成侧边栏')
      return
    }

    const content = fs.readFileSync(ROOT_README_PATH, 'utf-8')
    const lines = content.split('\n')

    // 解析 README.md 的层次结构
    const { genHierarchicalSidebar } = await import(
      '../utils/genHierarchicalSidebar'
    )

    const itemList: Array<{ text: string; link: string }> = []
    const titles: string[] = []
    const titlesNotesCount: number[] = []

    let currentNoteCount = 0
    let inTocRegion = false

    for (const line of lines) {
      // 跳过 toc region
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
        /^- \[.\] \[(.+?)\]\(https:\/\/github\.com\/.+?\/notes\/(.+?)\/README(?:\.md)?\)/
      )
      if (noteMatch) {
        const [, text, encodedPath] = noteMatch
        // 解码路径，例如 0001.%20TNotes%20简介 -> 0001. TNotes 简介
        const decodedPath = decodeURIComponent(encodedPath)

        // 获取笔记配置，添加状态 emoji
        const note = notes.find((n) => n.dirName === decodedPath)
        let statusEmoji = '⏰ ' // 默认未完成
        if (note?.config) {
          if (note.config.deprecated) {
            statusEmoji = '❌ '
          } else if (note.config.done) {
            statusEmoji = '✅ '
          }
        }

        // 处理笔记 ID 显示
        const sidebarShowNoteId = this.configManager.get('sidebarShowNoteId')
        let displayText = text
        if (!sidebarShowNoteId) {
          // 移除笔记 ID (0001. )
          displayText = text.replace(/^\d{4}\.\s/, '')
        }

        itemList.push({
          text: statusEmoji + displayText,
          link: `/notes/${decodedPath}/README`,
        })
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

    // Sidebar 默认全部折叠
    const sidebarIsCollapsed = true
    const hierarchicalSidebar = genHierarchicalSidebar(
      itemList,
      titles,
      titlesNotesCount,
      sidebarIsCollapsed
    )

    // 写入 sidebar.json
    fs.writeFileSync(
      VP_SIDEBAR_PATH,
      JSON.stringify(hierarchicalSidebar, null, 2),
      'utf-8'
    )

    logger.info('已更新侧边栏配置')
  }
  /**
   * 更新目录文件 (TOC.md)
   * 从 README.md 提取内容，移除 region:toc 区域
   * @param notes - 笔记信息数组
   */
  private async updateTocFile(notes: NoteInfo[]): Promise<void> {
    if (!fs.existsSync(ROOT_README_PATH)) {
      logger.error('未找到首页 README，无法生成目录')
      return
    }

    const content = fs.readFileSync(ROOT_README_PATH, 'utf-8')
    const lines = content.split('\n')

    // 找到 region:toc 区域
    let startIdx = -1
    let endIdx = -1

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<!-- region:toc -->')) {
        startIdx = i
      }
      if (lines[i].includes('<!-- endregion:toc -->')) {
        endIdx = i
        break
      }
    }

    if (startIdx === -1 || endIdx === -1) {
      logger.warn('未找到 region:toc 区域，使用完整内容')
      fs.writeFileSync(VP_TOC_PATH, content, 'utf-8')
      logger.info('已更新目录文件')
      return
    }

    // 移除 region:toc 区域，保留其他内容
    const tocLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx + 1)]

    // 生成 TOC.md 内容
    const tocContent = tocLines.join('\n')

    fs.writeFileSync(VP_TOC_PATH, tocContent, 'utf-8')
    logger.info('已更新目录文件')
  }

  /**
   * 更新首页 README
   * @param notes - 笔记信息数组
   */
  private async updateHomeReadme(notes: NoteInfo[]): Promise<void> {
    this.readmeGenerator.updateHomeReadme(notes, ROOT_README_PATH)
  }

  /**
   * 生成 VitePress 文档
   * @returns 生成的文件路径数组
   */
  async generateVitepressDocs(): Promise<string[]> {
    const notes = this.noteManager.scanNotes()
    const generatedFiles: string[] = []

    // 更新侧边栏
    await this.updateSidebar(notes)
    generatedFiles.push(VP_SIDEBAR_PATH)

    // 更新目录
    await this.updateTocFile(notes)
    generatedFiles.push(VP_TOC_PATH)

    // 更新首页
    await this.updateHomeReadme(notes)
    generatedFiles.push(ROOT_README_PATH)

    logger.info(`Generated ${generatedFiles.length} files`)
    return generatedFiles
  }

  /**
   * 验证所有 README 文件是否存在
   * @returns 验证结果 { valid: 有效数量, missing: 缺失数量 }
   */
  validateReadmeFiles(): { valid: number; missing: number } {
    const notes = this.noteManager.scanNotes()
    let valid = 0
    let missing = 0

    for (const note of notes) {
      if (fs.existsSync(note.readmePath)) {
        valid++
      } else {
        missing++
        logger.warn(`README missing for note: ${note.dirName}`)
      }
    }

    logger.info(`Validation complete: ${valid} valid, ${missing} missing`)
    return { valid, missing }
  }
}
