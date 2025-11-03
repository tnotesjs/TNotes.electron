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
export const generateAnchor = (label: string): string => {
  slugger.reset()
  return slugger.slug(label)
}
