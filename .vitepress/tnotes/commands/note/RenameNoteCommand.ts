/**
 * .vitepress/tnotes/commands/note/RenameNoteCommand.ts
 *
 * 重命名笔记命令 - 用于在开发环境中重命名笔记文件夹
 */
import * as fs from 'fs'
import * as path from 'path'
import { BaseCommand } from '../BaseCommand'
import { NoteService } from '../../services'
import { ReadmeService } from '../../services/ReadmeService'
import { validateNoteTitle } from '../../utils/validators'
import {
  NOTES_PATH,
  README_FILENAME,
  REPO_NOTES_URL,
} from '../../config/constants'
import { generateNoteTitle } from '../../config/templates'

interface RenameNoteParams {
  noteId: string
  newTitle: string
}

export class RenameNoteCommand extends BaseCommand {
  private noteService: NoteService
  private readmeService: ReadmeService

  constructor() {
    super('rename-note', '重命名笔记')
    this.noteService = new NoteService()
    this.readmeService = new ReadmeService()
  }

  protected async run(): Promise<void> {
    // 从命令行参数读取
    const noteId = process.env.NOTE_ID
    const newTitle = process.env.NOTE_TITLE

    if (!noteId || !newTitle) {
      this.logger.error('缺少 NOTE_ID 或 NOTE_TITLE 参数')
      process.exit(1)
    }

    try {
      await this.renameNote({ noteId, newTitle })
      this.logger.success(`笔记 ${noteId} 已重命名为: ${newTitle}`)
    } catch (error) {
      this.logger.error('重命名失败', error)
      process.exit(1)
    }
  }

  /**
   * 重命名笔记（可被外部调用）
   */
  async renameNote(params: RenameNoteParams): Promise<void> {
    const { noteId, newTitle } = params

    // 验证笔记是否存在
    const note = this.noteService.getNoteById(noteId)
    if (!note) {
      throw new Error(`笔记未找到: ${noteId}`)
    }

    // 验证新标题
    const validation = validateNoteTitle(newTitle)
    if (!validation.valid) {
      throw new Error(validation.error || '标题格式无效')
    }

    // 构建新的文件夹名称
    const newDirName = `${noteId}. ${newTitle.trim()}`
    const newPath = path.join(NOTES_PATH, newDirName)

    // 检查新路径是否已存在
    if (fs.existsSync(newPath)) {
      throw new Error(`目标文件夹已存在: ${newDirName}`)
    }

    // 重命名文件夹
    try {
      fs.renameSync(note.path, newPath)
      this.logger.info(`✅ 文件夹已重命名:`)
      this.logger.info(`  原名称: ${note.dirName}`)
      this.logger.info(`  新名称: ${newDirName}`)
    } catch (error) {
      throw new Error(
        `重命名文件夹失败: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    // 更新笔记内部的标题（README.md 第一行）
    try {
      this.logger.info('正在更新笔记内部标题...')
      const readmePath = path.join(newPath, README_FILENAME)

      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf-8')
        const lines = content.split('\n')

        // 查找第一个一级标题
        let h1Index = -1
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('# ')) {
            h1Index = i
            break
          }
        }

        if (h1Index !== -1) {
          // 生成新的标题
          const newH1 = generateNoteTitle(
            noteId,
            newTitle.trim(),
            REPO_NOTES_URL
          )
          lines[h1Index] = newH1

          // 写回文件
          fs.writeFileSync(readmePath, lines.join('\n'), 'utf-8')
          this.logger.success('✅ 笔记标题已更新')
        } else {
          this.logger.warn(
            `⚠️  笔记标题格式不符合规范，未找到一级标题，请手动检查修正: ${readmePath}`
          )
        }
      }
    } catch (error) {
      this.logger.warn('⚠️  更新笔记标题时出错:', error)
    }

    // 重命名成功后,更新全局 README.md 和 sidebar.json
    try {
      this.logger.info('正在更新全局 README.md 和 sidebar.json...')

      // 重新扫描笔记以获取最新状态
      const allNotes = this.noteService.getAllNotes()

      // 更新 README.md 和 sidebar.json
      await this.readmeService.updateAllReadmes({
        updateHome: true,
        updateSidebar: true,
      })

      this.logger.success('✅ 全局文件已更新')
    } catch (error) {
      this.logger.warn('⚠️  文件夹重命名成功,但更新全局文件时出错:', error)
      // 不抛出错误,因为主要任务(重命名)已完成
    }
  }
}
