/**
 * .vitepress/tnotes/services/ReadmeService.ts
 *
 * README 服务 - 封装 README 更新相关的业务逻辑
 */
import type { NoteInfo } from '../types'
import { NoteManager } from '../core/NoteManager'
import { ReadmeGenerator } from '../core/ReadmeGenerator'
import { SidebarGenerator } from '../core/SidebarGenerator'
import { ConfigManager } from '../config/ConfigManager'
import { logger } from '../utils/logger'
import { ROOT_README_PATH, VP_SIDEBAR_PATH } from '../config/constants'
import * as fs from 'fs'

/**
 * README 更新选项
 */
export interface UpdateReadmeOptions {
  updateSidebar?: boolean
  updateHome?: boolean
}

/**
 * README 服务类
 */
export class ReadmeService {
  private noteManager: NoteManager
  private readmeGenerator: ReadmeGenerator
  private sidebarGenerator: SidebarGenerator
  private configManager: ConfigManager

  constructor() {
    this.noteManager = new NoteManager()
    this.readmeGenerator = new ReadmeGenerator()
    this.sidebarGenerator = new SidebarGenerator()
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 更新所有笔记的 README
   * @param options - 更新选项
   */
  async updateAllReadmes(options: UpdateReadmeOptions = {}): Promise<void> {
    const { updateSidebar = true, updateHome = true } = options

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

    // 5. 更新首页 README（始终更新）
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

    // 直接根据 ID 获取笔记信息，避免扫描所有笔记
    const notesToUpdate: NoteInfo[] = []

    for (const noteId of noteIds) {
      const note = this.noteManager.getNoteById(noteId)
      if (note) {
        notesToUpdate.push(note)
      } else {
        logger.warn(`笔记未找到: ${noteId}`)
      }
    }

    if (notesToUpdate.length === 0) {
      logger.warn('没有找到需要更新的笔记')
      return
    }

    // 只更新笔记的 README 内容（TOC 等）
    for (const note of notesToUpdate) {
      try {
        this.readmeGenerator.updateNoteReadme(note)
      } catch (error) {
        logger.error(`更新笔记 ${note.dirName} 失败`, error)
      }
    }
  }

  /**
   * 只更新全局文件（sidebar、README）
   * 用于文件夹重命名等场景
   * @param notes - 所有笔记信息数组
   */
  async updateGlobalFiles(notes: NoteInfo[]): Promise<void> {
    // 对于文件夹重命名，需要更新 README.md 中的链接
    // 但 updateHomeReadme 只能检测"缺失"和"移除"，无法识别"重命名"
    // 所以需要特殊处理：更新 README.md 中所有笔记链接的路径
    await this.updateHomeReadmeForRename(notes)

    // 2. 更新侧边栏配置（基于更新后的 README.md）
    await this.updateSidebar(notes)
  }

  /**
   * 更新首页 README（专门用于文件夹重命名场景）
   * 保持原有章节结构，只更新笔记链接的路径和文本
   * @param notes - 所有笔记信息数组
   */
  private async updateHomeReadmeForRename(notes: NoteInfo[]): Promise<void> {
    if (!fs.existsSync(ROOT_README_PATH)) {
      logger.error('未找到首页 README')
      return
    }

    const content = fs.readFileSync(ROOT_README_PATH, 'utf-8')
    const lines = content.split('\n')

    // 创建笔记映射：ID -> NoteInfo
    const noteByIdMap = new Map<string, NoteInfo>()
    for (const note of notes) {
      noteByIdMap.set(note.id, note)
    }

    let inTocRegion = false
    const titles: string[] = []
    const titlesNotesCount: number[] = []
    let currentNoteCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // 跳过 TOC region
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

      // 匹配笔记链接（可能带 ❌ 标记）
      const noteMatch = line.match(
        /^- \[(.)\] \[(.+?)\]\((https:\/\/github\.com\/.+?\/notes\/(.+?)\/README(?:\.md)?)\)(\s*❌)?/
      )
      if (noteMatch) {
        const [, status, oldText, , encodedPath] = noteMatch
        const decodedPath = decodeURIComponent(encodedPath)

        // 提取笔记 ID
        const idMatch = decodedPath.match(/^(\d{4})\./)
        if (idMatch) {
          const noteId = idMatch[1]
          const note = noteByIdMap.get(noteId)

          if (note) {
            // 找到对应的笔记，更新链接
            const newEncodedPath = encodeURIComponent(note.dirName)
            const newUrl = `https://github.com/tnotesjs/TNotes.introduction/tree/main/notes/${newEncodedPath}/README.md`

            // 根据配置更新状态和标记
            let newStatus = ' '
            let deprecatedMark = ''

            if (note.config) {
              if (note.config.deprecated) {
                newStatus = ' ' // 弃用的笔记，复选框不勾选
                deprecatedMark = ' ❌' // 添加弃用标记
              } else if (note.config.done) {
                newStatus = 'x' // 完成的笔记，勾选复选框
              }
            }

            lines[
              i
            ] = `- [${newStatus}] [${note.dirName}](${newUrl})${deprecatedMark}`
            currentNoteCount++
          } else {
            // 笔记不存在，保持原样（后续会被移除）
            logger.warn(`笔记不存在: ${noteId}`)
          }
        }
        continue
      }

      // 匹配标题
      const titleMatch = line.match(/^(#{2,})\s+(.+)$/)
      if (titleMatch) {
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

    // 更新 TOC 区域（内联实现，不再依赖 TocGenerator）
    const { generateToc } = await import('../utils/markdown')
    let startLineIdx = -1,
      endLineIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<!-- region:toc -->')) startLineIdx = i
      if (lines[i].includes('<!-- endregion:toc -->')) endLineIdx = i
    }
    if (startLineIdx !== -1 && endLineIdx !== -1) {
      const toc = generateToc(titles, 1)
      const tocLines = toc.split('\n')
      lines.splice(startLineIdx + 1, endLineIdx - startLineIdx - 1, ...tocLines)
    }

    const updatedContent = lines.join('\n')
    fs.writeFileSync(ROOT_README_PATH, updatedContent, 'utf-8')
    logger.info('已更新首页 README')
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
