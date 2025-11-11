// .vitepress/tnotes/vitepress/components/sidebar.data.ts
import fs from 'node:fs'
import path from 'node:path'

/**
 * VitePress Data Loader for Sidebar
 * 通过监听 sidebar.json 文件变化，使用 HMR 热更新
 */

interface SidebarItem {
  text: string
  link: string
}

interface SidebarGroup {
  text: string
  collapsed?: boolean
  items: SidebarItem[]
}

export interface SidebarConfig {
  '/notes/': SidebarGroup[]
}

export default {
  // 监听 sidebar.json 文件变化
  watch: ['../../../../sidebar.json'],

  load(watchedFiles: string[]): SidebarConfig {
    const sidebarFilePath = watchedFiles[0]

    try {
      // 读取 sidebar.json 文件
      const fileContent = fs.readFileSync(sidebarFilePath, 'utf-8')
      const sidebarArray = JSON.parse(fileContent) as SidebarGroup[]

      // 期望的格式是 { '/notes/': [...] }
      const sidebarData: SidebarConfig = {
        '/notes/': sidebarArray,
      }

      console.log('✅ [sidebar.data.ts] Sidebar loaded,', sidebarArray[0])

      return sidebarData
    } catch (error) {
      console.error('❌ [sidebar.data.ts] Failed to load sidebar.json:', error)

      // 返回空的 sidebar 配置作为后备
      return {
        '/notes/': [],
      }
    }
  },
}
