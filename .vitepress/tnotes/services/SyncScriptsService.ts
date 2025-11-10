/**
 * .vitepress/tnotes/services/SyncScriptsService.ts
 *
 * 脚本同步服务 - 同步知识库脚本到其它 TNotes.xxx 知识库
 */
import * as fs from 'fs'
import * as path from 'path'
import { deleteDirectory, getTargetDirs } from '../utils'
import {
  EN_WORDS_DIR,
  ROOT_DIR_PATH,
  TNOTES_BASE_DIR,
} from '../config/constants'
import { logger } from '../utils/logger'

/**
 * 需要同步的文件/目录列表（相对于项目根目录的路径）
 */
const SYNC_LIST = [
  // 同步 VitePress 核心脚本
  '.vitepress/theme',
  '.vitepress/tnotes',
  '.vitepress/config.mts',
  '.vitepress/env.d.ts',
  // 同步 TS 配置
  'tsconfig.json',
  // 同步依赖和命令
  'package.json',
  // 同步 Git 配置
  '.gitignore',
  '.gitattributes',
  // 同步 VSCode 配置
  '.vscode/settings.json',
  '.vscode/tasks.json',
  // 同步公共资源
  'public',
  // 同步 GitHub Actions 部署配置
  '.github/workflows/deploy.yml',
  // 同步共用页面
  'Settings.md',
  'Loading.md',
]

/**
 * 同步结果接口
 */
interface SyncResult {
  dir: string
  success: boolean
  error?: string
}

/**
 * 脚本同步服务类
 */
export class SyncScriptsService {
  /**
   * 同步单个文件或目录
   * @param relativePath - 相对于项目根目录的路径
   * @param sourceRoot - 源项目根目录
   * @param targetRoot - 目标项目根目录
   */
  private syncItem(
    relativePath: string,
    sourceRoot: string,
    targetRoot: string
  ): void {
    const sourcePath = path.join(sourceRoot, relativePath)
    const targetPath = path.join(targetRoot, relativePath)

    // 检查源路径是否存在
    if (!fs.existsSync(sourcePath)) {
      logger.warn(`源不存在: ${relativePath}`)
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
  private async syncSingleRepo(targetDir: string): Promise<SyncResult> {
    const repoName = path.basename(targetDir)
    try {
      // 先清空目标仓库的 .vitepress 目录
      const targetVitepressDir = path.join(targetDir, '.vitepress')
      if (fs.existsSync(targetVitepressDir)) {
        logger.info(`  清空 .vitepress 目录...`)
        deleteDirectory(targetVitepressDir)
      }

      // 同步配置文件
      for (const item of SYNC_LIST) {
        this.syncItem(item, ROOT_DIR_PATH, targetDir)
      }

      return { dir: targetDir, success: true }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`${repoName}: 同步失败 - ${errorMessage}`)
      return { dir: targetDir, success: false, error: errorMessage }
    }
  }

  /**
   * 同步脚本到所有目标知识库
   */
  async syncToAllRepos(): Promise<void> {
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
      console.log()

      // 顺序同步所有仓库
      const results: SyncResult[] = []
      for (let i = 0; i < targetDirs.length; i++) {
        const dir = targetDirs[i]
        const repoName = path.basename(dir)
        logger.info(`[${i + 1}/${targetDirs.length}] 同步: ${repoName}`)

        const result = await this.syncSingleRepo(dir)
        results.push(result)

        if (result.success) {
          logger.success(`  ✓ 完成\n`)
        } else {
          logger.error(`  ✗ 失败: ${result.error}\n`)
        }
      }

      // 显示汇总
      const successCount = results.filter((r) => r.success).length
      const failCount = results.length - successCount

      console.log('━'.repeat(50))
      if (failCount === 0) {
        logger.success(`✨ 同步完成: ${successCount}/${results.length} 个仓库`)
      } else {
        logger.warn(
          `⚠️  同步完成: ${successCount} 成功, ${failCount} 失败 (共 ${results.length} 个)`
        )
        console.log('\n失败的仓库:')
        results
          .filter((r) => !r.success)
          .forEach((r, index) => {
            const repoName = path.basename(r.dir)
            console.log(`  ${index + 1}. ${repoName}`)
            console.log(`     错误: ${r.error}`)
          })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`脚本同步失败: ${errorMessage}`)
      throw error
    }
  }
}
