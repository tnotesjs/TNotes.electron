export function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) return obj.map(sortObjectKeys)

  const sortedKeys = Object.keys(obj).sort()
  const sortedObj = {}
  for (const key of sortedKeys) sortedObj[key] = sortObjectKeys(obj[key])

  return sortedObj
}
