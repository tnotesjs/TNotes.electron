#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { execSync, spawn } from 'child_process'
import os from 'os'
import { __dirname, ROOT_DIR_PATH, port } from './constants.js'
import ReadmeUpdater from './update.js'

// 使用项目配置的端口
const PORT = port || 5173
const PID_FILE = path.join(ROOT_DIR_PATH, '.vitepress-pid')

// 获取进程信息（优先使用 PID 文件）
function getProcessInfo() {
  try {
    if (fs.existsSync(PID_FILE)) {
      const pid = fs.readFileSync(PID_FILE, 'utf-8').trim()
      return { pid, method: 'pid-file' }
    }

    // 端口扫描作为备用
    let pid
    if (os.platform() === 'win32') {
      const output = execSync(`netstat -ano | findstr :${PORT}`).toString()
      pid = output.split('\n')[0]?.trim().split(' ')[-1]
    } else {
      const output = execSync(`lsof -t -i:${PORT}`).toString()
      pid = output.trim()
    }

    return pid ? { pid, method: 'port-scan' } : null
  } catch (e) {
    return null
  }
}

// 安全停止服务
function stopServer() {
  const info = getProcessInfo()
  if (!info) {
    console.log('ℹ️  VitePress 服务未运行')
    return
  }

  console.log(
    `🛑  停止 VitePress 服务 (PID: ${info.pid}, 方法: ${info.method})...`
  )

  try {
    if (os.platform() === 'win32') {
      execSync(`taskkill /PID ${info.pid} /F`, { stdio: 'ignore' })
    } else {
      process.kill(info.pid, 'SIGINT')
    }
    console.log('✅  服务已停止')
  } catch (e) {
    console.log('⚠️  停止服务时出错:', e.message)
  } finally {
    try {
      fs.unlinkSync(PID_FILE)
    } catch (e) {
      // 忽略
    }
  }
}

// 安全启动服务
export function startServer() {
  stopServer() // 确保无残留进程

  console.log('🚀  启动 VitePress 开发服务器...')
  const devProcess = spawn(
    'vitepress',
    ['dev', '--host', '--port', PORT.toString(), '--open'],
    {
      stdio: 'inherit',
      shell: true,
      cwd: ROOT_DIR_PATH, // 使用项目根目录
    }
  )

  // 保存 PID
  fs.writeFileSync(PID_FILE, devProcess.pid.toString())
  console.log(`mPid: ${devProcess.pid} 已保存到 ${PID_FILE}`)

  // 清理 PID 文件
  devProcess.on('exit', () => {
    try {
      fs.unlinkSync(PID_FILE)
    } catch (e) {
      // 忽略
    }
  })
}

// 安全更新流程
export async function safeUpdate() {
  stopServer()

  console.log('\n🔄  执行文档更新...')
  try {
    // 直接调用 update 逻辑（避免额外进程）
    const updater = new ReadmeUpdater()
    await updater.updateReadme()

    console.log('✅  文档更新完成')
    startServer()
  } catch (e) {
    console.error('❌  更新失败:', e.message)
    process.exit(1)
  }
}
