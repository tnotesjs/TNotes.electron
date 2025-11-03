/**
 * .vitepress/config/constants.ts
 *
 * 常量配置
 */
import { author, ignore_dirs, repoName } from '../../.tnotes.json'

/**
 * 忽略的文件和目录列表
 */
export const IGNORE_LIST = [
  './README.md',
  './MERGED_README.md',
  ...ignore_dirs.map((dir) => `**/${dir}/**`),
]

/**
 * GitHub Pages URL
 */
export const GITHUB_PAGE_URL =
  'https://' + author.toLowerCase() + '.github.io/' + repoName + '/'
