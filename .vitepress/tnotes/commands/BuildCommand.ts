/**
 * .vitepress/tnotes/commands/BuildCommand.ts
 *
 * 构建命令
 */
import { BaseCommand } from './BaseCommand'
import { runCommandSpawn } from '../utils'
import { ROOT_DIR_PATH } from '../constants'

export class BuildCommand extends BaseCommand {
  constructor() {
    super('build', '构建知识库')
  }

  protected async run(): Promise<void> {
    await runCommandSpawn('vitepress build', ROOT_DIR_PATH)
  }
}
