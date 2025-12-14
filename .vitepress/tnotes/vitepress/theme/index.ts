/**
 * .vitepress/tnotes/theme/index.ts
 *
 * 自定义主题
 *
 * doc:
 * v1 - https://vuejs.github.io/vitepress/v1/zh/guide/custom-theme
 * v2 - https://vitepress.dev/zh/guide/custom-theme
 */

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BilibiliOutsidePlayer from '../components/BilibiliOutsidePlayer/BilibiliOutsidePlayer.vue'
import Discussions from '../components/Discussions/Discussions.vue'
import EnWordList from '../components/EnWordList/EnWordList.vue'
import Footprints from '../components/Footprints/Footprints.vue'
import Layout from '../components/Layout/Layout.vue'
import LoadingPage from '../components/LoadingPage/LoadingPage.vue'
import MarkMap from '../components/MarkMap/MarkMap.vue'
import Mermaid from '../components/Mermaid/Mermaid.vue'
import NotesTable from '../components/NotesTable/NotesTable.vue'
import Settings from '../components/Settings/Settings.vue'
import SidebarCard from '../components/SidebarCard/SidebarCard.vue'
import Tooltip from '../components/Tooltip/Tooltip.vue'
import './styles/index.scss'

export default {
  extends: DefaultTheme,

  /**
   * 使用注入插槽的包装组件覆盖 Layout
   *
   * doc: https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
   */
  Layout,

  // doc: https://vitepress.dev/zh/guide/extending-default-theme#registering-global-components
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('BilibiliOutsidePlayer', BilibiliOutsidePlayer)
    app.component('B', BilibiliOutsidePlayer)
    app.component('Discussions', Discussions)
    app.component('EnWordList', EnWordList)
    app.component('E', EnWordList)
    app.component('Footprints', Footprints)
    app.component('F', Footprints)
    app.component('LoadingPage', LoadingPage)
    app.component('Settings', Settings)
    app.component('S', Settings)
    app.component('SidebarCard', SidebarCard)
    app.component('MarkMap', MarkMap)
    app.component('Mermaid', Mermaid)
    app.component('NotesTable', NotesTable)
    app.component('N', NotesTable)
    app.component('Tooltip', Tooltip)
  },
} satisfies Theme
