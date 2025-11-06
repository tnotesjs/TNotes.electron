/**
 * .vitepress/config/head.config.ts
 *
 * HTML head 标签配置
 */
import { HeadConfig } from 'vitepress'
import { author, keywords } from '../../../../.tnotes.json'
import { GITHUB_PAGE_URL } from './constants'

export function getHeadConfig(): HeadConfig[] {
  const head: HeadConfig[] = [
    [
      'meta',
      {
        name: 'keywords',
        content: keywords.join(', '),
      },
    ],
    ['meta', { name: 'author', content: author }],
    ['link', { rel: 'canonical', href: GITHUB_PAGE_URL }],
    ['link', { rel: 'icon', href: GITHUB_PAGE_URL + 'favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ]

  return head
}
