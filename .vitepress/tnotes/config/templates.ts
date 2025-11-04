/**
 * .vitepress/tnotes/config/templates.ts
 *
 * 模板定义
 */
import { v4 as uuidv4 } from 'uuid'
import type { NoteConfig } from '../types'

/**
 * 新增笔记 README.md 模板
 */
export const NEW_NOTES_README_MD_TEMPLATE = `

<!-- region:toc -->

- [1. 🎯 本节内容](#1--本节内容)
- [2. 🫧 评价](#2--评价)

<!-- endregion:toc -->

## 1. 🎯 本节内容

- todo

## 2. 🫧 评价

- todo

`

/**
 * 获取新笔记的配置模板
 * @param needToString - 是否需要转为字符串
 * @returns 配置对象或 JSON 字符串
 */
export function getNewNotesTnotesJsonTemplate(
  needToString = true
): string | NoteConfig {
  const now = Date.now()
  const temp: NoteConfig = {
    id: uuidv4(),
    bilibili: [],
    tnotes: [],
    yuque: [],
    done: false,
    enableDiscussions: false,
    created_at: now,
    updated_at: now,
  }

  if (needToString) {
    return JSON.stringify(temp, null, 2)
  } else {
    return temp
  }
}
