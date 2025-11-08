/**
 * .vitepress/tnotes/utils/prettier.ts
 *
 * Prettier 格式化工具
 */
import { execSync } from 'child_process'
import { logger } from './logger'

/**
 * 使用 Prettier 格式化文件
 * @param filePath - 文件路径(可以是单个文件或 glob 模式)
 * @param options - 格式化选项
 */
export async function formatWithPrettier(
  filePath: string | string[],
  options?: {
    silent?: boolean // 是否静默执行(不显示输出)
    ignoreErrors?: boolean // 是否忽略错误
  }
): Promise<void> {
  try {
    const paths = Array.isArray(filePath) ? filePath : [filePath]
    const pathsStr = paths.map((p) => `"${p}"`).join(' ')

    execSync(`npx prettier --write ${pathsStr}`, {
      stdio: options?.silent ? 'pipe' : 'inherit',
      cwd: process.cwd(),
    })
  } catch (error) {
    if (!options?.ignoreErrors) {
      logger.warn('Prettier 格式化失败，跳过', error)
    }
  }
}

/**
 * 检查文件是否符合 Prettier 格式
 * @param filePath - 文件路径
 * @returns 是否格式正确
 */
export async function checkPrettierFormat(filePath: string): Promise<boolean> {
  try {
    execSync(`npx prettier --check "${filePath}"`, {
      stdio: 'pipe',
      cwd: process.cwd(),
    })
    return true
  } catch {
    return false
  }
}
