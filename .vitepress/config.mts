import MarkdownIt from 'markdown-it'
import markdownItContainer from 'markdown-it-container'
import mila from 'markdown-it-link-attributes'
import markdownItTaskLists from 'markdown-it-task-lists'
import {
  DefaultTheme,
  defineConfig,
  HeadConfig,
  MarkdownOptions,
} from 'vitepress'

import {
  author,
  ignore_dirs,
  keywords,
  menuItems,
  repoName,
  socialLinks,
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
export default defineConfig({
  appearance: 'dark',
  base: '/' + repoName + '/',
  cleanUrls: true,
  description: repoName,
  head: head(),
  ignoreDeadLinks: true,
  lang: 'zh-Hans',
  /*
   * 笔记的创建时间和最后更新时间直接写入 ./notes/xxx/.tnotes.json 配置文件中
   * created_at: ...,
   * updated_at: ...,
   *
   * 备注：
   * 直接使用内置的 lastUpdated 来计算，在笔记数量较多（比如 leetcode 3k+）的情况下，经常会在 build 的时候遇到 vitepress 的报错：[vitepress] spawn EBADF。
   * 经过排查是因为 vitepress 内部使用的 git-log 命令在处理大量文件时会失败（怀疑是命令行参数过长导致），所以只能放弃内置的 lastUpdated 功能，改为手动维护。
   * */
  lastUpdated: false,
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
        // awaitWriteFinish: {
        //   stabilityThreshold: 5000, // 文件大小稳定 1000ms 后触发
        //   pollInterval: 1000, // 每 100ms 检查一次文件大小
        // },
        // usePolling: true, // 启用轮询机制（更稳定但稍耗资源） 解决 WSL/macOS 常见监听问题
      },
      // 避免内存溢出（大型文档库必备）
      // warmup: {
      //   clientFiles: ['./**/*.md'],
      // },
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

// 简化的 Mermaid 处理函数
const simpleMermaidMarkdown = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence
    ? md.renderer.rules.fence.bind(md.renderer.rules)
    : () => ''

  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]

    // 检查是否为 mermaid 代码块
    if (token.info.trim() === 'mermaid') {
      try {
        const key = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`
        const content = token.content
        // 使用自定义组件
        // console.log(
        //   'mermaid',
        //   `<Mermaid id="${key}" graph="${encodeURIComponent(content)}" />`
        // )
        return `<Mermaid id="${key}" graph="${encodeURIComponent(content)}" />`
      } catch (err) {
        return `<pre>${err}</pre>`
      }
    }

    // 允许使用 mmd 标记显示 Mermaid 代码本身
    if (token.info.trim() === 'mmd') {
      tokens[index].info = 'mermaid'
    }

    return fence(tokens, index, options, env, slf)
  }
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

      // 添加 Mermaid 支持
      simpleMermaidMarkdown(md)

      // 先保留 container 的解析（负责把 ```markmap ``` 识别成 container tokens）
      // 但让它本身不输出任何 HTML（render 返回空）
      md.use(markdownItContainer, 'markmap', {
        marker: '`',
        validate(params) {
          // 接受 "markmap", "markmap{...}" 或 "markmap key=val ..." 等写法
          const p = (params || '').trim()
          return p.startsWith('markmap')
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

            // 1) 从开头 fence 行解析参数（支持 `{a=1 b="x"}`、`a=1 b="x"`，并支持单个数字 shorthand）
            let params: { [key: string]: any; initialExpandLevel?: number } = {}
            if (open.map && typeof open.map[0] === 'number') {
              const openLine = (lines[open.map[0]] || '').trim()
              let paramPart = ''

              // 优先匹配大括号形式 ```markmap{...}
              const braceMatch = openLine.match(/\{([^}]*)\}/)
              if (braceMatch) {
                paramPart = braceMatch[1].trim()
              } else {
                // 否则尝试去掉前缀 ``` 和 markmap，剩下的作为参数部分
                const after = openLine.replace(/^`+\s*/, '')
                if (after.startsWith('markmap')) {
                  paramPart = after.slice('markmap'.length).trim()
                }
              }

              if (paramPart) {
                // 使用正则按 token 切分：保持用引号包裹的片段为单个 token（支持包含空格）
                // 例如: tokenArr -> ['2', 'title="我的 树"', 'foo=bar']
                const tokenArr = paramPart.match(/"[^"]*"|'[^']*'|\S+/g) || []

                // 如果第一个 token 是纯数字，把它当作 initialExpandLevel
                let startIdx = 0
                if (
                  tokenArr.length > 0 &&
                  /^\d+$/.test(tokenArr[0] as string)
                ) {
                  params.initialExpandLevel = Number(tokenArr[0])
                  startIdx = 1
                }

                // 解析剩余 token 为 key=value（支持 key=val 或 key:val）
                for (let k = startIdx; k < tokenArr.length; k++) {
                  const pair = tokenArr[k]
                  if (!pair) continue
                  const m = pair.match(/^([^=:\s]+)\s*(=|:)\s*(.+)$/)
                  if (m) {
                    const key = m[1]
                    let val = m[3]

                    // 去除外层引号（若存在）
                    if (
                      (/^".*"$/.test(val) && val.length >= 2) ||
                      (/^'.*'$/.test(val) && val.length >= 2)
                    ) {
                      val = val.slice(1, -1)
                    } else if (/^\d+$/.test(val)) {
                      // 纯数字转字符串
                      val = String(Number(val))
                    }

                    params[key] = val
                  }
                }
              }
            }

            // 2) 提取内容
            let content = ''
            if (startLine !== null && endLine !== null) {
              for (let k = startLine; k <= endLine && k < lines.length; k++) {
                content += lines[k] + '\n'
              }
            } else {
              // 回退：如果没有 map 信息，尝试用中间 tokens 拼接文本
              for (let k = i + 1; k < j; k++) {
                content += tokens[k].content || ''
              }
            }

            // 3) 构造组件标签并把参数注入为 props
            // content 使用 encodeURIComponent（与组件 decode 对应）
            const encodedContent = encodeURIComponent(content.trim())
            let propsStr = `content="${encodedContent}"`

            // 数字值以绑定形式注入 (:prop)，字符串按普通属性注入
            for (const [k, v] of Object.entries(params)) {
              if (typeof v === 'number' || /^\d+$/.test(String(v))) {
                propsStr += ` :${k}="${v}"`
              } else {
                const safe = String(v).replace(/"/g, '&quot;')
                propsStr += ` ${k}="${safe}"`
              }
            }

            const html = `<MarkMap ${propsStr}></MarkMap>\n`

            // 创建 html_block token（兼容不同运行环境：优先使用 state.Token 如果没有则用 plain object）
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

      function esc(s = '') {
        return s.replace(
          /[&<>"']/g,
          (ch) =>
            ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;',
            }[ch]!)
        )
      }

      let __tn_swiper_uid = 0

      interface TN_RULES_STACK_ITEM {
        image: any
        pOpen: any
        pClose: any
      }
      let __tn_rules_stack: Array<TN_RULES_STACK_ITEM> = []

      // 每个文档渲染前重置计数器
      md.core.ruler.before('block', 'tn_swiper_reset_uid', () => {
        __tn_swiper_uid = 0
        __tn_rules_stack = []
        return true
      })

      md.use(markdownItContainer, 'swiper', {
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            // 进容器：保存原规则 & 局部覆盖
            __tn_rules_stack.push({
              image: md.renderer.rules.image,
              pOpen: md.renderer.rules.paragraph_open,
              pClose: md.renderer.rules.paragraph_close,
            })

            md.renderer.rules.paragraph_open = () => ''
            md.renderer.rules.paragraph_close = () => ''
            md.renderer.rules.image = (tokens, i) => {
              const token: any = tokens[i]
              const src = token.attrGet('src') || ''
              const alt = token.content || ''
              const title = alt && alt.trim() ? alt : 'img'
              return `<div class="swiper-slide" data-title="${esc(
                title
              )}"><img src="${esc(src)}" alt="${esc(alt)}"></div>`
            }

            const id = `tn-swiper-${++__tn_swiper_uid}`
            return `
<div class="tn-swiper" data-swiper-id="${id}">
  <div class="tn-swiper-tabs"></div>
  <div class="swiper-container">
    <div class="swiper-wrapper">
`
          } else {
            // 出容器：恢复原规则并收尾
            const prev: TN_RULES_STACK_ITEM = __tn_rules_stack.pop() || {
              image: null,
              pOpen: null,
              pClose: null,
            }
            md.renderer.rules.image = prev.image
            md.renderer.rules.paragraph_open = prev.pOpen
            md.renderer.rules.paragraph_close = prev.pClose

            return `
    </div>
    <!-- 下一页按钮 -->
    <!-- <div class="swiper-button-next"></div> -->
    <!-- 上一页按钮 -->
    <!-- <div class="swiper-button-prev"></div> -->
    <!-- 分页导航 -->
    <!-- <div class="swiper-pagination"></div> -->
  </div>
</div>
`
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

// export default withMermaid({
//   // your existing vitepress config...
//   ...vpConfig,
//   // optionally, you can pass MermaidConfig
//   mermaid: {
//     // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
//   },
//   // optionally set additional config for plugin itself with MermaidPluginConfig
//   mermaidPlugin: {
//     class: 'mermaid my-class', // set additional css classes for parent container
//   },
// })
