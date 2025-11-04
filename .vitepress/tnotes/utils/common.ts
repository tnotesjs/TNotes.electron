/**
 * .vitepress/tnotes/utils/common.ts
 *
 * 通用工具函数
 */

/**
 * 对对象的键进行排序（递归）
 * @param obj - 要排序的对象
 * @returns 排序后的对象
 */
export function sortObjectKeys<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) return obj.map(sortObjectKeys) as T

  const sortedKeys = Object.keys(obj).sort()
  const sortedObj = {} as T

  for (const key of sortedKeys) {
    ;(sortedObj as any)[key] = sortObjectKeys((obj as any)[key])
  }

  return sortedObj
}

/**
 * 格式化日期
 * @param timestamp - 时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 * @returns Promise<void>
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
