/**
 * .vitepress/tnotes/commands/note/SplitNotesCommand.ts
 *
 * 拆分笔记命令 - 将合并的文件分发到各笔记
 */
import { BaseCommand } from '../BaseCommand'
import { MergeDistributeService } from '../../services'

export class SplitNotesCommand extends BaseCommand {
  private mergeDistributeService: MergeDistributeService

  constructor() {
    super('split-notes', '分发 MERGED_README.md 文件中的内容到各笔记中')
    this.mergeDistributeService = new MergeDistributeService()
  }

  protected async run(): Promise<void> {
    await this.mergeDistributeService.distributeNotes()
  }
}
