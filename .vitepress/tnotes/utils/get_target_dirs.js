import fs from 'fs'
import path from 'path'

/**
 * 获取 baseDir 目录下以 prefix 开头的目录路径列表
 * @param {string} baseDir - 基础目录路径
 * @param {string} prefix - baseDir 下的目录列表的前缀
 * @param {string[]} excludeDirs - 需要排除的目录路径列表
 * @returns {string[]} 符合条件的目标目录列表
 */
export const getTargetDirs = (baseDir, prefix, excludeDirs = []) => {
  try {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true })
    const targetDirs = entries
      .filter(
        (entry) => entry.isDirectory() && entry.name.startsWith(prefix)
      )
      .map((entry) => path.join(baseDir, entry.name))
      .filter((dir) => !excludeDirs.includes(dir))
    return targetDirs
  } catch (error) {
    console.error(`读取目录 ${baseDir} 时出错：${error.message}`)
    return []
  }
}
