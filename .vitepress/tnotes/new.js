// .vitepress/tnotes/new.js
import fs from 'fs'
import path from 'path'

import {
  EOL,
  NOTES_DIR,
  ignore_dirs,
  NEW_NOTES_README_MD_TEMPLATE,
  getNewNotesTnotesJsonTemplate,
  REPO_NOTES_URL,
  ROOT_README_PATH,
} from './constants.js'

/**
 * 新建笔记
 */
function newNotes() {
  const dirNameList = fs.readdirSync(NOTES_DIR)
  const validDirNames = dirNameList.filter((dirName) => {
    return !ignore_dirs.includes(dirName) && /^\d{4}\./.test(dirName)
  })

  // 提取笔记 ID 列表（前 4 个数字）
  const noteIdList = validDirNames.map((dirName) => dirName.slice(0, 4)).sort()

  // 计算新笔记的 ID
  let nextNoteId = null
  if (noteIdList.length > 0) {
    for (let i = 0; i < noteIdList.length; i++) {
      const currentId = parseInt(noteIdList[i], 10)
      if (i === 0 && currentId !== 1) {
        nextNoteId = '0001'
        break
      }
      if (i > 0) {
        const previousId = parseInt(noteIdList[i - 1], 10)
        if (currentId - previousId > 1) {
          nextNoteId = String(previousId + 1).padStart(4, '0')
          break
        }
      }
    }

    // 如果没有中断处，则在最大编号后创建新笔记
    if (!nextNoteId) {
      const maxId = parseInt(noteIdList[noteIdList.length - 1], 10)
      nextNoteId = String(maxId + 1).padStart(4, '0')
    }
  } else {
    nextNoteId = '0001'
  }

  // 新笔记初始化
  const newNoteDirName = `${nextNoteId}. xxx`
  const newNoteDirPath = path.join(NOTES_DIR, newNoteDirName)
  fs.mkdirSync(newNoteDirPath)

  const notesTitle = `# [${newNoteDirName}](${REPO_NOTES_URL}/${encodeURIComponent(
    newNoteDirName
  )})`
  const readmeContent = notesTitle + NEW_NOTES_README_MD_TEMPLATE
  const readmeFilePath = path.join(newNoteDirPath, 'README.md')
  fs.writeFileSync(readmeFilePath, readmeContent)

  fs.writeFileSync(
    path.join(newNoteDirPath, '.tnotes.json'),
    getNewNotesTnotesJsonTemplate()
  )

  // 打印 README.md 的绝对路径，并对路径进行编码以便快速跳转
  const readmeAbsolutePath = path.resolve(readmeFilePath)
  console.log(
    `\n\n"${newNoteDirName}" 笔记已创建 👉 ${encodeURI(
      `file://${readmeAbsolutePath}`
    ).replace(/#/g, '%23')}`
  )

  // 在 ROOT_README_PATH 文件末尾插入新笔记标题
  try {
    const rootReadmeContent = fs.readFileSync(ROOT_README_PATH, 'utf-8')
    const newEntry = `${EOL}${EOL}- [ ] ${notesTitle.slice(2)}${EOL}${EOL}`
    fs.writeFileSync(ROOT_README_PATH, rootReadmeContent + newEntry, 'utf-8')
    console.log(
      `已添加到 ${encodeURI(`file://${ROOT_README_PATH}`).replace(
        /#/g,
        '%23'
      )}`,
      '\n请手动调整该笔记所属目录\n\n'
    )
  } catch (error) {
    console.error(`无法更新 ${ROOT_README_PATH}:`, error)
  }
}

export { newNotes }
