import { statSync } from 'fs'
import { resolve } from 'path'
import { runCommand } from '../tnotes/utils/run_command.js'
import { ROOT_DIR } from '../tnotes/constants.js'

// 定义一个时间窗口（单位：毫秒）
const DEBOUNCE_TIME = 300

let debounceTimer = null // 用于存储定时器

export default function TN_HMR_Plugin() {
  return {
    name: 'tn-hmr-plugin',
    configureServer(server) {
      // 监听文件变化事件
      server.watcher.on('all', (event, filePath) => {
        const fullPath = resolve(ROOT_DIR, filePath)

        // 判断路径是否为目录
        let isDirectory = false
        try {
          const stats = statSync(fullPath)
          isDirectory = stats.isDirectory()
        } catch (err) {
          // 如果路径不存在（例如删除操作），仍然可以处理事件
          if (event === 'unlinkDir') {
            isDirectory = true
          }
        }

        // 只有当变更内容是目录时，才触发逻辑
        if (isDirectory) {
          // 清除之前的定时器
          if (debounceTimer) {
            clearTimeout(debounceTimer)
          }

          // 设置新的定时器，在时间窗口结束后执行命令
          debounceTimer = setTimeout(async () => {
            console.log('♻️ update doing...')
            await runCommand('npm run tn:update', ROOT_DIR)
            console.log('✅ update done')
          }, DEBOUNCE_TIME)
        }
      })
    },
  }
}
