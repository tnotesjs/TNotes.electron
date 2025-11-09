/**
 * .vitepress/tnotes/vitepress/plugins/renameNotePlugin.ts
 *
 * Vite 插件 - 处理笔记重命名请求
 */
import type { Plugin } from 'vite'
import { RenameNoteCommand } from '../../commands/note/RenameNoteCommand'

export function renameNotePlugin(): Plugin {
  const renameCommand = new RenameNoteCommand()

  return {
    name: 'tnotes-rename-note',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 只处理 POST 请求到 /__tnotes_rename_note
        if (req.url === '/__tnotes_rename_note' && req.method === 'POST') {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const { noteId, newTitle } = JSON.parse(body)

              if (!noteId || !newTitle) {
                res.statusCode = 400
                res.end('Missing noteId or newTitle')
                return
              }

              // 执行重命名
              const startTime = Date.now()
              await renameCommand.renameNote({ noteId, newTitle })
              const duration = Date.now() - startTime

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: true,
                  duration,
                  newTitle,
                  message: '重命名完成',
                })
              )
            } catch (error) {
              res.statusCode = 500
              res.end(error instanceof Error ? error.message : 'Rename failed')
            }
          })
        } else {
          next()
        }
      })
    },
  }
}
