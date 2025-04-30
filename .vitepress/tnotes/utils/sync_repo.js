import { runCommand } from './run_command.js'
import { TNOTES_BASE_DIR, ROOT_DIR } from '../constants.js'
import { getTargetDirs } from './get_target_dirs.js'

/**
 * 确保目录是一个有效的 Git 仓库
 * @param {string} dir - 目录路径
 * @returns {Promise<boolean>} 是否为有效的 Git 仓库
 */
async function ensureGitRepo(dir) {
  try {
    const isGitRepo = await runCommand(
      'git rev-parse --is-inside-work-tree',
      dir
    ).catch(() => false)
    if (!isGitRepo) {
      throw new Error(`${dir} 不是一个有效的 Git 仓库。`)
    }
    return true
  } catch (error) {
    console.error(error.message)
    return false
  }
}

/**
 * 拉取远程仓库的更新
 * - 该函数尝试拉取远程仓库的更新，并在必要时处理未提交的更改。
 * - 它使用 stash 策略来保存未提交的更改，在拉取完成后恢复这些更改。
 * @param {string} dir - 本地仓库目录路径
 */
export async function pullRepo(dir = ROOT_DIR) {
  try {
    // 确保是 Git 仓库
    if (!(await ensureGitRepo(dir))) return

    // 处理未暂存更改
    const statusOutput = await runCommand('git status --porcelain', dir)
    if (statusOutput) {
      console.log(`${dir} 存在未暂存的更改，先 git stash`)
      await runCommand('git stash', dir)
    }

    // 拉取远程更新
    console.log(`${dir} 正在拉取远程更新...`)
    await runCommand('git pull --rebase', dir)

    // 恢复 stash 的更改
    if (statusOutput) {
      console.log(`${dir} 取回之前的更改`)
      await runCommand('git stash pop', dir)
    }
  } catch (error) {
    console.error(`拉取 ${dir} 时出错：${error.message}`)
  }
}

/**
 * 推送本地更改到远程仓库
 * - 该函数检查是否有未提交的更改，如果有，则提交并推送到远程仓库。
 * @param {string} dir - 本地仓库目录路径
 */
export async function pushRepo(dir = ROOT_DIR) {
  try {
    // 确保是 Git 仓库
    if (!(await ensureGitRepo(dir))) return

    // 检查是否有未提交的更改
    const statusOutput = await runCommand('git status --porcelain', dir)
    if (!statusOutput) {
      console.log(`${dir} 没有新的更改，跳过提交`)
      return
    }

    // 提交并推送
    console.log(`${dir} 正在提交并推送更改...`)
    await runCommand('git add .', dir)
    const changedFiles = statusOutput.split('\n').length
    await runCommand(
      `git commit -m "update: ${changedFiles} files modified"`,
      dir
    )
    await runCommand('git push', dir)

    // 获取远程 URL
    const url = await runCommand('git remote -v', dir)
    const remoteMatch = url.match(/https:\/\/[^\s]+|git@[^:\s]+:[^\s]+/)
    console.log(
      `✅ 笔记同步完成 ${remoteMatch ? remoteMatch[0] : '（无法解析远程 URL）'}`
    )
  } catch (error) {
    console.error(
      `推送 ${dir} 时出错：${error.message}\n请检查网络环境，可尝试手动执行 git push 推送`
    )
  }
}

/**
 * 同步本地和远程 Git 仓库
 * - 该函数调用 pullRepo 和 pushRepo 方法，分别完成拉取和推送操作。
 * @param {string} dir - 本地仓库目录路径
 */
export async function syncRepo(dir = ROOT_DIR) {
  try {
    await pullRepo(dir)
    await pushRepo(dir)
  } catch (error) {
    console.error(`同步 ${dir} 时出错：${error.message}`)
  }
}

/**
 * 在所有 TNotes.* 中执行 npm run tn:push 命令
 */
export async function pushAllRepos() {
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.')
  console.log('开始推送所有仓库...')
  for (const dir of targetDirs) {
    try {
      console.log(`正在推送 ${dir}...`)
      await runCommand('npm run tn:push', dir)
      console.log(`✅ 完成推送 ${dir}`)
    } catch (error) {
      console.error(`推送 ${dir} 时出错：${error.message}`)
    }
  }
}

/**
 * 在所有 TNotes.* 中执行 npm run tn:pull 命令
 */
export async function pullAllRepos() {
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.')
  console.log('开始拉取所有仓库...')
  for (const dir of targetDirs) {
    try {
      console.log(`正在拉取 ${dir}...`)
      await runCommand('npm run tn:pull', dir)
      console.log(`✅ 完成拉取 ${dir}`)
    } catch (error) {
      console.error(`拉取 ${dir} 时出错：${error.message}`)
    }
  }
}

/**
 * 在所有 TNotes.* 中执行 npm run tn:sync 命令
 */
export async function syncAllRepos() {
  const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.')
  console.log('开始同步所有仓库...')
  for (const dir of targetDirs) {
    try {
      console.log(`正在同步 ${dir}...`)
      await runCommand('npm run tn:sync', dir)
      console.log(`✅ 完成同步 ${dir}`)
    } catch (error) {
      console.error(`同步 ${dir} 时出错：${error.message}`)
    }
  }
}
