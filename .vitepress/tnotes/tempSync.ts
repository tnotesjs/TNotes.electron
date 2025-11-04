import fs from 'fs'
import path from 'path'
import { deleteDirectory, getTargetDirs } from './utils/index'
import {
  EN_WORDS_DIR,
  ROOT_DIR_PATH,
  TNOTES_BASE_DIR,
} from './config/constants'
import { logger } from './utils/logger'
import { runCommand } from './utils/runCommand'

/**
 * 需要同步的文件/目录列表（相对于项目根目录的路径）
 */
const SYNC_LIST = [
  '.vitepress/components',
  '.vitepress/config',
  '.vitepress/plugins',
  '.vitepress/theme',
  '.vitepress/tnotes',
  '.vitepress/config.mts',
  '.vitepress/env.d.ts',
  'tsconfig.json',
  'package.json',
  '.gitignore',
  '.gitattributes',
  '.vscode/settings.json',
  '.vscode/tasks.json',
  'public',
  '.github/workflows/deploy.yml',
]

/**
 * 同步单个文件或目录
 * @param relativePath - 相对于项目根目录的路径
 * @param sourceRoot - 源项目根目录
 * @param targetRoot - 目标项目根目录
 */
function syncItem(
  relativePath: string,
  sourceRoot: string,
  targetRoot: string
): void {
  const sourcePath = path.join(sourceRoot, relativePath)
  const targetPath = path.join(targetRoot, relativePath)

  // 检查源路径是否存在
  if (!fs.existsSync(sourcePath)) {
    console.warn(`  ⚠️ 源不存在: ${relativePath}`)
    return
  }

  // 删除目标路径（如果存在）
  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory()) {
      deleteDirectory(targetPath)
    } else {
      fs.unlinkSync(targetPath)
    }
  }

  // 确保目标父目录存在
  const targetDir = path.dirname(targetPath)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // 复制源到目标
  if (fs.statSync(sourcePath).isDirectory()) {
    fs.cpSync(sourcePath, targetPath, { recursive: true })
  } else {
    fs.copyFileSync(sourcePath, targetPath)
  }
}

/**
 * 同步单个仓库的所有配置
 * @param targetDir - 目标仓库目录
 */
async function syncSingleRepo(targetDir: string): Promise<{
  dir: string
  success: boolean
  error?: string
}> {
  try {
    // 1. 同步配置文件
    for (const item of SYNC_LIST) {
      syncItem(item, ROOT_DIR_PATH, targetDir)
    }

    // 2. node_modules 删除
    // 说明：重新安装依赖会自动覆盖旧文件，无需手动删除
    // const nodeModulesPath = path.join(targetDir, 'node_modules')
    // if (fs.existsSync(nodeModulesPath)) {
    //   deleteDirectory(nodeModulesPath)
    // }

    // 3. 重新安装依赖
    await runCommand('pnpm i', targetDir)

    return { dir: targetDir, success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { dir: targetDir, success: false, error: errorMessage }
  }
}

/**
 * 批量操作结果接口
 */
interface SyncResult {
  dir: string
  success: boolean
  error?: string
}

/**
 * 实现模板同步功能
 * 同步知识库脚本到其它 TNotes.xxx 知识库中
 */
export async function tempSync(): Promise<void> {
  try {
    // 获取目标目录
    const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [
      ROOT_DIR_PATH,
      EN_WORDS_DIR,
    ])

    if (targetDirs.length === 0) {
      logger.warn('未找到符合条件的目标目录')
      return
    }

    logger.info(`正在同步配置到 ${targetDirs.length} 个仓库...`)
    logger.info(`同步列表: ${SYNC_LIST.length} 项`)

    // 并行同步所有仓库
    const promises = targetDirs.map(async (dir, index) => {
      const result = await syncSingleRepo(dir)
      // 显示进度（非精确，因为并发）
      process.stdout.write(`\r  进度: ~${index + 1}/${targetDirs.length}`)
      return result
    })

    const results = await Promise.all(promises)
    console.log() // 换行

    // 显示汇总
    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    if (failCount === 0) {
      logger.success(`同步完成: ${successCount}/${results.length} 个仓库成功`)
    } else {
      logger.warn(
        `同步完成: ${successCount} 成功, ${failCount} 失败 (共 ${results.length} 个)`
      )
      console.log('\n失败的仓库:')
      results
        .filter((r) => !r.success)
        .forEach((r, index) => {
          const repoName = r.dir.split('\\').pop() || r.dir
          console.log(`  ${index + 1}. ${repoName}`)
          console.log(`     错误: ${r.error}`)
        })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`模板同步失败: ${errorMessage}`)
    throw error
  }
}
