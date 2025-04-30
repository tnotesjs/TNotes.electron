/**
 * - 更新 notes README 笔记内容 - 自动生成标题编号、更新目录。
 * - 读取笔记头部信息，更新 home README，动态生成目录。
 */
import fs from 'fs'
import path from 'path'

import GithubSlugger from 'github-slugger' // doc: https://www.npmjs.com/package/github-slugger
import {
  __dirname,
  author,
  BILIBILI_VIDEO_BASE_URL,
  EOL,
  GITHUB_PAGE_NOTES_URL,
  ignore_dirs,
  menuItems,
  NEW_NOTES_README_MD_TEMPLATE,
  NEW_NOTES_TNOTES_JSON_TEMPLATE,
  NOTES_DIR,
  NOTES_TOC_END_TAG,
  NOTES_TOC_START_TAG,
  REPO_BLOB_URL_1,
  REPO_BLOB_URL_2,
  REPO_NOTES_URL,
  repoName,
  ROOT_README_PATH,
  socialLinks,
  VP_TOC_PATH,
  VP_SIDEBAR_PATH,
  sidebar_isNotesIDVisible,
  sidebar_isCollapsed,
  rootDocsSrcDir,
  ROOT_DIR,
} from './constants.js'
import { genHierarchicalSidebar } from './utils/index.js'

const slugger = new GithubSlugger()

class ReadmeUpdater {
  constructor() {
    this.EOL = EOL
    this.githubPageNotesUrl = GITHUB_PAGE_NOTES_URL
    this.newNotesReadmeMdTemplate = NEW_NOTES_README_MD_TEMPLATE
    this.notesDir = NOTES_DIR
    this.repoBlobUrl1 = REPO_BLOB_URL_1
    this.repoBlobUrl2 = REPO_BLOB_URL_2
    this.repoNotesUrl = REPO_NOTES_URL
    this.rootReadmePath = ROOT_README_PATH
    this.tocEndTag = NOTES_TOC_END_TAG
    this.tocStartTag = NOTES_TOC_START_TAG
    this.vpTocPath = VP_TOC_PATH
    this.vpSidebarPath = VP_SIDEBAR_PATH

    this.author = author
    this.repoName = repoName
    this.ignoreDirs = ignore_dirs || []
    this.sidebar_isNotesIDVisible = sidebar_isNotesIDVisible || false
    this.sidebar_isCollapsed = sidebar_isCollapsed || true
    this.socialLinks = socialLinks
    this.menuItems = menuItems
    this.rootDocsSrcDir = rootDocsSrcDir
      ? path.resolve(ROOT_DIR, rootDocsSrcDir)
      : ''

    this.notesInfo = {
      /**
       * 笔记头部信息映射表
       * - key 是笔记 ID，也就是笔记文件夹的开头 4 个数字。
       * - val 是笔记的头部信息，头部信息指一级标题到第一个二级标题之间的内容。
       */
      topInfoMap: {},
      /**
       * 笔记配置文件映射表。
       * - key 是笔记 ID。
       * - val 是这篇笔记的配置文件内容。
       */
      configMap: {},
      /**
       * - 笔记目录中读取到的笔记 id 集合。
       */
      ids: new Set(),
      /**
       * - 标记为已完成的笔记 id 集合。
       */
      doneIds: new Set(),
      /**
       * - 存在于 NOTES_DIR 中的需要处理的笔记目录名称列表。
       */
      dirNameList: [],
    }

    this.homeReadme = {
      path: ROOT_README_PATH,
      contents: '',
      lines: [],
      /**
       * titles 目录标题集合，用于辅助生成 vp sidebar.json。
       * - eg.
       * - [ '# svg', '## 1. 词库', '## 2. svg 在线免费教程', '## 3. svg 起步', ... ]
       */
      titles: [],
      /**
       * titlesNotesCount 每个标题下对应的笔记数量，用于辅助生成 vp sidebar.json。
       * - eg.
       * - [ 0, 1, 0, 10, ... ]
       */
      titlesNotesCount: [],
      noteTitleReg: /(\s*-\s*\[\s*x?\s*\]\s*)(\[?)(\d{4})(.*)/,
      /**
       * - 存在于 Home README 中的笔记 id 集合。（去重）
       */
      ids: new Set(),
      /**
       * - 存在于 Home README 中的笔记 id 集合。（未去重）
       * - 按照笔记在 Home README 中出现的顺序排序。
       * - 生成 vp sidebar.json 的时候，同一篇笔记可能会被多次添加到 sidebar.json 文件内容中。
       */
      idList: [],
    }
  }

  /**
   * 检查笔记目录列表，对于缺失必要文件的笔记目录，使用默认模板进行补全。
   */
  checkNotesInfo() {
    for (let notesDirName of fs.readdirSync(this.notesDir)) {
      if (this.ignoreDirs.includes(notesDirName)) continue
      const dirPath = path.join(this.notesDir, notesDirName)
      const stats = fs.lstatSync(dirPath)

      if (!(stats.isDirectory() && notesDirName.match(/^\d{4}/))) continue

      const notesPath = path.resolve(this.notesDir, notesDirName, 'README.md')
      const notesConfigPath = path.resolve(
        this.notesDir,
        notesDirName,
        '.tnotes.json'
      )

      const notesTitle = `# [${notesDirName}](${
        this.repoNotesUrl
      }/${encodeURIComponent(notesDirName)})`

      if (!fs.existsSync(notesPath)) {
        fs.writeFileSync(
          notesPath,
          notesTitle + this.newNotesReadmeMdTemplate,
          'utf8'
        )
        fs.writeFileSync(
          notesConfigPath,
          NEW_NOTES_TNOTES_JSON_TEMPLATE,
          'utf8'
        )
        console.log(`${notesDirName} 笔记不存在，已完成初始化。`)
        return
      }

      if (fs.existsSync(notesConfigPath)) {
        let notesConfig = JSON.parse(fs.readFileSync(notesConfigPath, 'utf8'))
        notesConfig = {
          ...JSON.parse(NEW_NOTES_TNOTES_JSON_TEMPLATE),
          ...notesConfig,
        }
        fs.writeFileSync(
          notesConfigPath,
          JSON.stringify(notesConfig, null, 2),
          'utf8'
        )
      } else {
        fs.writeFileSync(
          notesConfigPath,
          JSON.stringify(JSON.parse(NEW_NOTES_TNOTES_JSON_TEMPLATE), null, 2),
          'utf8'
        )
      }
    }
  }

  /**
   * 遍历所有笔记目录，完成 this.notesInfo 的初始化。
   *
   * 主要功能点：
   *
   * 1. 获取笔记目录列表。
   *   - 约定笔记目录的判定逻辑：
   *     1. 是文件夹
   *     2. 文件夹名称开头的 4 个字符是数字
   *   - 笔记的配置文件 notesDir/.tnotes.json
   * 2. 检查被遍历到的笔记目录下是否存在笔记文件和笔记配置文件，若不存在，则按照默认模板生成笔记及配置为难。
   * 3. 更新笔记标题为超链接的形式，跳转到对应的 github 仓库上的笔记位置。
   * 4. 如果笔记头部带有目录区域的标识符，则根据笔记内容更新目录区域。
   * 5. 提取笔记头部信息。
   * 6. 确保笔记头部信息中的链接有效。
   * @returns {Array} 笔记目录列表
   */
  getNotesInfo() {
    for (let notesDirName of fs.readdirSync(this.notesDir)) {
      if (this.ignoreDirs.includes(notesDirName)) continue
      const dirPath = path.join(this.notesDir, notesDirName)
      const stats = fs.lstatSync(dirPath)

      // 检查是否是笔记文件夹
      if (!(stats.isDirectory() && notesDirName.match(/^\d{4}/))) continue

      this.notesInfo.dirNameList.push(notesDirName)
      const notesID = notesDirName.slice(0, 4)
      this.notesInfo.ids.add(notesID)

      const notesPath = path.resolve(this.notesDir, notesDirName, 'README.md')
      const notesConfigPath = path.resolve(
        this.notesDir,
        notesDirName,
        '.tnotes.json'
      )

      const notesTitle = `# [${notesDirName}](${
        this.repoNotesUrl
      }/${encodeURIComponent(notesDirName)})`

      // 获取笔记配置
      const notesConfig = JSON.parse(fs.readFileSync(notesConfigPath, 'utf8'))
      this.notesInfo.configMap[notesID] = notesConfig
      notesConfig.done && this.notesInfo.doneIds.add(notesID)

      // 读取笔记内容
      const notesLines = fs.readFileSync(notesPath, 'utf8').split(this.EOL)

      // 更新笔记标题
      notesLines[0] = notesTitle

      // ! Deprecated
      // 以下逻辑已经合并到 Layout.vue 组件中，如果开启评论功能，会在文档结尾自动注入 Discussions 组件。
      // 管理笔记评论是否开启
      // const comp_Discussions = `<Discussions id="${this.repoName}.${notesID}" />`
      // if (notesConfig.enableDiscussions && !notesLines.includes(comp_Discussions)) {
      //   notesLines.push(`${this.EOL}${comp_Discussions}`)
      // } else if (!notesConfig.enableDiscussions && notesLines.includes(comp_Discussions)) {
      //   const index = notesLines.indexOf(comp_Discussions)
      //   notesLines.splice(index, 1)
      // }

      // 更新笔记目录。
      this.updateNotesToc(notesID, notesLines)

      // 删除笔记结尾的空行
      while (notesLines[notesLines.length - 1].trim() === '') {
        notesLines.pop()
      }

      fs.writeFileSync(notesPath, notesLines.join(this.EOL) + this.EOL, 'utf8')

      let firstHeading2Index = -1
      for (let i = 1; i < notesLines.length; i++) {
        if (notesLines[i].startsWith('## ')) {
          firstHeading2Index = i
          break
        }
      }
      let topInfoLines =
        firstHeading2Index > 0
          ? notesLines.slice(1, firstHeading2Index)
          : notesLines.slice(1)

      // 处理头部信息中的跳转链接
      topInfoLines = topInfoLines.map((line) => {
        return line.replace(/!?\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
          // 检查路径是否以 https:// 或者 http:// 开头
          if (/^https?:\/\//.test(p2)) {
            // 外部链接
            return match
          } else if (/^#.?/.test(p2)) {
            // anchor
            return `[${p1}](${this.repoNotesUrl}/${encodeURIComponent(
              notesDirName
            )}/README.md${p2})`
          } else {
            // 图片引用或者是其它静态资源（比如 pdf）
            const isImage = match.startsWith('![')
            const prefix = isImage ? '![' : '['
            const suffix = isImage ? ']' : ']'
            const baseUrl = isImage ? this.repoBlobUrl1 : this.repoNotesUrl
            const baseUrl_end = isImage ? this.repoBlobUrl2 : ''
            return `${prefix}${p1}${suffix}(${baseUrl}/${encodeURIComponent(
              notesDirName
            )}/${p2}${baseUrl_end})`
          }
        })
      })

      // 每一行增加俩空格的缩进，以便后续插入到首页中生成目录结构。
      topInfoLines = topInfoLines.map((line) => `  ${line}`)
      // 删除 toc startTag 和 endTag
      topInfoLines = topInfoLines.filter(
        (line) =>
          !line.includes(this.tocStartTag) &&
          !line.includes(this.tocEndTag) &&
          line.trim() !== ''
      )
      // console.log('topInfoLines:', topInfoLines);

      // 以 notes ID 作为 key，初始化 notes map，value 为笔记头部信息。
      this.notesInfo.topInfoMap[notesID] = `[${notesDirName}](${
        this.repoNotesUrl
      }/${encodeURIComponent(notesDirName)}/README.md)${
        this.EOL
      }${topInfoLines.join(this.EOL)}`
    }
  }

  /**
   * 重置首页目录数据。
   * @returns 不带有笔记头部信息的 Home Readme 内容。
   */
  resetHomeTopInfos() {
    const lines = this.homeReadme.contents.split(this.EOL)
    let result = []

    let deleteMode = false

    const headers = ['# ', '## ', '### ', '#### ', '##### ', '###### ']

    // 内容处理 - 目录重置
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.match(this.homeReadme.noteTitleReg)) {
        // 遇到笔记标题，进入删除模式。
        deleteMode = true
        result.push(line)
        continue
      }

      if (headers.some((header) => line.startsWith(header))) {
        // 遇到非笔记标题，停止删除。
        deleteMode = false
        result.push(line)
        continue
      }

      if (!deleteMode) result.push(line)
    }

    // 格式化处理 - 确保每个标题前、后有且仅有一个空行。
    let finalResult = []
    for (let i = 0; i < result.length; i++) {
      const line = result[i]
      const prevLine = result[i - 1] || ''
      const nextLine = result[i + 1] || ''

      // 如果当前行是标题
      if (headers.some((header) => line.startsWith(header))) {
        // 确保标题前有且仅有一个空行
        if (prevLine.trim() !== '') {
          finalResult.push('')
        }

        // 添加标题本身
        finalResult.push(line)

        // 确保标题后有且仅有一个空行
        if (nextLine.trim() !== '') {
          finalResult.push('')
        }
      } else {
        // 如果当前行不是标题，直接添加到结果中
        finalResult.push(line)
      }
    }

    finalResult = finalResult.filter((line, index, array) => {
      const prevLine = array[index - 1] || ''
      const nextLine = array[index + 1] || ''
      // 如果当前行是空行，且前后也都是空行，则过滤掉
      return !(
        line.trim() === '' &&
        prevLine.trim() === '' &&
        nextLine.trim() === ''
      )
    })

    // 如果 finalResult 最后一行非空，则添加一个空行
    if (finalResult[finalResult.length - 1].trim() !== '') {
      finalResult.push('')
    }

    return finalResult
  }

  /**
   * 根据 this.notesInfo.topInfoMap 重置首页目录。
   */
  setHomeTopInfos() {
    // console.log('this.homeReadme.lines', this.homeReadme.lines)
    // console.log('this.notes.map:', this.notes.map);
    this.homeReadme.lines.forEach((line, index) => {
      const match = line.match(this.homeReadme.noteTitleReg)
      if (match) {
        const notesID = match[3]
        this.homeReadme.ids.add(notesID)
        this.homeReadme.idList.push(notesID)
        if (notesID in this.notesInfo.topInfoMap) {
          let prefixSymbol = match[1]
          if (this.notesInfo.doneIds.has(notesID)) {
            prefixSymbol = prefixSymbol.replace('[ ]', '[x]')
          } else {
            prefixSymbol = prefixSymbol.replace('[x]', '[ ]')
          }
          this.homeReadme.lines[
            index
          ] = `${prefixSymbol}${this.notesInfo.topInfoMap[notesID]}`
        } else {
          // 清理不存在的笔记
          console.warn(`⚠️ ${this.repoName}.${notesID} - 笔记不存在`)
          this.homeReadme.lines[index] = ''
        }
      }
    })
    // console.log('this.notesInfo.topInfoMap', this.notesInfo.topInfoMap)
  }

  /**
   * 处理不在目录中的笔记
   * - 处理未分配到首页 README 中的笔记
   * - 打印存在于实际仓库中的笔记 ID 但是不存在于首页 README 中的笔记 ID，并将其追加到首页 README 的末尾。
   */
  handleUnassignedNotes() {
    const unassignedNoteIds = [...this.notesInfo.ids].filter(
      (noteID) => !this.homeReadme.ids.has(noteID)
    )

    if (unassignedNoteIds.length > 0) {
      console.warn(
        `⚠️ ${this.repoName} 存在未分组的笔记：${[...unassignedNoteIds].join(
          ', '
        )}`,
        '已加入到目录结尾，请手动调整笔记位置！'
      )
      this.homeReadme.lines.push(
        `${this.EOL}${this.EOL}## ⏰ pending${this.EOL}${this.EOL}` +
          [...unassignedNoteIds]
            .map((noteId) => `- [ ] ${this.notesInfo.topInfoMap[noteId]}`)
            .join(this.EOL)
      )
    }
  }

  updateNotesToc(id = '', lines = []) {
    this.updateToc({ id, lines, isHome: false })
  }

  updateHomeToc(lines = []) {
    this.updateToc({ lines, isHome: true })
  }

  updateToc({
    id = '', // 如果是处理非 homeReadme，则需要具体的笔记 id。
    lines = '', // required
    isHome = false, // 是否是处理 homeReadme
  }) {
    let startLineIdx = -1,
      endLineIdx = -1
    lines.forEach((line, idx) => {
      if (line.startsWith(this.tocStartTag)) startLineIdx = idx
      if (line.startsWith(this.tocEndTag)) endLineIdx = idx
    })
    if (startLineIdx === -1 || endLineIdx === -1) return

    // 收集标题，并更新编号。
    const titles = isHome ? this.homeReadme.titles : []
    const headers = ['## ', '### ', '#### ', '##### ', '###### '] // 2~6 级标题，忽略 1 级标题。
    isHome && headers.push('# ') // homeReadme 处理标题范围 1~6；非 homeReadme 处理标题范围 2~6。
    const titleNumbers = Array(7).fill(0) // 用于存储每个级别的编号
    let notesCount = 0 // 统计每个标题下的直属笔记数量
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isHeader = headers.some((header) => line.startsWith(header))
      const match = line.match(this.homeReadme.noteTitleReg)
      if (isHeader) {
        if (isHome) {
          this.homeReadme.titlesNotesCount.push(notesCount)
          notesCount = 0
        }
        const [numberedTitle, plainTitle] = addNumberToTitle(line, titleNumbers)
        titles.push(numberedTitle)
        lines[i] = numberedTitle // 更新原行内容
        // console.log('lines[i] =>', numberedTitle)
      } else if (isHome && match) {
        // const noteID = match[3];
        notesCount++
      }
    }
    if (isHome) {
      this.homeReadme.titlesNotesCount.push(notesCount)
      notesCount = 0
      this.homeReadme.titlesNotesCount.splice(0, 1)
    }

    const toc = generateToc(titles, this.EOL)
    // console.log('toc =>', toc)

    let bilibiliUrl = ''
    // let BilibiliOutsidePlayerCompStr = '';
    if (!isHome) {
      const notesConfig = this.notesInfo.configMap[id]
      if (notesConfig && notesConfig.bilibili.length > 0) {
        bilibiliUrl = notesConfig.bilibili
          .map(
            (bvid, i) =>
              `[bilibili.${this.repoName}.${id}.${i + 1}](${
                BILIBILI_VIDEO_BASE_URL + bvid
              })`
          )
          .join('、')
        bilibiliUrl = `- ${bilibiliUrl}`
        // BilibiliOutsidePlayerCompStr = notesConfig.bilibili.map((bvid, i) => `<BilibiliOutsidePlayer id="${bvid}" />`).join(this.EOL);
      }
    }
    // console.log('bilibiliUrl =>', bilibiliUrl);

    if (bilibiliUrl) {
      lines.splice(
        startLineIdx + 1,
        endLineIdx - startLineIdx - 1,
        // BilibiliOutsidePlayerCompStr,
        this.EOL,
        bilibiliUrl,
        ...toc.split(this.EOL)
      )
    } else {
      lines.splice(
        startLineIdx + 1,
        endLineIdx - startLineIdx - 1,
        ...toc.split(this.EOL)
      )
    }

    // 生成 toc
    function generateToc(titles, EOL) {
      const toc = titles
        .map((title) => {
          const level = title.indexOf(' ')
          const text = title.slice(level).trim()
          const anchor = generateAnchor(text)
          const baseLevel = isHome ? 1 : 2
          return ' '.repeat((level - baseLevel) * 2) + `- [${text}](#${anchor})`
        })
        .join(EOL)
      // !添加换行符 - 适配 prettier 格式化
      return `${EOL}${toc}${EOL}`
    }

    function addNumberToTitle(title, titleNumbers) {
      // !注意：windows 环境下，读到的 title 结尾会带有一个 /r，在正则匹配的时候，不要记上结尾 $
      // console.log(title, title.endsWith('\r'));
      const match = title.match(
        /^(\#+)\s*((\d+(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?)\.\s*)?(.*)/
      )
      const plainTitle = match ? match[9].trim() : title.trim()

      const level = title.indexOf(' ')
      const baseLevel = 2 // 基础级别为2

      // 一级标题
      if (level === 1) return [title, plainTitle]

      // 重置当前级别以上的编号
      for (let i = level + 1; i < titleNumbers.length; i++) titleNumbers[i] = 0

      // 增加当前级别的编号
      titleNumbers[level] += 1

      // 生成新的编号
      const newNumber = titleNumbers.slice(baseLevel, level + 1).join('.')

      // 构建新的标题
      const headerSymbol = title.slice(0, level).trim() // 获取原有的 # 符号
      const newTitle = `${headerSymbol} ${newNumber}. ${plainTitle}`

      return [newTitle, plainTitle]
    }

    // !注意：需要跟和 .vitepress/config.mts 中的 markdown.anchor.slugify 的锚点要保持一致。
    function generateAnchor(label) {
      slugger.reset()
      return slugger.slug(label)
    }
  }

  /**
   * - 基于 this.homeReadme.lines 生成 vitepress 上的 TOC.md 文件内容。
   */
  updateVitepressDocs() {
    const updateFile_TOC_MD = () => {
      const lines_ = this.homeReadme.lines
      /**
       * 重写路径
       * - github 上的首页 README.md 中记录的路径是 github 的路径格式。
       * - vitepress 需要的 TOC.md 中的笔记链接需要改为基于 github pages 的路径格式。
       */
      const lines = lines_.map((line) =>
        line
          .replaceAll(this.repoNotesUrl, this.githubPageNotesUrl)
          .replaceAll('README.md', 'README')
      )

      let tocStartIdx = lines_.indexOf(this.tocStartTag)
      tocStartIdx =
        tocStartIdx === -1
          ? lines_.indexOf(this.tocStartTag + '\r')
          : tocStartIdx
      let tocEndIdx = lines_.indexOf(this.tocEndTag)
      tocEndIdx =
        tocEndIdx === -1 ? lines_.indexOf(this.tocEndTag + '\r') : tocEndIdx

      // console.log(lines_)
      // console.log('tocStartIdx', tocStartIdx)
      // console.log('tocEndIdx', tocEndIdx)

      if (tocStartIdx !== -1 && tocEndIdx !== -1) {
        // 将 tocStartIdx 到 tocEndIdx 之间的内容给删除后再写入。
        fs.writeFileSync(
          this.vpTocPath,
          lines
            .slice(0, tocStartIdx)
            .concat(lines.slice(tocEndIdx + 1))
            .join(this.EOL)
        )
      } else {
        fs.writeFileSync(this.vpTocPath, lines.join(this.EOL))
      }
    }

    const updateFile_SIDEBAT_JSON = (sidebarPath, linkPrefix) => {
      const itemList = []
      this.homeReadme.idList.forEach((id) => {
        const notesDirName = this.notesInfo.dirNameList.find((dirName) =>
          dirName.startsWith(id)
        )
        // console.log('notesDirName', notesDirName)
        if (notesDirName) {
          const notesConfig = this.notesInfo.configMap[id]

          let prefixIcon = '⏰'
          // if (this.notesInfo.doneIds.has(id)) prefixIcon = '✅'
          if (notesConfig && notesConfig.done) prefixIcon = '✅'
          if (notesConfig && notesConfig.deprecated) prefixIcon = '❌'
          const text = this.sidebar_isNotesIDVisible
            ? notesDirName
            : notesDirName.replace(/\d\d\d\d. /, '')
          itemList.push({
            text: `${prefixIcon} ${text}`,
            link: `${linkPrefix}/${notesDirName}/README`,
          })
        }
      })

      // console.log('this.homeReadme.titles', this.homeReadme.titles);
      // console.log('this.homeReadme.titlesNotesCount', this.homeReadme.titlesNotesCount);

      fs.writeFileSync(
        sidebarPath,
        JSON.stringify(
          genHierarchicalSidebar(
            itemList,
            this.homeReadme.titles,
            this.homeReadme.titlesNotesCount,
            this.sidebar_isCollapsed
          )
        )
      )
    }

    updateFile_TOC_MD()
    updateFile_SIDEBAT_JSON(this.vpSidebarPath, '/notes')

    // 将笔记数据同步到根知识库的指定位置
    if (this.rootDocsSrcDir) {
      if (
        fs.existsSync(this.rootDocsSrcDir) &&
        fs.statSync(this.rootDocsSrcDir).isDirectory()
      ) {
        const repoDir = path.resolve(this.rootDocsSrcDir, this.repoName)
        if (!fs.existsSync(repoDir) || !fs.statSync(repoDir).isDirectory()) {
          fs.mkdirSync(repoDir)
        }
        updateFile_SIDEBAT_JSON(
          path.resolve(repoDir, 'sidebar.json'),
          `/${this.repoName}`
        )
        this.notesInfo.dirNameList.forEach((dirName) => {
          const notesDir = path.resolve(repoDir, dirName)
          if (
            !fs.existsSync(notesDir) ||
            !fs.statSync(notesDir).isDirectory()
          ) {
            fs.mkdirSync(notesDir)
          }
          const sourceREADMEPath = path.resolve(
            ROOT_DIR,
            'notes',
            dirName,
            'README.md'
          )
          const targetREADMEPath = path.resolve(notesDir, 'README.md')
          fs.copyFileSync(sourceREADMEPath, targetREADMEPath)
          const sourceAssetsPath = path.resolve(
            ROOT_DIR,
            'notes',
            dirName,
            'assets'
          )
          if (fs.existsSync(sourceAssetsPath)) {
            const targetAssetsPath = path.resolve(notesDir, 'assets')
            fs.cpSync(sourceAssetsPath, targetAssetsPath, { recursive: true })
          }
          // const sourceDemosPath = path.resolve(
          //   ROOT_DIR,
          //   'notes',
          //   dirName,
          //   'demos'
          // )
          // if (fs.existsSync(sourceDemosPath)) {
          //   const targetDemosPath = path.resolve(notesDir, 'demos')
          //   fs.cpSync(sourceDemosPath, targetDemosPath, { recursive: true })
          // }
        })
      }
    }
  }

  updateReadme() {
    this.checkNotesInfo()
    this.getNotesInfo()
    this.homeReadme.contents = fs.readFileSync(this.homeReadme.path, 'utf8')
    this.homeReadme.lines = this.resetHomeTopInfos()
    this.setHomeTopInfos()

    // console.log(this.notes.ids, this.homeReadme.ids);

    this.handleUnassignedNotes()
    this.updateHomeToc(this.homeReadme.lines)
    fs.writeFileSync(this.homeReadme.path, this.homeReadme.lines.join(this.EOL))
    this.updateVitepressDocs()

    console.log(`✅ ${this.repoName} \t README.md updated.`)
  }
}

export default ReadmeUpdater
