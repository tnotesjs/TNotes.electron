/**
 * .vitepress/tnotes/vitepress/plugins/updateConfigPlugin.ts
 *
 * VitePress 插件 - 处理笔记配置更新请求
 */
import type { PluginOption } from 'vite'
import { UpdateNoteConfigCommand } from '../../commands/note/UpdateNoteConfigCommand'
import { serviceManager } from '../../services/ServiceManager'
import { logger } from '../../utils/logger'

export function updateConfigPlugin(): PluginOption {
  let updateCommand: UpdateNoteConfigCommand
  let isInitialized = false

  return {
    name: 'tnotes-update-config',

    async configureServer(server) {
      // 初始化 ServiceManager（包含笔记索引缓存）
      if (!isInitialized) {
        try {
          logger.info('updateConfigPlugin: 正在初始化服务...')
          await serviceManager.initialize()
          isInitialized = true
          logger.success('updateConfigPlugin: 服务初始化完成')
        } catch (error) {
          logger.error('updateConfigPlugin: 服务初始化失败，插件将无法正常工作')
          logger.error(error)
          // 不中断服务器启动，但记录错误
        }
      }

      // 初始化命令实例
      updateCommand = new UpdateNoteConfigCommand()

      // 添加中间件处理配置更新请求
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__tnotes_update_config' && req.method === 'POST') {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const data = JSON.parse(body)
              const { noteId, config } = data

              if (!noteId || !config) {
                res.statusCode = 400
                res.end('Missing noteId or config')
                return
              }

              // 调用命令更新配置
              await updateCommand.updateConfig({
                noteId,
                config: {
                  done: config.done,
                  enableDiscussions: config.enableDiscussions,
                  deprecated: config.deprecated,
                  description: config.description,
                },
              })

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (error) {
              console.error('更新配置失败:', error)
              res.statusCode = 500
              res.end(error instanceof Error ? error.message : String(error))
            }
          })
        } else {
          next()
        }
      })
    },
  }
}
