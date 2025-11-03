/**
 * .vitepress/tnotes/utils/sortObjectKeys.ts
 *
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
