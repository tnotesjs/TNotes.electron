/**
 * .vitepress/tnotes/services/MergeDistributeService.ts
 *
 * 笔记合并分发服务 - 管理批量编辑笔记的合并和分发
 */
import * as fs from 'fs'
import * as path from 'path'
import {
  EOL,
  MERGED_README_PATH,
  SEPARATOR,
  NOTES_DIR_PATH,
} from '../config/constants'
import { ConfigManager } from '../config/ConfigManager'
import { logger } from '../utils/logger'

export class MergeDistributeService {
  private configManager: ConfigManager

  constructor() {
    this.configManager = ConfigManager.getInstance()
  }

  /**
   * 合并所有笔记到一个 MERGED_README.md 文件中
   * 用于批量编辑所有笔记内容
   */
  async mergeNotes(): Promise<void> {
    logger.info('开始合并所有笔记...')

    const ignoreDirs = this.configManager.get('ignore_dirs') || []

    /**
     * dirMap 映射表
     * - key: readme 的绝对路径
     * - val: 本地 readme 的相对路径，结尾加上分隔符
     */
    const dirMap: Record<string, string> = {}
    const dirNameList = fs.readdirSync(NOTES_DIR_PATH)

    for (const dirName of dirNameList) {
      if (ignoreDirs.includes(dirName)) continue

      const filePath = path.join(NOTES_DIR_PATH, dirName)
      const stats = fs.lstatSync(filePath)

      if (stats.isDirectory()) {
        const key = path.resolve(NOTES_DIR_PATH, dirName, 'README.md')
        const val = `# [README.md](./notes/${dirName.replaceAll(
          ' ',
          '%20'
        )}/README.md)${SEPARATOR}`
        dirMap[key] = val
      }
    }

    const mergedContents: string[] = []

    for (const key in dirMap) {
      try {
        const notesContent = fs.readFileSync(key, 'utf8')
        mergedContents.push(`${dirMap[key]}${EOL}${notesContent}${EOL}`)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logger.error(`读取失败 ${key}: ${errorMessage}`)
      }
    }

    fs.writeFileSync(MERGED_README_PATH, mergedContents.join(EOL), 'utf8')
    logger.success(`合并完成: ${MERGED_README_PATH}`)
  }

  /**
   * 分发 MERGED_README.md 文件中的内容到各笔记中
   * 配合 mergeNotes 使用
   */
  async distributeNotes(): Promise<void> {
    logger.info('开始分发笔记内容...')

    if (!fs.existsSync(MERGED_README_PATH)) {
      logger.error(`文件不存在: ${MERGED_README_PATH}`)
      return
    }

    const mergedReadmeContent = fs.readFileSync(MERGED_README_PATH, 'utf8')
    const mergedReadmeSections = mergedReadmeContent.split(
      new RegExp(`.*${SEPARATOR}$`, 'gm')
    )

    let successCount = 0
    let errorCount = 0

    mergedReadmeSections
      .filter((section) => section !== '' && section !== EOL)
      .forEach((section) => {
        const lines = section.split(EOL)

        /**
         * 获取标题行索引
         * 按照约定，每篇笔记内容只有一个一级标题
         */
        const titleLineIndex = lines.findIndex((line) => line.startsWith('# '))

        /**
         * 检查标题行格式
         * eg.
         * 标题行内容：`# [0001. xxx](https://example.com)`
         * 正则匹配结果：
         * linkMatch: [
         *    "[0001. xxx](https://example.com)",
         *    "0001. xxx",
         *    "https://example.com"
         *  ]
         * 其中 linkMatch[1] 是笔记标题，按照约定，它也是这篇笔记的目录名称
         */
        const linkMatch = lines[titleLineIndex].match(/\[(.*?)\]\((.*?)\)/)
        if (!linkMatch) {
          logger.error(`无效的标题格式: ${lines[titleLineIndex]}`)
          errorCount++
          return
        }

        const notesPath = path.resolve(
          NOTES_DIR_PATH,
          linkMatch[1],
          'README.md'
        )

        // 删除笔记结尾的空行
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
          lines.pop()
        }

        try {
          fs.writeFileSync(
            notesPath,
            lines.splice(titleLineIndex).join(EOL) + EOL, // 保留一个空行
            'utf8'
          )
          successCount++
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          logger.error(`写入失败 ${notesPath}: ${errorMessage}`)
          errorCount++
        }
      })

    logger.success(
      `分发完成: 成功 ${successCount} 篇${
        errorCount > 0 ? `, 失败 ${errorCount} 篇` : ''
      }`
    )
  }
}
