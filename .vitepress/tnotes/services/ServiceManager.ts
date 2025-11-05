/**
 * .vitepress/tnotes/services/ServiceManager.ts
 *
 * 服务管理器 - 管理全局共享服务实例
 */
import { FileWatcherService } from './FileWatcherService'

/**
 * 全局服务实例管理
 */
class ServiceManager {
  private static instance: ServiceManager
  private fileWatcherService: FileWatcherService | null = null

  private constructor() {}

  /**
   * 获取 ServiceManager 单例
   */
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager()
    }
    return ServiceManager.instance
  }

  /**
   * 获取 FileWatcherService 实例（如果不存在则创建）
   */
  getFileWatcherService(): FileWatcherService {
    if (!this.fileWatcherService) {
      this.fileWatcherService = new FileWatcherService()
    }
    return this.fileWatcherService
  }

  /**
   * 检查 FileWatcherService 是否存在且正在运行
   */
  isFileWatcherActive(): boolean {
    return this.fileWatcherService?.isWatching() ?? false
  }
}

export const serviceManager = ServiceManager.getInstance()
