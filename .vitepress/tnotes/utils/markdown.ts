/**
 * .vitepress/tnotes/utils/markdown.ts
 *
 * Markdown 处理工具函数
 */
import GithubSlugger from 'github-slugger'

const slugger = new GithubSlugger()

/**
 * 生成 GitHub 风格的锚点
 *
 * !注意：锚点的生成规则要保持一致：
 * - .vitepress/config/markdown.config.ts - markdown.anchor.slugify
 * - .vitepress/tnotes/update.ts
 *
 * @param label - 标题文本
 * @returns 生成的锚点字符串
 */
export function generateAnchor(label: string): string {
  slugger.reset()
  return slugger.slug(label)
}

/**
 * 工厂函数，创建一个带有独立编号状态的标题编号生成器
 * @returns 返回 addNumberToTitle 方法
 */
export function createAddNumberToTitle() {
  const titleNumbers = Array(7).fill(0) // 用于存储每个级别的编号

  /**
   * 为标题添加编号
   * @param title - 原始标题
   * @returns [新标题, 纯文本标题]
   */
  return function addNumberToTitle(title: string): [string, string] {
    // 正则匹配提取标题信息
    const match = title.match(
      /^(\#+)\s*((\d+(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?)\.\s*)?(.*)/
    )
    const plainTitle = match ? match[9].trim() : title.trim()

    const level = title.indexOf(' ')
    const baseLevel = 2 // 基础级别为2

    // 一级标题不编号
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
}

/**
 * 生成 Markdown TOC（目录）
 * @param titles - 标题列表
 * @param baseLevel - 基础层级（默认为 2）
 * @param eol - 换行符（默认为 '\n'）
 * @returns 生成的 TOC 字符串
 */
export function generateToc(
  titles: string[],
  baseLevel = 2,
  eol = '\n'
): string {
  const toc = titles
    .map((title) => {
      const level = title.indexOf(' ')
      const text = title.slice(level).trim()
      const anchor = generateAnchor(text)
      return ' '.repeat((level - baseLevel) * 2) + `- [${text}](#${anchor})`
    })
    .join(eol)

  // !在 TOC 区域前后添加换行符 - 适配 prettier 格式化
  return `${eol}${toc}${eol}`
}

/**
 * 提取 Markdown 标题
 * @param content - Markdown 内容
 * @returns 标题列表
 */
export function extractHeaders(
  content: string
): Array<{ level: number; text: string; anchor: string }> {
  const lines = content.split('\n')
  const headers: Array<{ level: number; text: string; anchor: string }> = []

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      const [, hashes, text] = match
      headers.push({
        level: hashes.length,
        text: text.trim(),
        anchor: generateAnchor(text),
      })
    }
  }

  return headers
}
