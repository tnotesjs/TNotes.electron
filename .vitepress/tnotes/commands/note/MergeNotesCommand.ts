/**
 * .vitepress/tnotes/commands/note/MergeNotesCommand.ts
 *
 * 合并笔记命令 - 将所有笔记合并到一个文件
 */
import { BaseCommand } from '../BaseCommand'
import { MergeDistributeService } from '../../services'

export class MergeNotesCommand extends BaseCommand {
  private mergeDistributeService: MergeDistributeService

  constructor() {
    super('merge-notes', '合并知识库中的所有笔记到一个文件')
    this.mergeDistributeService = new MergeDistributeService()
  }

  protected async run(): Promise<void> {
    await this.mergeDistributeService.mergeNotes()
  }
}
