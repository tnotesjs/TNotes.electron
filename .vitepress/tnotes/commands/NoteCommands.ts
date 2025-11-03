/**
 * .vitepress/tnotes/commands/NoteCommands.ts
 *
 * 笔记相关命令
 */
import { BaseCommand } from './BaseCommand'
import { newNotes } from '../newNotes'
import { mergeNotes, distributeNotes } from '../mergeDistribute'

export class NewCommand extends BaseCommand {
  constructor() {
    super('new', '新建一篇笔记')
  }

  protected async run(): Promise<void> {
    newNotes()
  }
}

export class MergeCommand extends BaseCommand {
  constructor() {
    super('merge', '合并知识库中的所有笔记到一个文件')
  }

  protected async run(): Promise<void> {
    mergeNotes()
  }
}

export class DistributeCommand extends BaseCommand {
  constructor() {
    super('distribute', '分发 MERGED_README.md 文件中的内容到各笔记中')
  }

  protected async run(): Promise<void> {
    distributeNotes()
  }
}
