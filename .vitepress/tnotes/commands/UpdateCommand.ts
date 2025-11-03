/**
 * .vitepress/tnotes/commands/UpdateCommand.ts
 *
 * 更新命令
 */
import { BaseCommand } from './BaseCommand'
import ReadmeUpdater from '../ReadmeUpdater'

export class UpdateCommand extends BaseCommand {
  constructor() {
    super('update', '根据笔记内容更新知识库')
  }

  protected async run(): Promise<void> {
    const updater = new ReadmeUpdater()
    await updater.updateReadme()
  }
}
