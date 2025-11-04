/**
 * .vitepress/tnotes/services/VitepressService.ts
 *
 * VitePress 服务 - 封装 VitePress 开发服务器相关的业务逻辑
 */
import { ProcessManager } from '../lib/ProcessManager'
import { ConfigManager } from '../config/ConfigManager'
import { logger } from '../utils/logger'
import { VITEPRESS_PID_FILENAME, ROOT_DIR_PATH } from '../config/constants'
import { runCommand } from '../utils/command'
import * as path from 'path'

/**
 * VitePress 服务类
 */
export class VitepressService {
  private processManager: ProcessManager
  private configManager: ConfigManager
  private readonly pidFile: string

  constructor() {
    this.processManager = new ProcessManager()
    this.configManager = ConfigManager.getInstance()
    this.pidFile = path.join(ROOT_DIR_PATH, VITEPRESS_PID_FILENAME)
  }

  /**
   * 启动 VitePress 开发服务器
   * @returns 进程ID
   */
  async startServer(): Promise<number | undefined> {
    const port = this.configManager.get('port')
    const processId = 'vitepress-dev'

    // 先检查 PID 文件中是否有正在运行的进程
    const existingPid = await this.readPidFile()
    if (existingPid && this.isProcessRunning(existingPid)) {
      logger.warn(`检测到已有服务运行 (PID: ${existingPid})，正在停止旧服务...`)
      // 停止旧服务
      try {
        process.kill(existingPid, 'SIGTERM')
        // 等待进程结束
        await new Promise((resolve) => setTimeout(resolve, 1000))
        logger.info('旧服务已停止')
      } catch (error) {
        logger.error('停止旧服务失败', error)
      }
      await this.removePidFile()
    }

    // 如果有残留的 PID 文件但进程不存在，清理它
    if (existingPid && !this.isProcessRunning(existingPid)) {
      logger.info(`清理残留的 PID 文件 (进程 ${existingPid} 已不存在)`)
      await this.removePidFile()
    }

    // 检查内存中的进程管理器（清理残留）
    if (
      this.processManager.has(processId) &&
      this.processManager.isRunning(processId)
    ) {
      this.processManager.kill(processId)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // 启动 VitePress 开发服务器（使用 inherit 以显示日志）
    const command = 'pnpm'
    const args = ['vitepress', 'dev', '--port', port.toString()]
    logger.info(`执行命令：${command} ${args.join(' ')}`)

    const processInfo = this.processManager.spawn(processId, command, args, {
      cwd: ROOT_DIR_PATH,
      stdio: 'inherit', // 继承当前进程的 stdio，显示所有日志
    })

    // 将 PID 写入文件
    await this.writePidFile(processInfo.pid!)

    return processInfo.pid
  }

  /**
   * 停止 VitePress 开发服务器
   */
  async stopServer(): Promise<void> {
    const processId = 'vitepress-dev'

    // 先尝试从 PID 文件读取
    const pidFromFile = await this.readPidFile()
    if (pidFromFile && this.isProcessRunning(pidFromFile)) {
      logger.info(`正在停止 VitePress 服务 (PID: ${pidFromFile})...`)
      try {
        process.kill(pidFromFile, 'SIGTERM')
        await this.removePidFile()
        logger.info('VitePress 服务已成功停止')
        return
      } catch (error) {
        logger.error('停止 VitePress 服务失败', error)
      }
    }

    // 如果 PID 文件中没有，尝试从内存中的进程管理器
    if (!this.processManager.has(processId)) {
      // 清理可能残留的 PID 文件
      await this.removePidFile()
      logger.warn('没有正在运行的 VitePress 服务')
      return
    }

    const processInfo = this.processManager.get(processId)
    logger.info(`正在停止 VitePress 服务 (PID: ${processInfo?.pid})...`)

    const killed = this.processManager.kill(processId)

    if (killed) {
      await this.removePidFile()
      logger.info('VitePress 服务已成功停止')
    } else {
      logger.error('停止 VitePress 服务失败')
    }
  }

  /**
   * 重启 VitePress 开发服务器
   */
  async restartServer(): Promise<number | undefined> {
    await this.stopServer()

    // 等待一小段时间确保端口释放
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return await this.startServer()
  }

  /**
   * 检查服务器是否正在运行
   * @returns 是否运行中
   */
  isServerRunning(): boolean {
    const processId = 'vitepress-dev'
    return (
      this.processManager.has(processId) &&
      this.processManager.isRunning(processId)
    )
  }

  /**
   * 获取服务器状态
   * @returns 服务器状态信息
   */
  getServerStatus(): {
    running: boolean
    pid?: number
    port?: number
    uptime?: number
  } {
    const processId = 'vitepress-dev'
    const port = this.configManager.get('port')

    // 先检查 PID 文件（同步版本）
    try {
      const fs = require('fs')
      if (fs.existsSync(this.pidFile)) {
        const content = fs.readFileSync(this.pidFile, 'utf-8')
        const pid = parseInt(content.trim(), 10)
        if (!isNaN(pid) && this.isProcessRunning(pid)) {
          return {
            running: true,
            pid,
            port,
          }
        }
      }
    } catch {
      // 忽略错误，继续检查内存中的进程管理器
    }

    // 检查内存中的进程管理器
    const processInfo = this.processManager.get(processId)

    if (!processInfo || !this.processManager.isRunning(processId)) {
      return { running: false }
    }

    const uptime = Date.now() - processInfo.startTime

    return {
      running: true,
      pid: processInfo.pid,
      port,
      uptime,
    }
  }

  /**
   * 构建生产版本
   */
  async build(): Promise<void> {
    const command = 'pnpm vitepress build'
    logger.info(`执行命令：${command}`)
    logger.info('正在构建 VitePress 站点...')

    try {
      await runCommand(command, ROOT_DIR_PATH)
      logger.info('构建完成')
    } catch (error) {
      logger.error('构建失败', error)
      throw error
    }
  }

  /**
   * 预览构建后的站点
   */
  async preview(): Promise<number | undefined> {
    const processId = 'vitepress-preview'
    const command = 'pnpm'
    const args = ['vitepress', 'preview']
    logger.info(`执行命令：${command} ${args.join(' ')}`)
    logger.info('正在启动预览服务...')

    const processInfo = this.processManager.spawn(processId, command, args, {
      cwd: ROOT_DIR_PATH,
      stdio: 'inherit',
    })

    logger.info(`预览服务已启动 (PID: ${processInfo.pid})`)
    return processInfo.pid
  }

  /**
   * 清理所有 VitePress 进程
   */
  async cleanup(): Promise<void> {
    const processes = this.processManager.getAllProcesses()
    const vitepressProcesses = processes.filter((p) =>
      p.command.includes('vitepress')
    )

    if (vitepressProcesses.length === 0) {
      logger.info('没有需要清理的 VitePress 进程')
      return
    }

    logger.info(`正在清理 ${vitepressProcesses.length} 个 VitePress 进程...`)

    for (const process of vitepressProcesses) {
      this.processManager.kill(process.id)
    }

    logger.info('清理完成')
  }

  /**
   * 显示服务器日志（占位方法，实际实现需要日志收集机制）
   */
  showLogs(): void {
    const status = this.getServerStatus()

    if (!status.running) {
      logger.info('服务器未运行')
      return
    }

    logger.info('服务器状态:')
    logger.info(`  PID: ${status.pid}`)
    logger.info(`  端口: ${status.port}`)
    logger.info(`  运行时间: ${status.uptime}ms`)
    logger.info(`  访问地址: http://localhost:${status.port}`)
  }

  /**
   * 读取 PID 文件
   * @returns PID 或 undefined
   */
  private async readPidFile(): Promise<number | undefined> {
    const fs = await import('fs/promises')
    try {
      const content = await fs.readFile(this.pidFile, 'utf-8')
      const pid = parseInt(content.trim(), 10)
      return isNaN(pid) ? undefined : pid
    } catch {
      return undefined
    }
  }

  /**
   * 写入 PID 文件
   * @param pid - 进程ID
   */
  private async writePidFile(pid: number): Promise<void> {
    const fs = await import('fs/promises')
    try {
      await fs.writeFile(this.pidFile, pid.toString(), 'utf-8')
    } catch (error) {
      logger.error('写入 PID 文件失败', error)
    }
  }

  /**
   * 删除 PID 文件
   */
  private async removePidFile(): Promise<void> {
    const fs = await import('fs/promises')
    try {
      await fs.unlink(this.pidFile)
    } catch {
      // 文件可能不存在，忽略错误
    }
  }

  /**
   * 检查进程是否正在运行
   * @param pid - 进程ID
   * @returns 是否运行中
   */
  private isProcessRunning(pid: number): boolean {
    try {
      // process.kill(pid, 0) 不会真正杀死进程，只是检查进程是否存在
      process.kill(pid, 0)
      return true
    } catch {
      return false
    }
  }
}
