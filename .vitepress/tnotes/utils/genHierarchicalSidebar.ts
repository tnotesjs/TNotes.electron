import type { SidebarItem } from '../types'

interface StackItem {
  level: number
  node: SidebarItem
}

/**
 * 生成层次化侧边栏
 * @param itemList - 笔记项列表
 * @param titles - 标题列表
 * @param titlesNotesCount - 每个标题下的笔记数量
 * @param sidebarIsCollapsed - 侧边栏是否默认折叠
 * @returns 层次化的侧边栏结构
 */
export const genHierarchicalSidebar = (
  itemList: SidebarItem[],
  titles: string[],
  titlesNotesCount: number[],
  sidebarIsCollapsed: boolean
): SidebarItem[] => {
  const stack: StackItem[] = []
  const root: SidebarItem[] = []

  titles.forEach((title, i) => {
    const match = title.match(/^#+/)
    if (!match) return

    const level = match[0].length
    const text = title.replace(/^#+\s*/, '')
    const noteItems = itemList.splice(0, titlesNotesCount[i])

    const node: SidebarItem = {
      text,
      collapsed: sidebarIsCollapsed,
      items: noteItems.length > 0 ? noteItems : [],
    }

    if (i === 0 && level === 1) return

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(node)
    } else {
      const parent = stack[stack.length - 1].node
      if (!parent.items) parent.items = []
      parent.items.push(node)
    }

    stack.push({ level, node })
  })

  return root
}
