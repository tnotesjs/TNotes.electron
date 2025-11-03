import { EOL } from '../constants'
import { generateAnchor } from './generateAnchor'

/**
 * 生成 Markdown TOC（目录）
 * @param titles - 标题列表
 * @param baseLevel - 基础层级（默认为 2）
 * @returns 生成的 TOC 字符串
 */
export function generateToc(titles: string[], baseLevel = 2): string {
  const toc = titles
    .map((title) => {
      const level = title.indexOf(' ')
      const text = title.slice(level).trim()
      const anchor = generateAnchor(text)
      return ' '.repeat((level - baseLevel) * 2) + `- [${text}](#${anchor})`
    })
    .join(EOL)

  // !在 TOC 区域前后添加换行符 - 适配 prettier 格式化
  return `${EOL}${toc}${EOL}`
}
