/**
 * .vitepress/tnotes/config/index.ts
 *
 * 配置层统一导出
 */

// 配置管理器
export {
  ConfigManager,
  getConfigManager,
  getTnotesConfig,
} from './ConfigManager'

// 常量
export * from './constants'

// 模板
export * from './templates'
