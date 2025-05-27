// .vitepress/tnotes/template-sync.js
import fs from 'fs'
import path from 'path'
import { deleteDirectory, copyFile, getTargetDirs } from './utils/index.js'
import {
  EN_WORDS_DIR,
  GITHUB_DEPLOYYML_PATH,
  ROOT_DIR_PATH,
  ROOT_PKG_PATH,
  TNOTES_BASE_DIR,
  VP_DIR_PATH,
  VSCODE_SETTINGS_PATH,
} from './constants.js'

/**
 * .vitepress 目录下需要同步的目录/文件列表
 */
const VP_SYNC_LIST = ['components', 'theme', 'plugins', 'tnotes', 'config.mts']

/**
 * 复制白名单中的文件或目录
 * @param {string} source - 源路径
 * @param {string} target - 目标路径
 */
const copyWhitelistedFiles = (source, target) => {
  try {
    // 如果目标目录不存在，则创建
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true })
    }

    for (const item of VP_SYNC_LIST) {
      const sourcePath = path.join(source, item)
      const targetPath = path.join(target, item)

      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          // 递归复制目录
          fs.cpSync(sourcePath, targetPath, { recursive: true })
          // console.log(`已复制目录：${sourcePath} -> ${targetPath}`)
        } else {
          // 直接复制文件
          fs.copyFileSync(sourcePath, targetPath)
          // console.log(`已复制文件：${sourcePath} -> ${targetPath}`)
        }
      } else {
        console.warn(`⚠️ 源路径中不存在：${sourcePath}`)
      }
    }
    console.log(`✅ 复制完成 ${target}`)
  } catch (error) {
    console.error(`❌ 复制失败：${source} -> ${target}: ${error.message}`)
  }
}

/**
 * 实现模板同步功能
 */
export async function tempSync() {
  try {
    // 获取基础目录和当前模块所在的目录
    const targetDirs = getTargetDirs(TNOTES_BASE_DIR, 'TNotes.', [
      ROOT_DIR_PATH,
      EN_WORDS_DIR,
    ])

    if (targetDirs.length === 0) {
      console.log('未找到符合条件的目标目录')
      return
    }

    // 遍历目标目录并同步内容
    for (const targetDir of targetDirs) {
      console.log('targetDir =>', targetDir)
      const targetVitepressDir = path.join(targetDir, '.vitepress')
      deleteDirectory(targetVitepressDir) // 删除目标目录下的整个 .vitepress 文件夹

      // 创建新的 .vitepress 文件夹，并复制 VP_SYNC_LIST 中的内容
      copyWhitelistedFiles(VP_DIR_PATH, targetVitepressDir)

      // 复制 package.json 文件
      copyFile(ROOT_PKG_PATH, path.resolve(targetDir, 'package.json'))

      // 复制 .vscode/settings.json 文件
      copyFile(
        VSCODE_SETTINGS_PATH,
        path.resolve(targetDir, '.vscode', 'settings.json')
      )

      // 复制 .github/workflows/deploy.yml 文件
      copyFile(
        GITHUB_DEPLOYYML_PATH,
        path.resolve(targetDir, '.github', 'workflows', 'deploy.yml')
      )

      console.log('---------------')
    }

    console.log('✅ 模板同步完成')

    // debug
    // console.log('VP_DIR_PATH', VP_DIR_PATH)
    // console.log('ROOT_PKG_PATH', ROOT_PKG_PATH)
    // console.log('GITHUB_DEPLOYYML_PATH', GITHUB_DEPLOYYML_PATH)
    // console.log('baseDir', baseDir)
    // console.log('currentModuleDir', currentModuleDir)
    // console.log('targetDirs', targetDirs)
  } catch (error) {
    console.error(`模板同步失败：${error.message}`)
  }
}
