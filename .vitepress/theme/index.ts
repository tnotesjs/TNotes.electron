// doc
// https://vitepress.dev/zh/guide/custom-theme

// .vitepress/theme/index.ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BilibiliOutsidePlayer from '../components/BilibiliOutsidePlayer/BilibiliOutsidePlayer.vue'
import Discussions from '../components/Discussions/Discussions.vue'
import EnWordList from '../components/EnWordList/EnWordList.vue'
import Footprints from '../components/Footprints/Footprints.vue'
import Layout from '../components/Layout/Layout.vue'
import MarkMap from '../components/MarkMap/MarkMap.vue'
import Mermaid from '../components/Mermaid/Mermaid.vue'
import Settings from '../components/Settings/Settings.vue'
import SidebarCard from '../components/SidebarCard/SidebarCard.vue'
import './custom.css'

export default {
  extends: DefaultTheme,

  // doc: https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
  // 使用注入插槽的包装组件覆盖 Layout
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
    app.component('Settings', Settings)
    app.component('SidebarCard', SidebarCard)
    app.component('MarkMap', MarkMap)
    app.component('Mermaid', Mermaid)
  },
} satisfies Theme
