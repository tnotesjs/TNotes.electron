export const genHierarchicalSidebar = (itemList, titles, titlesNotesCount, sidebar_isCollapsed) => {
  const stack = []
  const root = []

  titles.forEach((title, i) => {
    const level = title.match(/^#+/)[0].length
    const text = title.replace(/^#+\s*/, '')
    const noteItems = itemList.splice(0, titlesNotesCount[i])

    const node = {
      text,
      collapsed: sidebar_isCollapsed,
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
