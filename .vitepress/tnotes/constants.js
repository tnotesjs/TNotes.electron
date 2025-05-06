import { fileURLToPath } from 'url'
import path from 'path'
import { getTnotesConfig } from './utils/index.js'
import { v4 as uuidv4 } from 'uuid'

const {
  author,
  ignore_dirs,
  repoName,
  socialLinks,
  menuItems,
  sidebar_isNotesIDVisible,
  sidebar_isCollapsed,
  port,
  rootDocsSrcDir,
} = getTnotesConfig()

export {
  author,
  ignore_dirs,
  repoName,
  socialLinks,
  menuItems,
  sidebar_isNotesIDVisible,
  sidebar_isCollapsed,
  port,
  rootDocsSrcDir,
}

export const BILIBILI_VIDEO_BASE_URL = 'https://www.bilibili.com/video/'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * TNotes.* 笔记仓库的基路径
 * @example
 * `/Users/huyouda/zm/notes/` 【在此目录下存放其它 TNotes.* 笔记仓库】
 */
export const TNOTES_BASE_DIR = path.resolve(__dirname, '..', '..', '..')

/**
 * TNotes.* 当前的笔记仓库根路径
 * @example
 * `/Users/huyouda/zm/notes/TNotes.template/`
 */
export const ROOT_DIR = path.resolve(__dirname, '..', '..')
export const ROOT_README_PATH = path.resolve(ROOT_DIR, 'README.md')
export const NOTES_DIR = path.resolve(ROOT_DIR, 'notes')
export const VP_DIR_PATH = path.resolve(ROOT_DIR, '.vitepress')
export const GITHUB_DIR_PATH = path.resolve(ROOT_DIR, '.github')
export const GITHUB_DEPLOYYML_PATH = path.resolve(
  GITHUB_DIR_PATH,
  'workflows',
  'deploy.yml'
)
export const VP_TOC_PATH = path.resolve(ROOT_DIR, 'TOC.md')
export const VP_SIDEBAR_PATH = path.resolve(ROOT_DIR, 'sidebar.json')
export const ROOT_PKG_PATH = path.resolve(ROOT_DIR, 'package.json')
export const VSCODE_SETTINGS_PATH = path.resolve(
  ROOT_DIR,
  '.vscode',
  'settings.json'
)

export const EOL = '\n'
export const MERGED_README_FILENAME = 'MERGED_README.md'
export const MERGED_README_PATH = path.resolve(ROOT_DIR, MERGED_README_FILENAME)
export const SEPERATOR = `<!-- !======> SEPERATOR <====== -->`

export const NOTES_TOC_START_TAG = '<!-- region:toc -->'
export const NOTES_TOC_END_TAG = '<!-- endregion:toc -->'

export const REPO_URL = `https://github.com/${author}/${repoName}/tree/main`
export const REPO_NOTES_URL = `https://github.com/${author}/${repoName}/tree/main/notes`

/**
 * 处理图片资源路径
 * @example
 * https://github.com/Tdahuyou/TNotes.html-css-js/blob/main/notes/0000/%E5%B0%81%E9%9D%A2/JavaScript.png?raw=true
 */
export const REPO_BLOB_URL_1 = `https://github.com/${author}/${repoName}/blob/main/notes`
export const REPO_BLOB_URL_2 = `?raw=true`

export const GITHUB_PAGE_URL = `https://tdahuyou.github.io/${repoName}`
export const GITHUB_PAGE_NOTES_URL = `https://tdahuyou.github.io/${repoName}/notes`

/**
 * 新增笔记 README.md 模板
 */
export const NEW_NOTES_README_MD_TEMPLATE = `

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

`

/**
 * 新增笔记 .tnotes.json 模板
 */
const NEW_NOTES_TNOTES_JSON_TEMPLATE = {
  bilibili: [],
  done: false,
  enableDiscussions: false,
}

export const getNewNotesTnotesJsonTemplate = (needToString = true) => {
  const temp = {
    ...NEW_NOTES_TNOTES_JSON_TEMPLATE,
    id: uuidv4(),
  }
  if (needToString) {
    return JSON.stringify(temp, null, 2)
  } else {
    return temp
  }
}
