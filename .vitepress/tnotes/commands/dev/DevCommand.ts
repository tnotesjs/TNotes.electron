/**
 * .vitepress/tnotes/commands/dev/DevCommand.ts
 *
 * 开发服务器命令 - 使用 VitepressService 和 FileWatcherService
 */
import { BaseCommand } from '../BaseCommand'
import { VitepressService, serviceManager } from '../../services'

export class DevCommand extends BaseCommand {
  private vitepressService: VitepressService

  constructor() {
    super('dev', '启动知识库开发服务')
    this.vitepressService = new VitepressService()
  }

  protected async run(): Promise<void> {
    this.logger.info('服务启动中...')

    // 启动 VitePress 服务器
    const pid = await this.vitepressService.startServer()

    if (pid) {
      const newStatus = this.vitepressService.getServerStatus()
      this.logger.success(`服务器已启动 - PID: ${pid}`)
      if (newStatus.port) {
        this.logger.info(`🔗 访问地址：`)
        this.logger.info(`  http://localhost:${newStatus.port}`)
      }

      this.logger.info('启用自动更新模式...')
      const fileWatcherService = serviceManager.getFileWatcherService()
      fileWatcherService.start()
      this.logger.info('💡 提示: ')
      this.logger.info(
        `修改笔记后保存笔记文件（README.md），笔记的目录将会自动更新`
      )
    } else {
      this.logger.error('启动服务器失败')
    }
  }
}
