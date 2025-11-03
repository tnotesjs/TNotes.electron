/**
 * 更新 notes README 笔记内容 - 自动生成标题编号、更新目录
 * 读取笔记头部信息，更新 home README，动态生成目录
 */
import fs from 'fs'
import path from 'path'
import type { NoteConfig } from './types'

import {
  author,
  BILIBILI_VIDEO_BASE_URL,
  EOL,
  getNewNotesTnotesJsonTemplate,
  GITHUB_PAGE_NOTES_URL,
  ignore_dirs,
  menuItems,
  NEW_NOTES_README_MD_TEMPLATE,
  NOTES_DIR_PATH,
  NOTES_TOC_END_TAG,
  NOTES_TOC_START_TAG,
  REPO_BLOB_URL_1,
  REPO_BLOB_URL_2,
  REPO_NOTES_URL,
  repoName,
  ROOT_CONFIG_PATH,
  ROOT_DIR_PATH,
  ROOT_README_PATH,
  rootSidebarDir,
  sidebar_isCollapsed,
  sidebar_isNotesIDVisible,
  socialLinks,
  TNOTES_YUQUE_BASE_URL,
  VP_SIDEBAR_PATH,
  VP_TOC_PATH,
} from './constants'

import {
  createAddNumberToTitle,
  generateToc,
  genHierarchicalSidebar,
  getGitTimestamps,
} from './utils/index'

interface NotesInfo {
  topInfoMap: Record<string, string>
  configMap: Record<string, NoteConfig>
  ids: Set<string>
  doneIds: Set<string>
  dirNameList: string[]
}

interface HomeReadme {
  path: string
  contents: string
  lines: string[]
  titles: string[]
  titlesNotesCount: number[]
  noteTitleReg: RegExp
  ids: Set<string>
  idList: string[]
}

class ReadmeUpdater {
  private readonly EOL: string
  private readonly githubPageNotesUrl: string
  private readonly newNotesReadmeMdTemplate: string
  private readonly notesDirPath: string
  private readonly repoBlobUrl1: string
  private readonly repoBlobUrl2: string
  private readonly repoNotesUrl: string
  private readonly rootReadmePath: string
  private readonly tocEndTag: string
  private readonly tocStartTag: string
  private readonly vpTocPath: string
  private readonly vpSidebarPath: string
  private readonly rootConfigPath: string
  private readonly author: string
  private readonly repoName: string
  private readonly ignoreDirs: string[]
  private readonly sidebar_isNotesIDVisible: boolean
  private readonly sidebar_isCollapsed: boolean
  private readonly socialLinks: any
  private readonly menuItems: any
  private readonly rootSidebarDir: string

  private notesInfo: NotesInfo
  private homeReadme: HomeReadme

  constructor() {
    this.EOL = EOL
    this.githubPageNotesUrl = GITHUB_PAGE_NOTES_URL
    this.newNotesReadmeMdTemplate = NEW_NOTES_README_MD_TEMPLATE
    this.notesDirPath = NOTES_DIR_PATH
    this.repoBlobUrl1 = REPO_BLOB_URL_1
    this.repoBlobUrl2 = REPO_BLOB_URL_2
    this.repoNotesUrl = REPO_NOTES_URL
    this.rootReadmePath = ROOT_README_PATH
    this.tocEndTag = NOTES_TOC_END_TAG
    this.tocStartTag = NOTES_TOC_START_TAG
    this.vpTocPath = VP_TOC_PATH
    this.vpSidebarPath = VP_SIDEBAR_PATH
    this.rootConfigPath = ROOT_CONFIG_PATH

    this.author = author
    this.repoName = repoName
    this.ignoreDirs = ignore_dirs || []
    this.sidebar_isNotesIDVisible = sidebar_isNotesIDVisible || false
    this.sidebar_isCollapsed = sidebar_isCollapsed || true
    this.socialLinks = socialLinks
    this.menuItems = menuItems
    this.rootSidebarDir = rootSidebarDir
      ? path.resolve(ROOT_DIR_PATH, rootSidebarDir)
      : ''

    this.notesInfo = {
      topInfoMap: {},
      configMap: {},
      ids: new Set(),
      doneIds: new Set(),
      dirNameList: [],
    }

    this.homeReadme = {
      path: ROOT_README_PATH,
      contents: '',
      lines: [],
      titles: [],
      titlesNotesCount: [],
      noteTitleReg: /(\s*-\s*\[\s*x?\s*\]\s*)(\[?)(\d{4})(.*)/,
      ids: new Set(),
      idList: [],
    }
  }

  /**
   * 初始化笔记目录列表
   * 遍历所有可能的笔记目录，检查是否符合笔记目录的规范，并将其加入到 dirNameList 中
   */
  async initNotesDirNameList(): Promise<void> {
    for (const notesDirName of await fs.promises.readdir(this.notesDirPath)) {
      if (await this.isNotesDir(notesDirName)) {
        this.notesInfo.dirNameList.push(notesDirName)
      }
    }
  }

  /**
   * 判断给定的目录名是否是一个合法的笔记目录
   * - 排除 ignoreDirs 中配置的忽略目录
   * - 确保是目录而非文件
   * - 笔记目录名称必须以 4 位数字开头
   */
  async isNotesDir(notesDirName: string): Promise<boolean> {
    if (this.ignoreDirs.includes(notesDirName)) return false
    const stats = await fs.promises.lstat(
      path.resolve(this.notesDirPath, notesDirName)
    )
    return stats.isDirectory() && /^\d{4}.\s/.test(notesDirName)
  }

  /**
   * 生成笔记标题行
   * 标题格式为带链接的 Markdown 格式，点击跳转到对应的 GitHub 仓库上的笔记位置
   */
  genNotesTitleLine(notesDirName: string): string {
    return `# [${notesDirName}](${this.repoNotesUrl}/${encodeURIComponent(
      notesDirName
    )})`
  }

  /**
   * 获取指定笔记目录下的 README.md 文件路径
   */
  getNotesReadmePath(notesDirName: string): string {
    return path.resolve(this.notesDirPath, notesDirName, 'README.md')
  }

  /**
   * 获取指定笔记目录下的 .tnotes.json 配置文件路径
   */
  getNotesConfigPath(notesDirName: string): string {
    return path.resolve(this.notesDirPath, notesDirName, '.tnotes.json')
  }

  /**
   * 异步读取指定笔记目录下的 .tnotes.json 配置文件内容
   */
  async getNotesConfig(notesDirName: string): Promise<NoteConfig> {
    return JSON.parse(
      await fs.promises.readFile(this.getNotesConfigPath(notesDirName), 'utf8')
    )
  }

  /**
   * 异步判断文件或目录是否存在
   */
  async isExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK)
      return true
    } catch {
      return false
    }
  }

  /**
   * 检查所有笔记目录中是否包含必要的文件（README.md 和 .tnotes.json）
   * 如果文件缺失，则根据模板生成对应文件
   *
   * 主要功能点：
   * 1. 检查每个笔记目录是否包含 README.md 文件
   * 2. 如果 README.md 不存在，则创建并写入默认模板内容
   * 3. 如果 .tnotes.json 配置文件不存在，则创建并写入默认配置
   * 4. 如果配置文件已存在，则将其与默认模板进行合并，确保字段完整
   * 5. 利用 git 命令获取这篇笔记的 created_at、updated_at 时间戳
   */
  async ensureNoteFilesExist(): Promise<void> {
    for (const notesDirName of this.notesInfo.dirNameList) {
      const notesPath = this.getNotesReadmePath(notesDirName)
      const notesConfigPath = this.getNotesConfigPath(notesDirName)
      const notesTitle = this.genNotesTitleLine(notesDirName)

      const noteId = notesDirName.slice(0, 4)

      // README.md 不存在，重新创建 README.md 和 .tnotes.json
      if (!(await this.isExists(notesPath))) {
        fs.writeFileSync(
          notesPath,
          notesTitle + this.newNotesReadmeMdTemplate,
          'utf8'
        )
        const timeInfo = await getGitTimestamps(notesPath, noteId)
        const notesConfigData = getNewNotesTnotesJsonTemplate(false)
        const notesConfig: NoteConfig =
          typeof notesConfigData === 'string'
            ? JSON.parse(notesConfigData)
            : notesConfigData
        if (timeInfo) {
          notesConfig.created_at = timeInfo.created
          notesConfig.updated_at = timeInfo.updated
        }
        fs.writeFileSync(
          notesConfigPath,
          JSON.stringify(notesConfig, null, 2),
          'utf8'
        )
        console.log(`${notesDirName} 笔记不存在，已完成初始化。`)
        return
      }

      // .tnotes.json 配置文件存在，则更新 updated_at、created_at，若不存在，重新创建 .tnotes.json
      if (await this.isExists(notesConfigPath)) {
        const data = await fs.promises.readFile(notesConfigPath, 'utf8')
        const defaultConfigData = getNewNotesTnotesJsonTemplate(false)
        const defaultConfig: NoteConfig =
          typeof defaultConfigData === 'string'
            ? JSON.parse(defaultConfigData)
            : defaultConfigData
        const notesConfig = {
          ...defaultConfig,
          ...JSON.parse(data), // 已有配置
        }
        const timeInfo = await getGitTimestamps(notesPath, noteId)
        if (timeInfo) {
          notesConfig.created_at = timeInfo.created
          notesConfig.updated_at = timeInfo.updated
        }
        await fs.promises.writeFile(
          notesConfigPath,
          JSON.stringify(notesConfig, null, 2),
          'utf8'
        )
      } else {
        const notesConfigData = getNewNotesTnotesJsonTemplate(false)
        const notesConfig: NoteConfig =
          typeof notesConfigData === 'string'
            ? JSON.parse(notesConfigData)
            : notesConfigData
        const timeInfo = await getGitTimestamps(notesPath, noteId)
        if (timeInfo) {
          notesConfig.created_at = timeInfo.created
          notesConfig.updated_at = timeInfo.updated
        }
        await fs.promises.writeFile(
          notesConfigPath,
          JSON.stringify(notesConfig, null, 2),
          'utf8'
        )
      }
    }
  }

  /**
   * 遍历所有笔记目录，完成 this.notesInfo 的初始化
   *
   * 主要功能点：
   * 1. 获取笔记目录列表
   * 2. 检查被遍历到的笔记目录下是否存在笔记文件和笔记配置文件，若不存在，则按照默认模板生成笔记及配置文件
   * 3. 更新笔记标题为超链接的形式，跳转到对应的 github 仓库上的笔记位置
   * 4. 如果笔记头部带有目录区域的标识符，则根据笔记内容更新目录区域
   * 5. 提取笔记头部信息
   * 6. 确保笔记头部信息中的链接有效
   */
  async initNotesInfo(): Promise<void> {
    for (const notesDirName of this.notesInfo.dirNameList) {
      const notesReadmePath = this.getNotesReadmePath(notesDirName)
      const notesID = notesDirName.slice(0, 4)
      this.notesInfo.ids.add(notesID)

      const notesConfig = await this.getNotesConfig(notesDirName)
      this.notesInfo.configMap[notesID] = notesConfig
      if (notesConfig.done) {
        this.notesInfo.doneIds.add(notesID)
      }

      // 读取笔记内容
      const notesLines = (
        await fs.promises.readFile(notesReadmePath, 'utf8')
      ).split(this.EOL)

      // 更新笔记标题
      notesLines[0] = this.genNotesTitleLine(notesDirName)

      // 更新笔记目录
      this.updateNotesToc(notesID, notesLines)

      // 删除笔记结尾的空行
      while (
        notesLines.length > 0 &&
        notesLines[notesLines.length - 1].trim() === ''
      ) {
        notesLines.pop()
      }

      await fs.promises.writeFile(
        notesReadmePath,
        notesLines.join(this.EOL) + this.EOL,
        'utf8'
      )

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

      // 每一行增加俩空格的缩进，以便后续插入到首页中生成目录结构
      topInfoLines = topInfoLines.map((line) => `  ${line}`)
      // 删除 toc startTag 和 endTag
      topInfoLines = topInfoLines.filter(
        (line) =>
          !line.includes(this.tocStartTag) &&
          !line.includes(this.tocEndTag) &&
          line.trim() !== '' &&
          line.trim() !== this.EOL
      )

      // 以 notes ID 作为 key，初始化 notes map，value 为笔记头部信息
      this.notesInfo.topInfoMap[notesID] = `[${notesDirName}](${
        this.repoNotesUrl
      }/${encodeURIComponent(notesDirName)}/README.md)`
    }
  }

  /**
   * 重置首页目录数据
   * @returns 不带有笔记头部信息的 Home Readme 内容
   */
  resetHomeTopInfos(): string[] {
    const lines = this.homeReadme.contents.split(this.EOL)
    const result: string[] = []

    let deleteMode = false

    const headers = ['# ', '## ', '### ', '#### ', '##### ', '###### ']

    // 内容处理 - 目录重置
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.match(this.homeReadme.noteTitleReg)) {
        // 遇到笔记标题，进入删除模式
        deleteMode = true
        result.push(line)
        continue
      }

      if (headers.some((header) => line.startsWith(header))) {
        // 遇到非笔记标题，停止删除
        deleteMode = false
        result.push(line)
        continue
      }

      if (!deleteMode) result.push(line)
    }

    // 格式化处理 - 确保每个标题前、后有且仅有一个空行
    let finalResult: string[] = []
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
    if (
      finalResult.length > 0 &&
      finalResult[finalResult.length - 1].trim() !== ''
    ) {
      finalResult.push('')
    }

    return finalResult
  }

  /**
   * 根据 this.notesInfo.topInfoMap 重置首页目录
   */
  setHomeTopInfos(): void {
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
  }

  /**
   * 处理不在目录中的笔记
   * 处理未分配到首页 README 中的笔记
   * 打印存在于实际仓库中的笔记 ID 但是不存在于首页 README 中的笔记 ID，并将其追加到首页 README 的末尾
   */
  handleUnassignedNotes(): void {
    const unassignedNoteIds = [...this.notesInfo.ids].filter(
      (noteID) => !this.homeReadme.ids.has(noteID)
    )

    if (unassignedNoteIds.length > 0) {
      console.warn(
        `⚠️ ${this.repoName} 存在未分组的笔记：${unassignedNoteIds.join(', ')}`,
        '已加入到目录结尾，请手动调整笔记位置！'
      )
      this.homeReadme.lines.push(
        `${this.EOL}${this.EOL}## ⏰ pending${this.EOL}${this.EOL}` +
          unassignedNoteIds
            .map((noteId) => `- [ ] ${this.notesInfo.topInfoMap[noteId]}`)
            .join(this.EOL)
      )
    }
  }

  /**
   * 更新笔记目录
   */
  updateNotesToc(id: string, lines: string[]): void {
    let startLineIdx = -1,
      endLineIdx = -1
    lines.forEach((line, idx) => {
      if (line.startsWith(this.tocStartTag)) startLineIdx = idx
      if (line.startsWith(this.tocEndTag)) endLineIdx = idx
    })
    if (startLineIdx === -1 || endLineIdx === -1) return

    const titles: string[] = []
    const headers = ['## ', '### ', '#### ', '##### ', '###### '] // 2~6 级标题，忽略 1 级标题
    const addNumberToTitle = createAddNumberToTitle()
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isHeader = headers.some((header) => line.startsWith(header))
      if (isHeader) {
        const [numberedTitle] = addNumberToTitle(line)
        titles.push(numberedTitle)
        lines[i] = numberedTitle // 更新原行内容
      }
    }
    const toc = generateToc(titles, 2)
    const bilibiliTOCItems: string[] = []
    const tnotesTOCItems: string[] = []
    const yuqueTOCItems: string[] = []
    const notesConfig = this.notesInfo.configMap[id]
    if (notesConfig) {
      if (notesConfig.bilibili.length > 0) {
        notesConfig.bilibili.forEach((bvid, i) => {
          bilibiliTOCItems.push(
            `  - [bilibili.${this.repoName}.${id}.${i + 1}](${
              BILIBILI_VIDEO_BASE_URL + bvid
            })`
          )
        })
      }
      if (notesConfig.tnotes.length > 0) {
        notesConfig.tnotes.forEach(([tnotesName, notesID, notesName], i) => {
          tnotesTOCItems.push(
            `  - [TNotes.${tnotesName} - ${
              notesID + (notesName ? `. ${notesName}/README` : '')
            }](${
              `https://tnotesjs.github.io/TNotes.${tnotesName}/notes/` +
              notesID +
              (notesName ? `.%20${encodeURIComponent(notesName)}/README` : '')
            })`
          )
        })
      }
      if (notesConfig.yuque.length > 0) {
        notesConfig.yuque.forEach((slug, i) => {
          yuqueTOCItems.push(
            `  - [TNotes.yuque.${this.repoName.replace('TNotes.', '')}.${id}](${
              TNOTES_YUQUE_BASE_URL + slug
            })`
          )
        })
      }
    }

    const insertTocItems: string[] = []

    if (bilibiliTOCItems.length > 0) {
      insertTocItems.push(
        `- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)`,
        ...bilibiliTOCItems
      )
    }

    if (tnotesTOCItems.length > 0) {
      insertTocItems.push(
        `- [📒 TNotes](https://tnotesjs.github.io/TNotes/)`,
        ...tnotesTOCItems
      )
    }

    if (yuqueTOCItems.length > 0) {
      insertTocItems.push(
        `- [📂 TNotes.yuque](${TNOTES_YUQUE_BASE_URL})`,
        ...yuqueTOCItems
      )
    }

    lines.splice(
      startLineIdx + 1,
      endLineIdx - startLineIdx - 1,
      '',
      ...insertTocItems,
      ...toc.replace(new RegExp(`^${this.EOL}`), '').split(this.EOL)
    )
  }

  /**
   * 更新首页目录
   */
  updateHomeToc(lines: string[]): void {
    let startLineIdx = -1,
      endLineIdx = -1
    lines.forEach((line, idx) => {
      if (line.startsWith(this.tocStartTag)) startLineIdx = idx
      if (line.startsWith(this.tocEndTag)) endLineIdx = idx
    })
    if (startLineIdx === -1 || endLineIdx === -1) return

    const titles = this.homeReadme.titles
    const headers = ['# ', '## ', '### ', '#### ', '##### ', '###### ']
    const addNumberToTitle = createAddNumberToTitle()
    let notesCount = 0 // 统计每个标题下的直属笔记数量
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isHeader = headers.some((header) => line.startsWith(header))
      const match = line.match(this.homeReadme.noteTitleReg)
      if (isHeader) {
        this.homeReadme.titlesNotesCount.push(notesCount)
        const [numberedTitle] = addNumberToTitle(line)
        titles.push(numberedTitle)
        lines[i] = numberedTitle
        notesCount = 0
      } else if (match) {
        notesCount++
      }
    }

    this.homeReadme.titlesNotesCount.push(notesCount)
    this.homeReadme.titlesNotesCount.splice(0, 1)
    const toc = generateToc(titles, 1)

    lines.splice(
      startLineIdx + 1,
      endLineIdx - startLineIdx - 1,
      ...toc.split(this.EOL)
    )
  }

  /**
   * 基于 this.homeReadme.lines 生成 vitepress 上的 TOC.md 文件内容
   */
  updateVitepressDocs(): void {
    const updateFile_TOC_MD = (vpTocPath: string): void => {
      const lines_ = this.homeReadme.lines
      /**
       * 重写路径
       * github 上的首页 README.md 中记录的路径是 github 的路径格式
       * vitepress 需要的 TOC.md 中的笔记链接需要改为基于 github pages 的路径格式
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

      if (tocStartIdx !== -1 && tocEndIdx !== -1) {
        // 将 tocStartIdx 到 tocEndIdx 之间的内容给删除后再写入
        fs.writeFileSync(
          vpTocPath,
          lines
            .slice(0, tocStartIdx)
            .concat(lines.slice(tocEndIdx + 1))
            .join(this.EOL)
        )
      } else {
        fs.writeFileSync(vpTocPath, lines.join(this.EOL))
      }
    }

    const updateFile_SIDEBAT_JSON = (
      sidebarPath: string,
      linkPrefix: string
    ): void => {
      const itemList: Array<{ text: string; link: string }> = []
      this.homeReadme.idList.forEach((id) => {
        const notesDirName = this.notesInfo.dirNameList.find((dirName) =>
          dirName.startsWith(id)
        )
        if (notesDirName) {
          const notesConfig = this.notesInfo.configMap[id]

          let prefixIcon = '⏰'
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

    updateFile_TOC_MD(this.vpTocPath)
    updateFile_SIDEBAT_JSON(this.vpSidebarPath, '/notes')

    if (this.rootSidebarDir) {
      if (
        fs.existsSync(this.rootSidebarDir) &&
        fs.statSync(this.rootSidebarDir).isDirectory()
      ) {
        const repoDir = path.resolve(this.rootSidebarDir, this.repoName)
        if (!fs.existsSync(repoDir) || !fs.statSync(repoDir).isDirectory()) {
          fs.mkdirSync(repoDir)
        }
        updateFile_SIDEBAT_JSON(
          path.resolve(repoDir, 'sidebar.json'),
          this.githubPageNotesUrl
        )
      }
    }
  }

  /**
   * 更新根配置文件
   */
  updateRootConfig(): void {
    let configData = fs.readFileSync(this.rootConfigPath, 'utf8')
    const configObj = JSON.parse(configData)
    configObj['root_item'].completed_notes_count = this.notesInfo.doneIds.size
    configObj['root_item'].updated_at = Date.now()
    fs.writeFileSync(this.rootConfigPath, JSON.stringify(configObj, null, 2))
  }

  /**
   * 主更新函数
   */
  async updateReadme(): Promise<void> {
    await this.initNotesDirNameList()
    await this.ensureNoteFilesExist()
    await this.initNotesInfo()
    this.homeReadme.contents = await fs.promises.readFile(
      this.homeReadme.path,
      'utf8'
    )

    this.homeReadme.lines = this.resetHomeTopInfos()
    this.setHomeTopInfos()
    this.handleUnassignedNotes()
    this.updateHomeToc(this.homeReadme.lines)

    fs.writeFileSync(this.homeReadme.path, this.homeReadme.lines.join(this.EOL))

    this.updateVitepressDocs()
    this.updateRootConfig()

    console.log(`✅ ${this.repoName} \t README.md updated.`)
  }
}

export default ReadmeUpdater
