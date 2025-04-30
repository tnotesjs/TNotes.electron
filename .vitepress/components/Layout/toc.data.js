// .vitepress/components/Layout/toc.data.js
import fs from 'node:fs'

export default {
  watch: ['../../../TOC.md'],
  load(watchedFiles) {
    let tocData = {}
    watchedFiles.forEach((file) => {
      // console.log('file:', file) // => file: TOC.md

      const fileContent = fs.readFileSync(file, 'utf-8')
      const doneNotesID = getDoneNotesID(fileContent)
      const doneNotesLen = doneNotesID.length

      tocData = {
        fileContent,
        doneNotesID,
        doneNotesLen,
      }
    })
    return tocData
  },
}

/**
 * 返回已完成的笔记的 ID 列表
 * @param {string} fileContent 文件内容
 * @returns 已完成的笔记的 ID 列表
 */
function getDoneNotesID(fileContent) {
  const matches = fileContent.match(/- \[x\]\s\[(\d{4})\./g)
  return matches
    ? [...new Set(matches.map((match) => match.slice(-5, -1)))]
    : []
}
