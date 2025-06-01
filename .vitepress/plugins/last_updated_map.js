import { getNotesLastUpdatedMap } from '../tnotes/utils'

export default function TN_INJECT_LAST_UPDATED_MAP_PLUGIN() {
  return {
    name: 'inject-last-updated-map',
    transformIndexHtml(html) {
      try {
        const map = getNotesLastUpdatedMap()

        console.log('last updated map injected')

        return html.replace(
          '<body>',
          `<body><script>window._tnotes_lastupdatedMap = ${JSON.stringify(
            map
          )}</script>`
        )
      } catch (e) {
        console.error('注入 _tnotes_lastupdatedMap 失败:', e)
        return html
      }
    },
  }
}
