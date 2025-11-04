/**
 * .vitepress/tnotes/utils/syncRepo.ts
 *
 * 同步 Git 仓库的工具函数
 */
import { runCommand } from './runCommand'
import {
  TNOTES_BASE_DIR,
  ROOT_DIR_PATH,
  EN_WORDS_DIR,
} from '../config/constants'
import { getTargetDirs } from './getTargetDirs'
import { GitManager } from '../lib/GitManager'
import { logger } from './logger'
import { handleError } from './errorHandler'

/**
 * 拉取远程仓库的更新
 * @param dir - 本地仓库目录路径
 */
export async function pullRepo(dir: string = ROOT_DIR_PATH): Promise<void> {
  const git = new GitManager(dir, logger.child('pull'))

  try {
    // 检查是否为有效仓库
    if (!(await git.isValidRepo())) {
      logger.warn(`${dir} 不是一个合法的 git 仓库，跳过...`)
      return
    }

    await git.pull({ rebase: true, autostash: true })
  } catch (error) {
    logger.error(`Failed to pull ${dir}`)
    handleError(error)
  }
}

/**
 * 推送本地更改到远程仓库
 * @param dir - 本地仓库目录路径
 */
export async function pushRepo(dir: string = ROOT_DIR_PATH): Promise<void> {
  const git = new GitManager(dir, logger.child('push'))

  try {
    // 检查是否为有效仓库
    if (!(await git.isValidRepo())) {
      logger.warn(`${dir} 不是一个合法的 git 仓库，跳过...`)
      return
    }

    await git.pushWithCommit()
  } catch (error) {
    logger.error(`Failed to push ${dir}`)
    handleError(error)
    throw error // 重新抛出以便上层处理
  }
}

/**
 * 同步本地和远程 Git 仓库
 * @param dir - 本地仓库目录路径
 */
export async function syncRepo(dir: string = ROOT_DIR_PATH): Promise<void> {
  const git = new GitManager(dir, logger.child('sync'))

  try {
    // 检查是否为有效仓库
    if (!(await git.isValidRepo())) {
      logger.warn(`${dir} 不是一个合法的 git 仓库，跳过...`)
      return
    }

    await git.sync()
  } catch (error) {
    logger.error(`Failed to sync ${dir}`)
    handleError(error)
  }
}

/**
 * 批量操作结果接口
 */
interface BatchResult {
  dir: string
  success: boolean
  error?: string
}

/**
 * 在所有 TNotes.* 中执行推送操作
 * @param options - 选项
 * @param options.parallel - 是否并行执行（默认 false）
 * @param options.continueOnError - 遇到错误是否继续（默认 true）
 */
export async function pushAllRepos(options?: {
  parallel?: boolean
  continueOnError?: boolean
}): Promise<void> {
  const { parallel = true, continueOnError = true } = options || {}
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [EN_WORDS_DIR])

  logger.info(`正在推送 ${targetDirs.length} 个仓库...`)

  const results: BatchResult[] = []

  if (parallel) {
    // 并行执行
    const promises = targetDirs.map(async (dir, index) => {
      try {
        await runCommand('pnpm tn:push', dir)
        // 显示进度（非精确，因为并发）
        process.stdout.write(`\r  进度: ~${index + 1}/${targetDirs.length}`)
        return { dir, success: true }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        return { dir, success: false, error: errorMessage }
      }
    })

    results.push(...(await Promise.all(promises)))
    console.log() // 换行
  } else {
    // 串行执行（速度慢但进度精确）
    for (let i = 0; i < targetDirs.length; i++) {
      const dir = targetDirs[i]
      try {
        await runCommand('pnpm tn:push', dir)
        process.stdout.write(`\r  进度: ${i + 1}/${targetDirs.length}`)
        results.push({ dir, success: true })
      } catch (error) {
        process.stdout.write(`\r  进度: ${i + 1}/${targetDirs.length}`)
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        results.push({ dir, success: false, error: errorMessage })

        if (!continueOnError) {
          console.log() // 换行
          throw error
        }
      }
    }
    console.log() // 换行
  }

  // 显示汇总
  const successCount = results.filter((r) => r.success).length
  const failCount = results.length - successCount

  if (failCount === 0) {
    logger.success(`推送完成: ${successCount}/${results.length} 个仓库成功`)
  } else {
    logger.warn(
      `推送完成: ${successCount} 成功, ${failCount} 失败 (共 ${results.length} 个)`
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
}

/**
 * 在所有 TNotes.* 中执行拉取操作
 * @param options - 选项
 */
export async function pullAllRepos(options?: {
  parallel?: boolean
  continueOnError?: boolean
}): Promise<void> {
  const { parallel = true, continueOnError = true } = options || {}
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [EN_WORDS_DIR])

  logger.info(`正在拉取 ${targetDirs.length} 个仓库...`)

  const results: BatchResult[] = []

  if (parallel) {
    // 并行执行（推荐，速度快）
    const promises = targetDirs.map(async (dir, index) => {
      try {
        await runCommand('pnpm tn:pull', dir)
        // 显示进度（非精确，因为并发）
        process.stdout.write(`\r  进度: ~${index + 1}/${targetDirs.length}`)
        return { dir, success: true }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        return { dir, success: false, error: errorMessage }
      }
    })

    results.push(...(await Promise.all(promises)))
    console.log() // 换行
  } else {
    // 串行执行（速度慢但进度精确）
    for (let i = 0; i < targetDirs.length; i++) {
      const dir = targetDirs[i]
      try {
        await runCommand('pnpm tn:pull', dir)
        process.stdout.write(`\r  进度: ${i + 1}/${targetDirs.length}`)
        results.push({ dir, success: true })
      } catch (error) {
        process.stdout.write(`\r  进度: ${i + 1}/${targetDirs.length}`)
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        results.push({ dir, success: false, error: errorMessage })

        if (!continueOnError) {
          console.log() // 换行
          throw error
        }
      }
    }
    console.log() // 换行
  }

  // 显示汇总
  const successCount = results.filter((r) => r.success).length
  const failCount = results.length - successCount

  if (failCount === 0) {
    logger.success(`拉取完成: ${successCount}/${results.length} 个仓库成功`)
  } else {
    logger.warn(
      `拉取完成: ${successCount} 成功, ${failCount} 失败 (共 ${results.length} 个)`
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
}

/**
 * 在所有 TNotes.* 中执行同步操作
 * @param options - 选项
 */
export async function syncAllRepos(options?: {
  parallel?: boolean
  continueOnError?: boolean
}): Promise<void> {
  const { parallel = true, continueOnError = true } = options || {}
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.')

  logger.info(`正在同步 ${targetDirs.length} 个仓库...`)

  const results: BatchResult[] = []

  if (parallel) {
    // 并行执行（推荐，速度快）
    const promises = targetDirs.map(async (dir, index) => {
      try {
        await runCommand('pnpm tn:sync', dir)
        // 显示进度（非精确，因为并发）
        process.stdout.write(`\r  进度: ~${index + 1}/${targetDirs.length}`)
        return { dir, success: true }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        return { dir, success: false, error: errorMessage }
      }
    })

    results.push(...(await Promise.all(promises)))
  } else {
    // 串行执行（速度慢但进度精确）
    for (let i = 0; i < targetDirs.length; i++) {
      const dir = targetDirs[i]
      try {
        await runCommand('pnpm tn:sync', dir)
        process.stdout.write(`\r  进度: ${i + 1}/${targetDirs.length}`)
        results.push({ dir, success: true })
      } catch (error) {
        process.stdout.write(`\r  进度: ${i + 1}/${targetDirs.length}`)
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        results.push({ dir, success: false, error: errorMessage })

        if (!continueOnError) {
          throw error
        }
      }
    }
  }

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
}
