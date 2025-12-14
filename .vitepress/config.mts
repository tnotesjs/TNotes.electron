/**
 * .vitepress/config.mts
 *
 * VitePress 站点配置文件
 *
 *
 * !注意：不要开启 lastUpdated: true;
 * 直接使用内置的 lastUpdated 来计算，在笔记数量较多（比如 leetcode 3k+）的情况下，经常会在 build 的时候遇到 vitepress 的报错：[vitepress] spawn EBADF。
 * 经过排查是因为 vitepress 内部使用的 git-log 命令在处理大量文件时会失败（怀疑是命令行参数过长导致），所以只能放弃内置的 lastUpdated 功能，改为手动维护。
 *
 * 笔记的创建时间和最后更新时间直接写入 ./notes/xxx/.tnotes.json 配置文件中
 * created_at: ...,
 * updated_at: ...,
 *
 *
 * doc:
 * v1 - 目前使用的版本: https://vuejs.github.io/vitepress/v1/zh/reference/site-config
 * v2 - 稳定版尚未发布: https://vitepress.dev/reference/site-config
 *
 * TODO - v2 版本发布后，考虑升级
 */
import { defineConfig } from 'vitepress'
import { repoName } from '../.tnotes.json'
import {
  IGNORE_LIST,
  GITHUB_PAGE_URL,
  getHeadConfig,
  getMarkdownConfig,
  getThemeConfig,
} from './tnotes/vitepress/configs'
import { updateConfigPlugin } from './tnotes/vitepress/plugins/updateConfigPlugin'
import { renameNotePlugin } from './tnotes/vitepress/plugins/renameNotePlugin'
import { getNoteByConfigIdPlugin } from './tnotes/vitepress/plugins/getNoteByConfigIdPlugin'

export default defineConfig({
  appearance: 'dark',
  base: '/' + repoName + '/',
  cleanUrls: true,
  description: repoName,
  head: getHeadConfig(),
  ignoreDeadLinks: true,
  lang: 'zh-Hans',
  lastUpdated: false,
  markdown: getMarkdownConfig(),
  sitemap: {
    hostname: GITHUB_PAGE_URL,
    lastmodDateOnly: false,
  },
  themeConfig: getThemeConfig(),
  title: repoName,
  srcExclude: IGNORE_LIST,
  vite: {
    plugins: [
      /**
       * 类型断言: VitePress 的 vite 5.4.20 与 vite 7.1.9 插件类型不兼容
       */
      updateConfigPlugin() as any,
      renameNotePlugin() as any,
      getNoteByConfigIdPlugin() as any,
    ],
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
    css: {
      preprocessorOptions: {
        scss: {
          // 抑制 legacy-js-api 弃用警告
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000, // 提高 chunk 大小警告阈值到 1000KB
    },
  },
  router: {
    /**
     * 备注：
     * prefetchLinks 默认是 true
     * 基于 GoogleChromeLabs 的 quicklink 库实现，通过在用户可能点击链接前提前加载页面资源，显著提升 SPA 导航的响应速度。
     * 在大型笔记知识库（比如 TNotes.leetcode 3k+ 的笔记）中，开启后体验效果并不好，因此关闭。
     *
     * 注意：
     * - 预取机制只对同标签页导航有效，如果用户习惯在新标签页打开链接（target="_blank"），预取功能不会生效
     * - 该配置仅在生产环境生效，开发环境不受影响
     *
     * 后续可以再测试测试效果，如果能有更好的加载体验，可以考虑开启该配置。
     */
    prefetchLinks: false,
  },
})
