import fs from 'fs'
import path from 'path'

import { EOL, MERGED_README_PATH, SEPERATOR, NOTES_DIR, ignore_dirs } from './constants.js'

function mergeNotes() {
  /**
   * - key 是 readme 的绝对路径
   * - val 是本地 readme 的相对路径，结尾加上分隔符
   */
  const dirMap = {}
  const dirNameList = fs.readdirSync(NOTES_DIR)
  for (let dirName of dirNameList) {
    if (ignore_dirs.includes(dirName)) continue
    const filePath = path.join(NOTES_DIR, dirName)
    const stats = fs.lstatSync(filePath)

    if (stats.isDirectory()) {
      const key = path.resolve(NOTES_DIR, dirName, 'README.md')
      const val = `# [README.md](./notes/${dirName.replaceAll(
        ' ',
        '%20'
      )}/README.md)${SEPERATOR}`
      dirMap[key] = val
    }
  }

  const mergedContents = []

  for (const key in dirMap) {
    try {
      let notesContent = fs.readFileSync(key, 'utf8')
      mergedContents.push(`${dirMap[key]}${EOL}${notesContent}${EOL}`)
    } catch (err) {
      console.error(`Failed to read or process ${key}:`, err)
    }
  }

  fs.writeFileSync(MERGED_README_PATH, mergedContents.join(EOL), 'utf8')
  console.log(`✅ ${MERGED_README_PATH} Generated successfully.`)
}

function distributeNotes() {
  const mergedReadmeContent = fs.readFileSync(MERGED_README_PATH, 'utf8')
  const mergedReadmeSections = mergedReadmeContent.split(
    new RegExp(`.*${SEPERATOR}$`, 'gm')
  )

  mergedReadmeSections
    .filter((section) => section !== '' && section !== EOL)
    .forEach((section) => {
      // console.log('section =>', section);

      let lines = section.split(EOL)

      /**
       * 获取到标题行索引
       * 按照约定，每篇笔记内容只有一个一级标题。
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
       * 其中 linkMatch[1] 是笔记标题，按照约定，它也是这篇笔记的目录名称。
       */
      const linkMatch = lines[titleLineIndex].match(/\[(.*?)\]\((.*?)\)/)
      if (!linkMatch) {
        console.error(`Invalid section: ${titleLine}`)
        return
      }

      const notesPath = path.resolve(NOTES_DIR, linkMatch[1], 'README.md')

      // 删除笔记结尾的空行
      while (lines[lines.length - 1].trim() === '') lines.pop()

      try {
        fs.writeFileSync(
          notesPath,
          lines.splice(titleLineIndex).join(EOL) + EOL, // 保留一个空行
          'utf8'
        )
        // console.log(`"✅ ${notesPath}" updated successfully.`)
      } catch (err) {
        console.error(`"❌ ${notesPath}" failed to write:`, err)
      }
    })

  console.log(`✅ distribute finished => ${MERGED_README_PATH}`)
}

export { mergeNotes, distributeNotes }
