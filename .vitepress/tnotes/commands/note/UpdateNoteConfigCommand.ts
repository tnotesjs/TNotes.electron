/**
 * .vitepress/tnotes/commands/note/UpdateNoteConfigCommand.ts
 *
 * 更新笔记配置命令 - 用于在开发环境中更新笔记配置
 */
import { BaseCommand } from '../BaseCommand'
import { NoteService } from '../../services'
import type { NoteConfig } from '../../types'

interface UpdateConfigParams {
  noteId: string
  config: Partial<Pick<NoteConfig, 'done' | 'enableDiscussions' | 'deprecated'>>
}

export class UpdateNoteConfigCommand extends BaseCommand {
  private noteService: NoteService

  constructor() {
    super('update-note-config', '更新笔记配置')
    this.noteService = new NoteService()
  }

  protected async run(): Promise<void> {
    // 从命令行参数读取配置（用于 CLI 调用）
    const noteId = process.env.NOTE_ID
    const done = process.env.NOTE_DONE === 'true'
    const enableDiscussions = process.env.NOTE_DISCUSSIONS === 'true'
    const deprecated = process.env.NOTE_DEPRECATED === 'true'

    if (!noteId) {
      this.logger.error('缺少 NOTE_ID 参数')
      process.exit(1)
    }

    try {
      await this.updateConfig({
        noteId,
        config: {
          done,
          enableDiscussions,
          deprecated,
        },
      })

      this.logger.success(`笔记 ${noteId} 配置已更新`)
    } catch (error) {
      this.logger.error('更新配置失败', error)
      process.exit(1)
    }
  }

  /**
   * 更新笔记配置（可被外部调用）
   */
  async updateConfig(params: UpdateConfigParams): Promise<void> {
    const { noteId, config } = params

    // 验证笔记是否存在
    const note = this.noteService.getNoteById(noteId)
    if (!note) {
      throw new Error(`笔记未找到: ${noteId}`)
    }

    // 更新配置
    await this.noteService.updateNoteConfig(noteId, config)

    this.logger.info(`✅ 笔记 ${noteId} 配置已更新:`)
    this.logger.info(`  - 完成状态: ${config.done}`)
    this.logger.info(`  - 评论状态: ${config.enableDiscussions}`)
    this.logger.info(`  - 弃用状态: ${config.deprecated}`)
  }
}
