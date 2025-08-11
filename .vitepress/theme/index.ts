// doc
// https://vitepress.dev/zh/guide/custom-theme

// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme, defineClientComponent } from 'vitepress'
import './custom.css'
import BilibiliOutsidePlayer from '../components/BilibiliOutsidePlayer/BilibiliOutsidePlayer.vue'
import Discussions from '../components/Discussions/Discussions.vue'
import EnWordList from '../components/EnWordList/EnWordList.vue'
import Footprints from '../components/Footprints/Footprints.vue'
import Layout from '../components/Layout/Layout.vue'
import Settings from '../components/Settings/Settings.vue'
import SidebarCard from '../components/SidebarCard/SidebarCard.vue'
import MarkMap from '../components/MarkMap/MarkMap.vue'

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
  },
} satisfies Theme
