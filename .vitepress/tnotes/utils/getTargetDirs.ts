import fs from 'fs'
import path from 'path'

/**
 * 获取 baseDir 目录下以 prefix 开头的目录路径列表
 * @param baseDir - 基础目录路径
 * @param prefix - baseDir 下的目录列表的前缀
 * @param excludeDirs - 需要排除的目录路径列表
 * @returns 符合条件的目标目录列表
 */
export const getTargetDirs = (
  baseDir: string,
  prefix: string,
  excludeDirs: string[] = []
): string[] => {
  try {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true })
    const targetDirs = entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
      .map((entry) => path.join(baseDir, entry.name))
      .filter((dir) => !excludeDirs.includes(dir))
    return targetDirs
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`读取目录 ${baseDir} 时出错：${errorMessage}`)
    return []
  }
}
