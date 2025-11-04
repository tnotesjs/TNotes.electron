/**
 * .vitepress/tnotes/config/defaultConfig.ts
 *
 * TNotes 项目配置默认值模板
 */

import type { TNotesConfig } from '../types'

/**
 * 生成默认配置
 * @param repoName - 仓库名称（必需）
 * @returns 默认配置对象
 */
export function getDefaultConfig(repoName?: string): TNotesConfig {
  const name = repoName || 'TNotes.default'
  const cleanName = name.replace('TNotes.', '')

  return {
    // 基础信息
    author: 'tnotesjs',
    repoName: name,
    keywords: [name],
    id: '', // 由外部生成的 UUID

    // Sidebar 配置
    sidebarShowNoteId: true,

    // 忽略目录
    ignore_dirs: [
      '.vscode',
      '0000',
      'assets',
      'node_modules',
      'hidden',
      'demos',
    ],

    // 侧边栏目录（用于多仓库模式）
    rootSidebarDir: '../TNotes/sidebars',

    // 根目录项配置
    root_item: {
      icon: {
        src: `https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/assets/icon--${cleanName}.svg`,
      },
      title: cleanName,
      completed_notes_count: 0,
      details: `${name} 知识库`,
      link: `https://tnotesjs.github.io/${name}/`,
      created_at: Date.now(),
      updated_at: Date.now(),
      days_since_birth: 0,
    },

    // 端口配置（根据仓库名生成）
    port: 8000,

    // 菜单项
    menuItems: [
      {
        text: '🏠 Home',
        link: '/',
      },
      {
        text: '⚙️ Settings',
        link: '/Settings',
      },
      {
        text: '📒 TNotes',
        link: 'https://tnotesjs.github.io/notes',
      },
      {
        text: '📂 TNotes.yuque',
        link: 'https://www.yuque.com/tdahuyou/tnotes.yuque',
      },
    ],

    // 社交链接
    socialLinks: [
      {
        ariaLabel: 'Tdahuyou 语雀主页链接',
        link: 'https://www.yuque.com/tdahuyou',
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.28 2.955c2.97.203 3.756 2.342 3.84 2.597l1.297.096c.13 0 .169.18.054.236c-1.323.716-1.727 2.17-1.49 3.118c.09.358.254.69.412 1.02c.307.642.651 1.418.707 2.981c.117 3.24-2.51 6.175-5.789 6.593c1.17-1.187 1.815-2.444 2.12-3.375c.606-1.846.508-3.316.055-4.44a4.46 4.46 0 0 0-1.782-2.141c-1.683-1.02-3.22-1.09-4.444-.762c.465-.594.876-1.201 1.2-1.864c.584-1.65-.102-2.848-.704-3.519c-.192-.246-.061-.655.305-.655c1.41 0 2.813.02 4.22.115M3.32 19.107c1.924-2.202 4.712-5.394 7.162-8.15c.559-.63 2.769-2.338 5.748-.533c.878.532 2.43 2.165 1.332 5.51c-.803 2.446-4.408 7.796-15.76 5.844c-.227-.039-.511-.354-.218-.687z"/></svg>',
        },
      },
      {
        ariaLabel: 'Tdahuyou B 站主页链接',
        link: 'https://space.bilibili.com/407241004',
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g fill="currentColor"><path d="M310.134 596.45c-7.999-4.463-16.498-8.43-24.997-11.9a274 274 0 0 0-26.996-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c.999.992 1.999 1.488 2.999.496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c1.5-1.487 0-2.479.5-2.975m323.96-11.9a274 274 0 0 0-26.997-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c1 .992 2 1.488 3 .496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c2-1.487.5-2.479.5-2.975c-7.5-4.463-16.498-8.43-24.997-11.9"/><path d="M741.496 112H283c-94.501 0-171 76.5-171 171.5v458c.5 94 77 170.5 170.999 170.5h457.997c94.5 0 171.002-76.5 171.002-170.5v-458c.497-95-76.002-171.5-170.502-171.5m95 343.5h15.5v48h-15.5zm-95.5-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 1.5l-6.5-47.5h17zm-230.498 1.5h15v48h-15zm-96-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 2l-6-47.5zm-3.5 149C343.498 668.5 216 662.5 204.5 660.5C195.5 499 181.5 464 170 385l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 47c.5 3 0 6-1.5 8.5m20.5 35.5l-23.5-124h35.5l13 123zm44.5-8l-27-235l33.5-1.5l21 236H429zm34-175h17.5v48H467zm41 190h-26.5l-9.5-126h36zm209.998-43C693.496 668 565.997 662 554.497 660c-9-161-23-196-34.5-275l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 46.5c.5 3 0 6-1.5 8.5m19.5 36l-23-124h35.5l13 123zm45.5-8l-27.5-235l33.5-1.5l21 236h-27zm33.5-175h17.5v48h-13zm41 190h-26.5l-9.5-126h36z"/></g></svg>',
        },
      },
      {
        ariaLabel: `${name} github 仓库链接`,
        link: `https://github.com/tnotesjs/${name}`,
        icon: 'github',
      },
    ],
  }
}

/**
 * 深度合并配置
 * @param target - 目标对象（现有配置）
 * @param source - 源对象（默认配置）
 * @returns 合并后的配置
 */
export function mergeConfig(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  const result = { ...target }

  for (const key in source) {
    if (!(key in result)) {
      // 如果字段不存在，直接添加
      result[key] = source[key]
    } else if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      // 如果是对象（非数组），递归合并
      result[key] = mergeConfig(result[key] || {}, source[key])
    }
    // 如果字段已存在且不是对象，保留现有值
  }

  return result
}

/**
 * 验证并补全配置
 * @param config - 现有配置
 * @returns 补全后的配置和是否进行了修改
 */
export function validateAndCompleteConfig(config: Record<string, any>): {
  config: TNotesConfig
  modified: boolean
} {
  const repoName = config.repoName || 'TNotes.default'
  const defaultConfig = getDefaultConfig(repoName)

  // 深度合并配置
  const mergedConfig = mergeConfig(config, defaultConfig as any)

  // 检查是否有修改
  const modified = JSON.stringify(config) !== JSON.stringify(mergedConfig)

  return {
    config: mergedConfig as TNotesConfig,
    modified,
  }
}
