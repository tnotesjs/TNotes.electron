/**
 * .vitepress/config/markdown.config.ts
 *
 * Markdown 配置
 */
import MarkdownIt from 'markdown-it'
import markdownItContainer from 'markdown-it-container'
import mila from 'markdown-it-link-attributes'
import markdownItTaskLists from 'markdown-it-task-lists'
import { MarkdownOptions } from 'vitepress'
import { generateAnchor } from '../tnotes/utils'
import fs from 'fs'
import path from 'path'

/**
 * 辅助函数：HTML 转义
 */
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

/**
 * 简化的 Mermaid 处理函数
 */
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

/**
 * MarkMap 容器配置
 */
function configureMarkMapContainer(md: MarkdownIt) {
  // 先保留 container 的解析（负责把 ```markmap ``` 识别成 container tokens）
  // 但让它本身不输出任何 HTML（render 返回空）
  md.use(markdownItContainer, 'markmap', {
    marker: '`',
    validate(params: string) {
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
            const tokenArr = paramPart.match(/"[^"]*"|'[^']*'|\S+/g) || []

            // 如果第一个 token 是纯数字，把它当作 initialExpandLevel
            let startIdx = 0
            if (tokenArr.length > 0 && /^\d+$/.test(tokenArr[0] as string)) {
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

        // 2) 提取内容（支持文件引用语法 `<<< ./path/to/file.md`）
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

        // --- 检查第一非空行是否为引用语法 ---
        const firstNonEmptyLine =
          (content || '').split('\n').find((ln) => ln.trim() !== '') || ''
        const refMatch = firstNonEmptyLine.trim().match(/^<<<\s*(.+)$/)
        if (refMatch) {
          // 提取引用路径，支持引号包裹
          let refRaw = refMatch[1].trim().replace(/^['"]|['"]$/g, '')

          // 尝试同步读取文件内容（兼容常见 Node 环境）
          try {
            // 尝试根据当前 markdown 文件位置解析相对路径
            const env = state.env || {}
            const possibleRel =
              env.relativePath || env.path || env.filePath || env.file || ''
            let refFullPath = refRaw

            if (!path.isAbsolute(refRaw)) {
              if (possibleRel) {
                // 将 relativePath 视作相对于项目根的路径（例如 'notes/foo/bar.md'），取其目录
                const currentDir = path.dirname(possibleRel)
                // 解析到 process.cwd()
                refFullPath = path.resolve(process.cwd(), currentDir, refRaw)
              } else {
                // 没有相对文件信息，则相对于项目根解析
                refFullPath = path.resolve(process.cwd(), refRaw)
              }
            } else {
              // 绝对路径直接使用（按系统路径）
              refFullPath = refRaw
            }

            // console.log('refFullPath:', refFullPath)
            const fileContent = fs.readFileSync(refFullPath, 'utf-8')
            content = fileContent
          } catch (err) {
            // 读取失败：将错误写入 content 以便排查（不会让流程直接崩溃）
            const errorMsg = err instanceof Error ? err.message : String(err)
            content = `Failed to load referenced file: ${esc(
              String(refRaw)
            )}\n\nError: ${esc(errorMsg)}`
          }
        }

        // 3) 构造组件标签并把参数注入为 props
        const encodedContent = encodeURIComponent(content.trim())
        let propsStr = `content="${encodedContent}"`

        for (const [k, v] of Object.entries(params)) {
          if (typeof v === 'number' || /^\d+$/.test(String(v))) {
            propsStr += ` :${k}="${v}"`
          } else {
            const safe = String(v).replace(/"/g, '&quot;')
            propsStr += ` ${k}="${safe}"`
          }
        }

        const html = `<MarkMap ${propsStr}></MarkMap>\n`

        // 创建 html_block token
        const htmlToken = new state.Token('html_block', '', 0)
        htmlToken.content = html

        // 用单个 html_token 替换 open..close 区间
        tokens.splice(i, j - i + 1, htmlToken as any)
      }
    }

    return true
  })
}

/**
 * Swiper 容器配置
 */
function configureSwiperContainer(md: MarkdownIt) {
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
    render: (tokens: any[], idx: number) => {
      if (tokens[idx].nesting === 1) {
        // 进容器：保存原规则 & 局部覆盖
        __tn_rules_stack.push({
          image: md.renderer.rules.image,
          pOpen: md.renderer.rules.paragraph_open,
          pClose: md.renderer.rules.paragraph_close,
        })

        md.renderer.rules.paragraph_open = () => ''
        md.renderer.rules.paragraph_close = () => ''
        md.renderer.rules.image = (tokens: any[], i: number) => {
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
}

/**
 * Markdown 配置
 */
export function getMarkdownConfig(): MarkdownOptions {
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

      // 配置 MarkMap 容器
      configureMarkMapContainer(md)

      // 配置任务列表
      md.use(markdownItTaskLists)

      // 配置链接属性
      md.use(mila, {
        attrs: {
          target: '_self',
          rel: 'noopener',
        },
      })

      // 配置 Swiper 容器
      configureSwiperContainer(md)
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
