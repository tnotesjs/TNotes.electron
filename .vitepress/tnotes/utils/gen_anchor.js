import GithubSlugger from 'github-slugger' // doc: https://www.npmjs.com/package/github-slugger
const slugger = new GithubSlugger()

// !注意：【1】、【2】中锚点的生成规则要保持一致。
// 【1】 .vitepress/config.mts - markdown.anchor.slugify
// 【2】 .vitepress/tnotes/update.js
export const generateAnchor = (label) => {
  slugger.reset()
  return slugger.slug(label)
}
