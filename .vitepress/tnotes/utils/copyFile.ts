import fs from 'fs'

/**
 * 复制文件
 * @param sourceFilePath - 源文件路径
 * @param targetFilePath - 目标文件路径
 */
export const copyFile = (
  sourceFilePath: string,
  targetFilePath: string
): void => {
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
