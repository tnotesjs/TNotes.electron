/**
 * .vitepress/tnotes/commands/note/NewCommand.ts
 *
 * 新建笔记命令 - 使用 NoteService
 */
import { BaseCommand } from '../BaseCommand'
import { NoteService, ReadmeService } from '../../services'
import * as readline from 'readline'

export class NewCommand extends BaseCommand {
  private noteService: NoteService
  private readmeService: ReadmeService

  constructor() {
    super('new', '新建一篇笔记')
    this.noteService = new NoteService()
    this.readmeService = new ReadmeService()
  }

  protected async run(): Promise<void> {
    this.logger.info('创建新笔记...')

    // 从用户输入获取笔记标题
    const title = await this.promptForTitle()

    if (!title) {
      this.logger.warn('未提供笔记标题，使用默认标题')
    }

    const note = await this.noteService.createNote({
      title: title || 'New Note',
      enableDiscussions: false,
    })

    this.logger.success(`笔记创建成功: ${note.dirName}`)
    this.logger.info(`笔记路径: ${note.path}`)
    this.logger.info(`笔记ID: ${note.id}`)

    // 自动更新索引文件（home README、sidebar.json、TOC.md）
    this.logger.info('正在更新知识库索引...')
    await this.readmeService.updateAllReadmes({
      updateSidebar: true,
      updateToc: true,
      updateHome: true,
    })
    this.logger.success('知识库索引更新完成')
  }

  /**
   * 提示用户输入笔记标题
   */
  private async promptForTitle(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise((resolve) => {
      rl.question('请输入笔记标题: ', (answer) => {
        rl.close()
        resolve(answer.trim())
      })
    })
  }
}
