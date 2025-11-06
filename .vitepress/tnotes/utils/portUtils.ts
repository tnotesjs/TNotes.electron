/**
 * .vitepress/tnotes/utils/portUtils.ts
 *
 * 端口管理工具函数
 */
import { execSync } from 'child_process'
import { logger } from './logger'

/**
 * 检查端口是否被占用
 */
export function isPortInUse(port: number): boolean {
  try {
    // Windows 系统使用 netstat 命令
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      })
      return output.trim().length > 0
    }
    // Unix-like 系统使用 lsof 命令
    else {
      const output = execSync(`lsof -i :${port}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      })
      return output.trim().length > 0
    }
  } catch (error) {
    // 如果命令执行失败（没有找到占用），返回 false
    return false
  }
}

/**
 * 获取占用端口的进程 PID
 */
export function getPortPid(port: number): number | null {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      })
      const lines = output.trim().split('\n')
      if (lines.length > 0) {
        const match = lines[0].match(/\s+(\d+)\s*$/)
        if (match) {
          return parseInt(match[1])
        }
      }
    } else {
      const output = execSync(`lsof -t -i :${port}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      })
      const pid = parseInt(output.trim())
      if (!isNaN(pid)) {
        return pid
      }
    }
  } catch (error) {
    // 命令执行失败
  }
  return null
}

/**
 * 终止占用端口的进程
 */
export function killPortProcess(port: number): boolean {
  const pid = getPortPid(port)
  if (!pid) {
    return false
  }

  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' })
    } else {
      execSync(`kill -9 ${pid}`, { stdio: 'pipe' })
    }
    logger.info(`已终止占用端口 ${port} 的进程 (PID: ${pid})`)
    return true
  } catch (error) {
    logger.error(
      `终止进程失败 (PID: ${pid}): ${
        error instanceof Error ? error.message : String(error)
      }`
    )
    return false
  }
}

/**
 * 等待端口可用
 */
export async function waitForPort(
  port: number,
  timeout: number = 5000
): Promise<boolean> {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    if (!isPortInUse(port)) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  return false
}
