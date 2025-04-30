import fs from 'fs'
/**
 * 删除整个目录
 * @param {string} dir - 要删除的目录路径
 */
export const deleteDirectory = (dir) => {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true })
      console.log(`✅ 已删除目录：${dir}`)
    }
  } catch (error) {
    console.error(`❌ 删除目录失败：${dir}: ${error.message}`)
  }
}