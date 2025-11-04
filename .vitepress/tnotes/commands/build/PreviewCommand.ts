/**
 * .vitepress/tnotes/commands/build/PreviewCommand.ts
 *
 * 预览命令 - 使用 VitepressService
 */
import { BaseCommand } from '../BaseCommand'
import { VitepressService } from '../../services'

export class PreviewCommand extends BaseCommand {
  private vitepressService: VitepressService

  constructor() {
    super('preview', '预览构建后的知识库')
    this.vitepressService = new VitepressService()
  }

  protected async run(): Promise<void> {
    this.logger.info('启动预览服务器...')

    const pid = await this.vitepressService.preview()

    if (pid) {
      this.logger.success(`预览服务器已启动 (PID: ${pid})`)
    } else {
      this.logger.error('启动预览服务器失败')
    }
  }
}
