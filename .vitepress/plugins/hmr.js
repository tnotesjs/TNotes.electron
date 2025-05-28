import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import {
  ROOT_DIR_PATH,
  ignore_dirs,
  REPO_NOTES_URL,
  NOTES_TOC_START_TAG,
  NOTES_TOC_END_TAG,
  BILIBILI_VIDEO_BASE_URL,
  EOL,
  repoName,
} from '../tnotes/constants.js'
import {
  createAddNumberToTitle,
  generateToc,
  isEnableHRM,
  ensureConfigExists,
} from '../tnotes/utils'

export default async function TN_HMR_Plugin() {
  await ensureConfigExists()
  return {
    name: 'tn-hmr-plugin',
    configureServer(server) {
      const UPDATE_TIMEOUT = 1000
      let lastUpdateTime = 0
      // 监听文件变化事件
      server.watcher.on('all', async (event, filePath) => {
        // console.log('filePath:', filePath)
        // /Users/huyouda/zm/notes/TNotes.leetcode/notes/0002. xxx/README.md
        // console.log('path.basename(filePath)', path.basename(filePath))

        // console.log('Date.now()', Date.now())
        // console.log('lastUpdateTime', lastUpdateTime)
        // console.log('Date.now() - lastUpdateTime', Date.now() - lastUpdateTime)
        if (Date.now() - lastUpdateTime < UPDATE_TIMEOUT) return
        if (!(await isEnableHRM())) return

        try {
          const basename = path.basename(filePath)
          const notesStats = await fs.promises.lstat(filePath)
          const notesDirName = path.basename(path.dirname(filePath))

          if (
            basename === 'README.md' &&
            notesStats.isFile() &&
            notesDirName.match(/^\d{4}.\s/) &&
            !ignore_dirs.includes(notesDirName)
          ) {
            const startTime = Date.now()
            // console.log(
            //   `⌛️ update start => ${notesDirName} => ${encodeURIComponent(
            //     filePath
            //   )}`
            // )
            let lines = await fs.promises.readFile(filePath, 'utf-8')
            lines = lines.split(EOL)
            // console.log('lines', lines)

            // update title ---------------------------------------------------------
            lines[0] = `# [${notesDirName}](${REPO_NOTES_URL}/${encodeURIComponent(
              notesDirName
            )})`

            // update toc -----------------------------------------------------------
            let startLineIdx = -1,
              endLineIdx = -1
            lines.forEach((line, idx) => {
              if (line.startsWith(NOTES_TOC_START_TAG)) startLineIdx = idx
              if (line.startsWith(NOTES_TOC_END_TAG)) endLineIdx = idx
            })
            if (startLineIdx !== -1 && endLineIdx !== -1) {
              const notesID = notesDirName.slice(0, 4)
              const titles = []
              const headers = ['## ', '### ', '#### ', '##### ', '###### '] // 2~6 级标题，忽略 1 级标题。
              const addNumberToTitle = createAddNumberToTitle()
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                const isHeader = headers.some((header) =>
                  line.startsWith(header)
                )
                if (isHeader) {
                  const [numberedTitle] = addNumberToTitle(line)
                  titles.push(numberedTitle)
                  lines[i] = numberedTitle // 更新原行内容
                }
              }
              const toc = generateToc(titles, 2)
              let bilibiliTOCItems = []
              const configPath = path.resolve(
                path.dirname(filePath),
                '.tnotes.json'
              )
              let notesConfig = await fs.promises.readFile(configPath, 'utf8')
              notesConfig = JSON.parse(notesConfig)
              if (notesConfig && notesConfig.bilibili.length > 0) {
                bilibiliTOCItems = notesConfig.bilibili.map(
                  (bvid, i) =>
                    `  - [bilibili.${repoName}.${notesID}.${i + 1}](${
                      BILIBILI_VIDEO_BASE_URL + bvid
                    })`
                )
              }

              if (bilibiliTOCItems.length > 0) {
                lines.splice(
                  startLineIdx + 1,
                  endLineIdx - startLineIdx - 1,
                  '',
                  `- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)`,
                  ...bilibiliTOCItems,
                  ...toc.replace(new RegExp(`^${EOL}`), '').split(EOL)
                )
              } else {
                lines.splice(
                  startLineIdx + 1,
                  endLineIdx - startLineIdx - 1,
                  ...toc.split(EOL)
                )
              }
            }

            // 写入前标记
            lastUpdateTime = Date.now()
            await fs.promises.writeFile(filePath, lines.join(EOL))

            // console.log(
            //   `✅ update end => ${notesDirName} => ${encodeURIComponent(
            //     filePath
            //   )}`
            // )
            // console.log(`🚀 ${Date.now() - startTime} ms`)
          }
        } catch (err) {
          if (
            event !== 'unlinkDir' &&
            !['ENOENT', 'ENOTDIR'].includes(err.code)
          ) {
            console.log('❌ tn hmr error', err)
          }
        }
      })
    },
  }
}
