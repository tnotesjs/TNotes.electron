import {
  defineConfig,
  HeadConfig,
  DefaultTheme,
  MarkdownOptions,
} from 'vitepress'
import markdownItTaskLists from 'markdown-it-task-lists'
import mila from 'markdown-it-link-attributes'
import markdownItContainer from 'markdown-it-container'
import { withMermaid } from 'vitepress-plugin-mermaid'

import {
  author,
  repoName,
  keywords,
  socialLinks,
  menuItems,
  ignore_dirs,
} from '../.tnotes.json'

import sidebar from '../sidebar.json'
import TN_HMR_Plugin from './plugins/hmr'

import { generateAnchor } from './tnotes/utils'

const IGNORE_LIST = [
  './README.md',
  './MERGED_README.md',
  ...ignore_dirs.map((dir) => `**/${dir}/**`),
]
const github_page_url =
  'https://' + author.toLowerCase() + '.github.io/' + repoName + '/'

// https://vitepress.dev/reference/site-config
const vpConfig = defineConfig({
  appearance: 'dark',
  base: '/' + repoName + '/',
  cleanUrls: true,
  description: repoName,
  head: head(),
  ignoreDeadLinks: true,
  lang: 'zh-Hans',
  lastUpdated: true,
  markdown: markdown(),
  router: {
    prefetchLinks: false,
  },
  sitemap: {
    hostname: github_page_url,
    lastmodDateOnly: false,
  },
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: themeConfig(),
  title: repoName,
  srcExclude: IGNORE_LIST,
  vite: {
    server: {
      watch: {
        ignored: IGNORE_LIST,
      },
    },
    plugins: [TN_HMR_Plugin()],
  },
})

function head() {
  const head: HeadConfig[] = [
    [
      'meta',
      {
        name: 'keywords',
        content: keywords.join(', '),
      },
    ],
    ['meta', { name: 'author', content: author }],
    ['link', { rel: 'canonical', href: github_page_url }],
    ['link', { rel: 'icon', href: github_page_url + 'favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ]

  return head
}

function markdown() {
  const markdown: MarkdownOptions = {
    lineNumbers: true,
    math: true,
    config(md) {
      // 添加前置规则保存原始内容
      md.core.ruler.before('normalize', 'save-source', (state) => {
        state.env.source = state.src
        return true
      })

      // 先保留 container 的解析（负责把 ```markmap ``` 识别成 container tokens）
      // 但让它本身不输出任何 HTML（render 返回空）
      md.use(markdownItContainer, 'markmap', {
        marker: '`',
        validate(params) {
          return params.trim() === 'markmap'
        },
        render() {
          return ''
        },
      })

      // 在 core 阶段把整个 container 区间替换成一个 html_block（MarkMap 组件标签）
      // 这样渲染时就只输出 <MarkMap ...>，中间的列表 token 已被移除
      md.core.ruler.after('block', 'tn_replace_markmap_container', (state) => {
        const src = state.env.source || ''
        const lines = src.split('\n')
        const tokens = state.tokens

        for (let i = 0; i < tokens.length; i++) {
          const t = tokens[i]
          if (t.type === 'container_markmap_open') {
            // 找到对应的 close token
            let j = i + 1
            while (
              j < tokens.length &&
              tokens[j].type !== 'container_markmap_close'
            )
              j++
            if (j >= tokens.length) continue // safety

            // 使用 token.map 提取源文件对应行（open.token.map 存着 container 起止行）
            const open = t
            const startLine = open.map ? open.map[0] + 1 : null
            const endLine = open.map ? open.map[1] - 1 : null

            let content = ''
            if (startLine !== null && endLine !== null) {
              for (let k = startLine; k <= endLine && k < lines.length; k++) {
                content += lines[k] + '\n'
              }
            } else {
              // 回退：如果没有 map 信息，尝试用中间 tokens 拼接文本（尽量不走到这）
              for (let k = i + 1; k < j; k++) {
                content += tokens[k].content || ''
              }
            }

            const html = `<MarkMap content="${encodeURIComponent(
              content.trim()
            )}"></MarkMap>\n`

            // 创建 html_block token（兼容不同运行环境：优先使用 state.Token，如果没有则用 plain object）
            let htmlToken
            if (typeof state.Token === 'function') {
              htmlToken = new state.Token('html_block', '', 0)
              htmlToken.content = html
            } else {
              htmlToken = {
                type: 'html_block',
                tag: '',
                attrs: null,
                map: null,
                nesting: 0,
                level: 0,
                children: null,
                content: html,
                block: true,
              }
            }

            // 用单个 html_token 替换 open..close 区间
            tokens.splice(i, j - i + 1, htmlToken)
            // i 位置现在是替换后的 html_token，继续循环即可
          }
        }

        return true
      })

      md.use(markdownItTaskLists)

      md.use(mila, {
        attrs: {
          target: '_self',
          rel: 'noopener',
        },
      })

      md.use(markdownItContainer, 'swiper', {
        render: (tokens, idx) => {
          const defaultRenderRulesImage =
            md.renderer.rules.image ||
            ((tokens, idx, options, env, slf) =>
              slf.renderToken(tokens, idx, options))
          if (tokens[idx].nesting === 1) {
            md.renderer.rules.paragraph_open = () => ''
            md.renderer.rules.paragraph_close = () => ''
            md.renderer.rules.image = (tokens, idx, options, env, slf) =>
              `<div class="swiper-slide">${defaultRenderRulesImage(
                tokens,
                idx,
                options,
                env,
                slf
              )
                .replaceAll('<div class="swiper-slide">', '')
                .replaceAll('</div>', '')}</div>`

            return `<div class="swiper-container"><div class="swiper-wrapper">\n`
          } else {
            md.renderer.rules.paragraph_open = undefined
            md.renderer.rules.paragraph_close = undefined
            md.renderer.rules.image = (tokens, idx, options, env, slf) =>
              `${defaultRenderRulesImage(tokens, idx, options, env, slf)
                .replaceAll('<div class="swiper-slide">', '')
                .replaceAll('</div>', '')}`
            return '</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div><div class="swiper-pagination"></div></div>\n'
          }
        },
      })
    },
    anchor: {
      slugify: generateAnchor,
    },
    image: {
      lazyLoading: true,
    },
  }

  return markdown
}

function themeConfig() {
  const themeConfig: DefaultTheme.Config = {
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    externalLinkIcon: true,
    outline: {
      level: [2, 3],
      label: '目录',
    },
    nav: [
      {
        text: '👀 TOC',
        link: '/TOC',
      },
      {
        text: 'Menus',
        items: menuItems,
      },
    ],
    search: {
      // 使用本地搜索（不依赖远程服务器）
      provider: 'local',
      options: {
        miniSearch: {
          /**
           * 控制如何对文档进行分词、字段提取等预处理
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */
          options: {
            // 自定义分词逻辑
            tokenize: (text, language) => {
              if (language === 'zh') {
                return text.match(/[\u4e00-\u9fa5]+|\S+/g) || []
              }
              return text.split(/\s+/)
            },
            // 将所有词转为小写，确保大小写不敏感匹配
            processTerm: (term) => term.toLowerCase(),
          },
          /**
           * 控制搜索时的行为（如模糊匹配、权重）
           * @type {import('minisearch').SearchOptions}
           * @default
           * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
           */
          searchOptions: {
            fuzzy: 0.2, // 模糊匹配阈值（0-1），允许拼写错误的阈值（数值越低越严格）
            prefix: true, // 是否启用前缀匹配（输入“jav”可匹配“javascript”）
            boost: {
              title: 10, // 文件名作为 h1 标题，权重最高（这个 title 指的是 _render 返回结果 md.renderer html 中的第一个 h1，使用 folderName 作为第一个 h1，权重最高。）
              headings: 5, // h2 - h6
              text: 3, // 正文内容索引
              code: 1, // 代码块索引权重
            },
          },
        },
        /**
         * 控制哪些 Markdown 内容参与本地搜索引擎索引
         * @param {string} src 当前 Markdown 文件的原始内容（即 .md 文件中的文本）
         * @param {import('vitepress').MarkdownEnv} env 包含当前页面环境信息的对象，比如 frontmatter、路径等
         * @param {import('markdown-it-async')} md 一个 Markdown 渲染器实例，用来将 Markdown 转换为 HTML
         */
        async _render(src, env, md) {
          const filePath = env.relativePath
          if (filePath.includes('TOC.md')) return ''

          // 提取路径中 "notes/..." 后面的第一个目录名
          const notesIndex = filePath.indexOf('notes/')
          let folderName = ''

          if (notesIndex !== -1) {
            const pathAfterNotes = filePath.slice(notesIndex + 'notes/'.length)
            folderName = pathAfterNotes.split('/')[0]
          }

          // 显式添加一个高权重字段，例如 "title"
          const titleField = `# ${folderName}\n`
          const html = md.render(titleField + '\n\n' + src, env)

          // console.log('html:', html)

          return html
        },
      },
    },
    sidebar: [...sidebar],
    socialLinks,
  }

  return themeConfig
}

export default withMermaid({
  // your existing vitepress config...
  ...vpConfig,
  // optionally, you can pass MermaidConfig
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: 'mermaid my-class', // set additional css classes for parent container
  },
})
