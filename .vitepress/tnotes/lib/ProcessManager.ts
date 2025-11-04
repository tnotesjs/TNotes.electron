/**
 * .vitepress/tnotes/lib/ProcessManager.ts
 *
 * 进程管理器 - 管理子进程的生命周期
 */
import { spawn, ChildProcess } from 'child_process'
import type { SpawnOptions } from 'child_process'
import { Logger } from '../utils/logger'

/**
 * 进程信息接口
 */
export interface ProcessInfo {
  id: string
  pid?: number
  command: string
  args: string[]
  startTime: number
  process: ChildProcess
}

/**
 * 进程管理器类
 */
export class ProcessManager {
  private processes: Map<string, ProcessInfo> = new Map()
  private logger: Logger

  constructor(logger?: Logger) {
    this.logger = logger?.child('process') || new Logger({ prefix: 'process' })

    // 清理进程在程序退出时
    process.on('exit', () => {
      this.killAll()
    })

    process.on('SIGINT', () => {
      this.killAll()
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      this.killAll()
      process.exit(0)
    })
  }

  /**
   * 启动进程
   * @param id - 进程ID
   * @param command - 命令
   * @param args - 参数列表
   * @param options - spawn 选项
   * @returns ProcessInfo
   */
  spawn(
    id: string,
    command: string,
    args: string[] = [],
    options?: SpawnOptions
  ): ProcessInfo {
    // 如果进程已存在，先停止
    if (this.processes.has(id)) {
      this.logger.warn(`进程 ${id} 已存在，先停止旧进程`)
      this.kill(id)
    }

    /**
     * 不在这里输出命令日志，由调用方输出更合适，可以看到服务执行过程中的一些实时 log，比如 hmr
     */
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    const processInfo: ProcessInfo = {
      id,
      pid: proc.pid,
      command,
      args,
      startTime: Date.now(),
      process: proc,
    }

    this.processes.set(id, processInfo)

    // 监听进程退出
    proc.on('exit', (code, signal) => {
      this.logger.info(`进程 ${id} 已退出 (code: ${code}, signal: ${signal})`)
      this.processes.delete(id)
    })

    proc.on('error', (err) => {
      this.logger.error(`进程 ${id} 出错: ${err.message}`)
      this.processes.delete(id)
    })

    return processInfo
  }

  /**
   * 停止进程
   * @param id - 进程ID
   * @param signal - 信号（默认为 SIGTERM）
   * @returns 是否成功停止
   */
  kill(id: string, signal: NodeJS.Signals = 'SIGTERM'): boolean {
    const processInfo = this.processes.get(id)
    if (!processInfo) {
      this.logger.warn(`进程 ${id} 不存在`)
      return false
    }

    this.logger.info(`停止进程: ${id} (PID: ${processInfo.pid})`)

    try {
      const killed = processInfo.process.kill(signal)
      if (killed) {
        this.processes.delete(id)
        return true
      }
      return false
    } catch (error) {
      this.logger.error(`停止进程 ${id} 失败: ${error}`)
      return false
    }
  }

  /**
   * 强制停止进程
   * @param id - 进程ID
   * @returns 是否成功停止
   */
  forceKill(id: string): boolean {
    return this.kill(id, 'SIGKILL')
  }

  /**
   * 获取进程信息
   * @param id - 进程ID
   * @returns ProcessInfo 或 undefined
   */
  get(id: string): ProcessInfo | undefined {
    return this.processes.get(id)
  }

  /**
   * 检查进程是否存在
   * @param id - 进程ID
   * @returns 是否存在
   */
  has(id: string): boolean {
    return this.processes.has(id)
  }

  /**
   * 检查进程是否在运行
   * @param id - 进程ID
   * @returns 是否在运行
   */
  isRunning(id: string): boolean {
    const processInfo = this.processes.get(id)
    if (!processInfo) return false

    // 检查进程是否还活着
    try {
      // 发送信号 0 不会真正发送信号，只是检查进程是否存在
      return process.kill(processInfo.pid!, 0)
    } catch {
      return false
    }
  }

  /**
   * 获取所有进程ID
   * @returns 进程ID列表
   */
  getAllIds(): string[] {
    return Array.from(this.processes.keys())
  }

  /**
   * 获取所有进程信息
   * @returns ProcessInfo 列表
   */
  getAllProcesses(): ProcessInfo[] {
    return Array.from(this.processes.values())
  }

  /**
   * 停止所有进程
   * @param signal - 信号（默认为 SIGTERM）
   */
  killAll(signal: NodeJS.Signals = 'SIGTERM'): void {
    if (this.processes.size === 0) {
      return
    }

    this.logger.info(`停止所有进程 (${this.processes.size} 个)`)

    for (const [id, processInfo] of this.processes) {
      try {
        processInfo.process.kill(signal)
        this.logger.info(`已停止进程: ${id}`)
      } catch (error) {
        this.logger.error(`停止进程 ${id} 失败: ${error}`)
      }
    }

    this.processes.clear()
  }

  /**
   * 强制停止所有进程
   */
  forceKillAll(): void {
    this.killAll('SIGKILL')
  }

  /**
   * 获取进程运行时间
   * @param id - 进程ID
   * @returns 运行时间（毫秒）或 undefined
   */
  getUptime(id: string): number | undefined {
    const processInfo = this.processes.get(id)
    if (!processInfo) return undefined

    return Date.now() - processInfo.startTime
  }

  /**
   * 显示所有进程状态
   */
  showStatus(): void {
    if (this.processes.size === 0) {
      console.log('没有运行中的进程')
      return
    }

    console.log(`\n📊 进程状态 (${this.processes.size} 个):`)
    for (const [id, info] of this.processes) {
      const uptime = this.getUptime(id)
      const uptimeStr = uptime ? `${Math.floor(uptime / 1000)}s` : 'N/A'
      const isRunning = this.isRunning(id)
      const status = isRunning ? '✓ 运行中' : '✗ 已停止'

      console.log(`  ${id}:`)
      console.log(`    PID: ${info.pid}`)
      console.log(`    命令: ${info.command} ${info.args.join(' ')}`)
      console.log(`    运行时间: ${uptimeStr}`)
      console.log(`    状态: ${status}`)
    }
    console.log()
  }
}

/**
 * 全局进程管理器实例（单例）
 */
let globalProcessManager: ProcessManager | null = null

/**
 * 获取全局进程管理器实例
 */
export function getProcessManager(): ProcessManager {
  if (!globalProcessManager) {
    globalProcessManager = new ProcessManager()
  }
  return globalProcessManager
}
