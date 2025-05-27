import { EOL } from '../constants.js'
import { generateAnchor } from './gen_anchor.js'

export function generateToc(titles, baseLevel = 2) {
  const toc = titles
    .map((title) => {
      const level = title.indexOf(' ')
      const text = title.slice(level).trim()
      const anchor = generateAnchor(text)
      return ' '.repeat((level - baseLevel) * 2) + `- [${text}](#${anchor})`
    })
    .join(EOL)
  // !在 TOC 区域 <!-- region:toc --> ... <!-- endregion:toc --> 前后添加换行符 - 适配 prettier 格式化
  return `${EOL}${toc}${EOL}`
}

// test

// case 1
/* console.log(
  generateToc(
    [
      '# [0001. 两数之和【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0001.%20%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)',
      '## 1. 📝 Description',
      '## 2. 💻 题解.1 - 双指针暴力求解',
      '## 3. 💻 题解.2 - 静态哈希表',
      '## 4. 💻 题解.3 - 动态哈希表',
    ],
    1
  )
)
- [[0001. 两数之和【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0001.%20%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)](#0001-两数之和简单httpsgithubcomtdahuyoutnotesleetcodetreemainnotes000120e4b8a4e695b0e4b98be5928ce38090e7ae80e58d95e38091)
  - [1. 📝 Description](#1--description)
  - [2. 💻 题解.1 - 双指针暴力求解](#2--题解1---双指针暴力求解)
  - [3. 💻 题解.2 - 静态哈希表](#3--题解2---静态哈希表)
  - [4. 💻 题解.3 - 动态哈希表](#4--题解3---动态哈希表) */

// case 2

/* console.log(
  generateToc([
    '## 1. 📝 Description',
    '## 2. 💻 题解.1 - 双指针暴力求解',
    '## 3. 💻 题解.2 - 静态哈希表',
    '## 4. 💻 题解.3 - 动态哈希表',
  ])
)
- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 双指针暴力求解](#2--题解1---双指针暴力求解)
- [3. 💻 题解.2 - 静态哈希表](#3--题解2---静态哈希表)
- [4. 💻 题解.3 - 动态哈希表](#4--题解3---动态哈希表) */
