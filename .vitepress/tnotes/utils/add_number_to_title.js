/**
 * 工厂函数，创建一个带有独立编号状态的标题编号生成器。
 * @returns {Function} 返回 addNumberToTitle 方法
 */
export function createAddNumberToTitle() {
  const titleNumbers = Array(7).fill(0) // 用于存储每个级别的编号

  return function addNumberToTitle(title) {
    // console.log(title, title.endsWith('\r'));

    // 正则匹配提取标题信息
    const match = title.match(
      /^(\#+)\s*((\d+(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?)\.\s*)?(.*)/ // !注意：windows 环境下，读到的 title 结尾会带有一个 /r，在正则匹配的时候，不要记上结尾 $
    )
    const plainTitle = match ? match[9].trim() : title.trim()

    const level = title.indexOf(' ')
    const baseLevel = 2 // 基础级别为2

    // 一级标题不编号
    if (level === 1) return [title, plainTitle]

    // 重置当前级别以上的编号
    for (let i = level + 1; i < titleNumbers.length; i++) titleNumbers[i] = 0

    // 增加当前级别的编号
    titleNumbers[level] += 1

    // 生成新的编号
    const newNumber = titleNumbers.slice(baseLevel, level + 1).join('.')

    // 构建新的标题
    const headerSymbol = title.slice(0, level).trim() // 获取原有的 # 符号
    const newTitle = `${headerSymbol} ${newNumber}. ${plainTitle}`

    return [newTitle, plainTitle]
  }
}

// test

// const addNumberToTitle = createAddNumberToTitle()

// console.log(addNumberToTitle('# item')) // [ '# item', 'item' ]
// console.log(addNumberToTitle('## item')) // [ '## 1. item', 'item' ]
// console.log(addNumberToTitle('## item')) // [ '## 2. item', 'item' ]
// console.log(addNumberToTitle('### item')) // [ '### 2.1. item', 'item' ]
// console.log(addNumberToTitle('### item')) // [ '### 2.2. item', 'item' ]
// console.log(addNumberToTitle('## item')) // [ '## 3. item', 'item' ]
