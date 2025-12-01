/**
 * .vitepress/tnotes/utils/parseReadmeCompletedNotes.ts
 *
 * 解析 README.md 中的完成笔记数量
 */

/**
 * 笔记状态
 */
export interface NoteStatus {
  id: string // 笔记编号（如 "0001"）
  completed: boolean // 是否完成
  line: string // 原始行内容
}

/**
 * 解析结果
 */
export interface ParseResult {
  completedCount: number // 完成的笔记数量
  totalCount: number // 总笔记数量
  notes: NoteStatus[] // 所有笔记的状态
}

/**
 * 从 README.md 内容中解析完成笔记数量
 *
 * 优先级判断逻辑（从上到下，匹配一个即停止）：
 * 1. 如果有 ❌ → 未完成
 * 2. 如果有 ⏰ → 未完成
 * 3. 如果有 ✅ → 完成
 * 4. 如果以 - [ ] 开头 → 未完成
 * 5. 如果以 - [x] 开头 → 完成
 *
 * @param content - README.md 的内容
 * @returns 解析结果
 * @throws 如果发现相同编号的笔记有不同的完成状态
 */
export function parseReadmeCompletedNotes(content: string): ParseResult {
  const lines = content.split('\n')
  const noteMap = new Map<string, NoteStatus>()

  // 笔记编号正则：匹配 4 位数字（如 0001, 0002）
  const noteIdRegex = /\[(\d{4})\./

  for (const line of lines) {
    // 提取笔记编号
    const match = line.match(noteIdRegex)
    if (!match) continue

    const noteId = match[1]

    // 判断完成状态（按优先级）
    let completed: boolean

    if (line.includes('❌')) {
      // 优先级 1: ❌ 表示未完成
      completed = false
    } else if (line.includes('⏰')) {
      // 优先级 2: ⏰ 表示未完成
      completed = false
    } else if (line.includes('✅')) {
      // 优先级 3: ✅ 表示完成
      completed = true
    } else if (line.trim().startsWith('- [ ]')) {
      // 优先级 4: - [ ] 表示未完成
      completed = false
    } else if (line.trim().startsWith('- [x]')) {
      // 优先级 5: - [x] 表示完成
      completed = true
    } else {
      // 未匹配任何规则，跳过
      continue
    }

    // 检查是否已存在该编号的笔记
    if (noteMap.has(noteId)) {
      const existing = noteMap.get(noteId)!
      if (existing.completed !== completed) {
        throw new Error(
          `发现相同编号 ${noteId} 的笔记有不同的完成状态:\n` +
            `  第一次出现: ${existing.line}\n` +
            `  第二次出现: ${line}`
        )
      }
      // 状态相同，跳过（去重）
      continue
    }

    // 记录笔记状态
    noteMap.set(noteId, {
      id: noteId,
      completed,
      line: line.trim(),
    })
  }

  // 统计结果
  const notes = Array.from(noteMap.values())
  const completedCount = notes.filter((note) => note.completed).length
  const totalCount = notes.length

  return {
    completedCount,
    totalCount,
    notes,
  }
}
