/**
 * .vitepress/tnotes/vitepress/plugins/updateConfigPlugin.ts
 *
 * VitePress 插件 - 处理笔记配置更新请求
 */
import type { Plugin } from 'vite'
import { UpdateNoteConfigCommand } from '../../commands/note/UpdateNoteConfigCommand'

export function updateConfigPlugin(): Plugin {
  let updateCommand: UpdateNoteConfigCommand

  return {
    name: 'tnotes-update-config',

    configureServer(server) {
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
