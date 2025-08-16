// .vitepress/components/notesConfig.data.ts
import fs from 'node:fs'
import { IGNORE_DIRS } from './constants'

export default {
  // 监听笔记目录下的 .tnotes.json 文件变化
  watch: ['../../notes/**/.tnotes.json'],
  load(watchedFiles) {
    // console.log('watchedFiles', watchedFiles)

    // 初始化一个空对象，用于存储所有笔记的配置数据
    const allNotesConfig = {}

    // 遍历所有监听到的 .tnotes.json 文件
    watchedFiles.forEach((filePath) => {
      try {
        // 检查目录是否在忽略列表中
        const dirName = filePath.split('/').slice(-2, -1)[0] // 提取目录名称
        if (IGNORE_DIRS.includes(dirName)) {
          console.log(`Skipping ignored directory: ${dirName}`)
          return // 跳过忽略的目录
        }

        // 读取文件内容
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const configData = JSON.parse(fileContent)

        // 提取笔记 ID（文件路径中前 4 个数字）
        const noteIdMatch = filePath.match(/notes\/(\d{4})\./)
        if (noteIdMatch) {
          const noteId = noteIdMatch[1] // 获取笔记 ID
          const redirect = filePath.replace(/\.tnotes\.json$/, 'README')
          allNotesConfig[noteId] = {
            ...configData,
            redirect,
          } // 将配置数据存入对象
        }
      } catch (error) {
        console.error(`Failed to load config file: ${filePath}`, error)
      }
    })

    // console.log('All notes config loaded:', allNotesConfig)

    return allNotesConfig
  },
}
