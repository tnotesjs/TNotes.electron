import {
  author,
  ignore_dirs,
  repoName,
  root_item,
} from '../../../../.tnotes.json'

/**
 * 笔记仓库名儿
 */
export const REPO_NAME: string = repoName

/**
 * 笔记仓库作者
 */
export const AUTHOR: string = author

/**
 * notes 目录下需要忽略的笔记目录
 * @example
 * [".vscode", "0000", "assets", "node_modules"]
 */
export const IGNORE_DIRS: string[] = ignore_dirs

/**
 * 根知识库配置项
 */
export const ROOT_ITEM = root_item

/**
 * 存储本地笔记文件夹所在位置的 key
 */
export const NOTES_DIR_KEY: string = 'NOTES_DIR_KEY__' + repoName

/**
 * 用户选择的视图
 */
export const NOTES_VIEW_KEY: string = 'NOTES_VIEW_KEY__' + repoName

/**
 * 全局配置 EnWordList.vue 组件是否自动展示词汇卡片
 */
export const EN_WORD_LIST_COMP_IS_AUTO_SHOW_CARD: string =
  'EN_WORD_LIST_COMP_IS_AUTO_SHOW_CARD__' + repoName

/**
 * MarkMap 默认主题配置
 */
export const MARKMAP_THEME_KEY: string = 'MARKMAP_THEME_KEY__' + repoName

/**
 * MarkMap 默认展开层级配置
 */
export const MARKMAP_EXPAND_LEVEL_KEY: string =
  'MARKMAP_EXPAND_LEVEL_KEY__' + repoName

/**
 * 侧边栏是否显示笔记编号配置
 */
export const SIDEBAR_SHOW_NOTE_ID_KEY: string =
  'SIDEBAR_SHOW_NOTE_ID_KEY__' + repoName

/**
 * VitePress HOME README 文件名
 * 该文件内容基于 HOME README 而生成，作为 github pages 中的 README 文件，主要用于展示笔记的目录结构。
 */
export const TOC: string = 'TOC'
export const TOC_MD: string = TOC + '.md'

/**
 * 英语单词仓库基地址
 * https://github.com/tnotesjs/en-words/blob/main/{word}.md
 */
export const EN_WORDS_REPO_BASE_URL: string =
  'https://github.com/tnotesjs/TNotes.en-words/blob/main/'

/**
 * 英语单词仓库 raw 地址
 * https://raw.githubusercontent.com/tnotesjs/TNotes.en-words/refs/heads/main/{word}.md
 */
export const EN_WORDS_REPO_BASE_RAW_URL: string =
  'https://raw.githubusercontent.com/tnotesjs/TNotes.en-words/refs/heads/main/'
