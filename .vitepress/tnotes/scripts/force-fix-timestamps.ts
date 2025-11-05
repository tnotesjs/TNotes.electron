/**
 * 强制修复所有笔记的时间戳
 *
 * 用途：修复历史错误数据，将所有时间戳强制更新为 git 真实时间
 * 使用：pnpm tsx .vitepress/tnotes/scripts/force-fix-timestamps.ts
 */
import { TimestampService } from '../services/TimestampService'
import { logger } from '../utils/logger'

async function main() {
  logger.info('🔧 强制修复时间戳工具')
  logger.info('📌 此操作会将所有笔记的时间戳强制更新为 git 真实时间')
  logger.info('')

  const timestampService = new TimestampService()

  // 强制更新所有时间戳
  const result = await timestampService.fixAllTimestamps(true)

  logger.info('')
  logger.info('📊 修复统计:')
  logger.info(`  - 总笔记数: ${result.total}`)
  logger.info(`  - 已修复: ${result.fixed}`)
  logger.info(`  - 跳过: ${result.skipped}`)
  logger.info('')
  logger.success('✅ 时间戳修复完成！')
  logger.info('💡 提示: 现在可以运行 pnpm tn:push 提交更改')
}

main().catch((error) => {
  logger.error('修复失败', error)
  process.exit(1)
})
