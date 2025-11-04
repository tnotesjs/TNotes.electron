/**
 * .vitepress/tnotes/config/constants.ts
 *
 * 常量定义（从配置中派生的路径和URL常量）
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getConfigManager } from './ConfigManager'

const configManager = getConfigManager()
const config = configManager.getAll()

// 导出配置项（向后兼容）
export const {
  author,
  ignore_dirs,
  menuItems,
  port,
  repoName,
  rootSidebarDir,
  sidebarShowNoteId,
  socialLinks,
  root_item,
} = config

// URL 常量
export const BILIBILI_VIDEO_BASE_URL = 'https://www.bilibili.com/video/'
export const TNOTES_YUQUE_BASE_URL =
  'https://www.yuque.com/tdahuyou/tnotes.yuque/'

// 目录常量
export const __dirname = configManager.getDirname()

/**
 * TNotes.* 笔记仓库的基路径
 * @example `/Users/huyouda/zm/notes/` 【在此目录下存放其它 TNotes.* 笔记仓库】
 */
export const TNOTES_BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..')
export const EN_WORDS_DIR = path.resolve(TNOTES_BASE_DIR, 'TNotes.en-words')

/**
 * TNotes.* 当前的笔记仓库根路径
 * @example `/Users/huyouda/zm/notes/TNotes.template/`
 */
export const ROOT_DIR_PATH = path.resolve(__dirname, '..', '..', '..')
export const ROOT_README_PATH = path.resolve(ROOT_DIR_PATH, 'README.md')
export const ROOT_CONFIG_PATH = path.resolve(ROOT_DIR_PATH, '.tnotes.json')
export const NOTES_DIR_PATH = path.resolve(ROOT_DIR_PATH, 'notes')
export const VP_DIR_PATH = path.resolve(ROOT_DIR_PATH, '.vitepress')
export const PUBLIC_PATH = path.resolve(ROOT_DIR_PATH, 'public')
export const GITHUB_DIR_PATH = path.resolve(ROOT_DIR_PATH, '.github')
export const GITHUB_DEPLOY_YML_PATH = path.resolve(
  GITHUB_DIR_PATH,
  'workflows',
  'deploy.yml'
)
export const VP_TOC_PATH = path.resolve(ROOT_DIR_PATH, 'TOC.md')
export const VP_SIDEBAR_PATH = path.resolve(ROOT_DIR_PATH, 'sidebar.json')
export const ROOT_PKG_PATH = path.resolve(ROOT_DIR_PATH, 'package.json')
export const VSCODE_SETTINGS_PATH = path.resolve(
  ROOT_DIR_PATH,
  '.vscode',
  'settings.json'
)
export const VSCODE_TASKS_PATH = path.resolve(
  ROOT_DIR_PATH,
  '.vscode',
  'tasks.json'
)

// 文本常量
export const EOL = '\n'
export const MERGED_README_FILENAME = 'MERGED_README.md'
export const MERGED_README_PATH = path.resolve(
  ROOT_DIR_PATH,
  MERGED_README_FILENAME
)
export const SEPARATOR = `<!-- !======> SEPARATOR <====== -->`

export const NOTES_TOC_START_TAG = '<!-- region:toc -->'
export const NOTES_TOC_END_TAG = '<!-- endregion:toc -->'

/**
 * TNotes 常量配置
 */
export const CONSTANTS = {
  // 端口配置
  DEFAULT_PORT: 5173,

  // 文件名配置
  README_FILENAME: 'README.md',
  CONFIG_FILENAME: '.tnotes.json',
  PID_FILENAME: '.vitepress-pid',

  // 笔记 ID 配置
  NOTE_ID_LENGTH: 4,
  NOTE_ID_PATTERN: /^\d{4}\./,
  NOTE_ID_PREFIX_PATTERN: /^\d{4}/,

  // Git 配置
  DEFAULT_BRANCH: 'main',

  // 缓存配置
  CACHE_TTL: 5000,

  // 终端输出颜色
  COLORS: {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
  } as const,

  // Emoji
  EMOJI: {
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️',
    INFO: 'ℹ️',
    PROGRESS: '⏳',
    ROCKET: '🚀',
    STOP: '🛑',
    SPARKLES: '✨',
    LINK: '🔗',
    FILE: '📄',
    GIT: '📦',
    DEBUG: '🐛',
  } as const,
} as const

// 导出常用的文件名常量（便于直接导入）
export const README_FILENAME = CONSTANTS.README_FILENAME
export const TNOTES_JSON_FILENAME = CONSTANTS.CONFIG_FILENAME
export const VITEPRESS_PID_FILENAME = CONSTANTS.PID_FILENAME

// 导出路径常量别名（向后兼容）
export const NOTES_PATH = NOTES_DIR_PATH

// GitHub URL 常量
export const REPO_URL = `https://github.com/${author}/${repoName}/tree/main`
export const REPO_NOTES_URL = `https://github.com/${author}/${repoName}/tree/main/notes`

/**
 * 处理图片资源路径
 * @example https://github.com/Tdahuyou/TNotes.html-css-js/blob/main/notes/0000/%E5%B0%81%E9%9D%A2/JavaScript.png?raw=true
 */
export const REPO_BLOB_URL_1 = `https://github.com/${author}/${repoName}/blob/main/notes`
export const REPO_BLOB_URL_2 = `?raw=true`

export const GITHUB_PAGE_URL = `https://tnotesjs.github.io/${repoName}`
export const GITHUB_PAGE_NOTES_URL = `https://tnotesjs.github.io/${repoName}/notes`
