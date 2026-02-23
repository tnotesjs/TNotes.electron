/**
 * .vitepress/config.mts
 *
 * VitePress 站点配置文件 - 连接层
 *
 * 所有配置逻辑封装在 TNotes.core 中，此文件仅作为 VitePress 入口。
 *
 * !注意：主题入口文件模块的位置是 VitePress 规定的，不能更改位置！
 */
import { defineNotesConfig } from './tnotes/vitepress/config'

export default defineNotesConfig()

