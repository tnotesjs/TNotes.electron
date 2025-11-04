/**
 * .vitepress/tnotes/utils/file.ts
 *
 * 文件操作工具函数
 */
import fs from 'fs'

/**
 * 复制文件
 * @param sourceFilePath - 源文件路径
 * @param targetFilePath - 目标文件路径
 */
export function copyFile(sourceFilePath: string, targetFilePath: string): void {
  try {
    if (fs.existsSync(sourceFilePath)) {
      fs.copyFileSync(sourceFilePath, targetFilePath)
      console.log(`✅ 已复制 ${sourceFilePath} 到 ${targetFilePath}`)
    } else {
      console.warn(`⚠️ 源路径中不存在：${sourceFilePath}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`❌ 复制 ${sourceFilePath} 失败：${errorMessage}`)
  }
}

/**
 * 删除整个目录
 * @param dir - 要删除的目录路径
 */
export function deleteDirectory(dir: string): void {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true })
      console.log(`✅ 已删除目录：${dir}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`❌ 删除目录失败：${dir}: ${errorMessage}`)
  }
}

/**
 * 确保目录存在
 * @param dir - 目录路径
 */
export async function ensureDirectory(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true })
  }
}

/**
 * 检查文件或目录是否存在
 * @param filePath - 文件或目录路径
 */
export async function isExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}
