import fs from 'fs'

/**
 * 删除整个目录
 * @param dir - 要删除的目录路径
 */
export const deleteDirectory = (dir: string): void => {
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
