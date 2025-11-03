/**
 * .vitepress/tnotes/genNotesTemp.ts
 *
 * 作用：创建笔记模板
 *
 * 示例：
 *
 *    需求：要快速生成 0001 到 0010 的笔记目录
 *
 *    实现步骤：
 *    1. 将 START_NUM 设置为 1
 *    2. 将 END_NUM 设置为 10
 *    3. 执行命令生成模板
 *    4. 简单检查一下生成的目录内容是否有误
 *    5. 确认无误后，将创建好的目录剪切到根目录
 */
import fs from 'fs'
import path from 'path'
import {
  __dirname,
  author,
  NEW_NOTES_README_MD_TEMPLATE,
  getNewNotesTnotesJsonTemplate,
  repoName,
} from './constants'

/**
 * 定义起始数字常量
 */
const START_NUM = 1

/**
 * 定义结束数字常量
 */
const END_NUM = 10

/**
 * 批量生成笔记模板
 * 从 START_NUM 到 END_NUM 创建连续的笔记目录
 */
export function genNotesTemp(): void {
  for (let id = START_NUM; id <= END_NUM; id++) {
    const dirName = `${id.toString().padStart(4, '0')}. xxx`
    const noteTitle = `# [${dirName}](https://github.com/${author}/${repoName}/tree/main/${encodeURIComponent(
      dirName
    )})`

    fs.mkdirSync(path.resolve(__dirname, dirName))
    fs.writeFileSync(
      path.resolve(__dirname, dirName, 'README.md'),
      noteTitle + NEW_NOTES_README_MD_TEMPLATE
    )
    const templateJson = getNewNotesTnotesJsonTemplate()
    fs.writeFileSync(
      path.resolve(__dirname, dirName, '.tnotes.json'),
      typeof templateJson === 'string'
        ? templateJson
        : JSON.stringify(templateJson, null, 2)
    )
  }

  console.log(
    `✅ 成功生成 ${
      END_NUM - START_NUM + 1
    } 个笔记模板 (${START_NUM.toString().padStart(
      4,
      '0'
    )} - ${END_NUM.toString().padStart(4, '0')})`
  )
}
