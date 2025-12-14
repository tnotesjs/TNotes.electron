/**
 * .vitepress/tnotes/vitepress/plugins/getNoteByConfigIdPlugin.ts
 *
 * VitePress 插件 - 根据 configId 查询笔记信息
 */
import type { PluginOption } from 'vite'
import { serviceManager } from '../../services/ServiceManager'
import { logger } from '../../utils/logger'

export function getNoteByConfigIdPlugin(): PluginOption {
  return {
    name: 'tnotes-get-note-by-config-id',

    configureServer(server) {
      // 添加中间件处理查询请求
      server.middlewares.use(async (req, res, next) => {
        if (
          req.url?.startsWith('/__tnotes_get_note?') &&
          req.method === 'GET'
        ) {
          try {
            // 解析查询参数
            const url = new URL(req.url, `http://${req.headers.host}`)
            const configId = url.searchParams.get('configId')

            if (!configId) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Missing configId parameter',
                })
              )
              return
            }

            // 确保 ServiceManager 已初始化
            if (!serviceManager.isInitialized()) {
              res.statusCode = 503
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Service not initialized',
                })
              )
              return
            }

            // 从索引缓存中查询笔记
            const noteIndexCache = serviceManager.getNoteIndexCache()
            const noteItem = noteIndexCache.getByConfigId(configId)

            if (!noteItem) {
              // 笔记不存在或已被删除
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: true,
                  found: false,
                  data: null,
                })
              )
              return
            }

            // 返回笔记信息
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                success: true,
                found: true,
                data: {
                  noteId: noteItem.noteId,
                  folderName: noteItem.folderName,
                  // 构建笔记的完整 URL（包含 README）
                  url: `/notes/${encodeURIComponent(
                    noteItem.folderName
                  )}/README`,
                },
              })
            )

            logger.debug(
              `查询笔记: configId=${configId}, noteId=${noteItem.noteId}`
            )
          } catch (error) {
            logger.error('查询笔记失败:', error)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              })
            )
          }
        } else {
          next()
        }
      })
    },
  }
}
