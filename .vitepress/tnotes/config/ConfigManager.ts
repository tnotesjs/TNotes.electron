/**
 * .vitepress/tnotes/config/ConfigManager.ts
 *
 * 配置管理器 - 统一管理项目配置
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { TNotesConfig } from '../types'
import { validateAndCompleteConfig } from './defaultConfig'
import { logger } from '../utils/logger'

/**
 * 配置管理器（单例模式）
 */
export class ConfigManager {
  private static instance: ConfigManager
  private config: TNotesConfig | null = null
  private configPath: string
  private __dirname: string

  private constructor() {
    this.__dirname = path.dirname(fileURLToPath(import.meta.url))
    this.configPath = path.normalize(
      path.resolve(this.__dirname, '..', '..', '..', '.tnotes.json')
    )
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  /**
   * 加载配置文件
   */
  loadConfig(configPath?: string): TNotesConfig {
    if (this.config) return this.config

    const path = configPath || this.configPath

    if (!fs.existsSync(path)) {
      throw new Error(`配置文件不存在: ${path}`)
    }

    const configContent = fs.readFileSync(path, 'utf-8')
    const rawConfig = JSON.parse(configContent)

    // 验证并补全配置
    const { config: validatedConfig, modified } =
      validateAndCompleteConfig(rawConfig)

    if (modified) {
      logger.warn('检测到配置缺失字段，已自动补全')
      // 写回配置文件
      fs.writeFileSync(path, JSON.stringify(validatedConfig, null, 2), 'utf-8')
      logger.info('配置文件已更新')
    }

    this.config = validatedConfig

    return this.config
  }

  /**
   * 获取配置项
   */
  get<K extends keyof TNotesConfig>(key: K): TNotesConfig[K] {
    if (!this.config) {
      this.loadConfig()
    }
    return this.config![key]
  }

  /**
   * 获取所有配置
   */
  getAll(): TNotesConfig {
    if (!this.config) {
      this.loadConfig()
    }
    return this.config!
  }

  /**
   * 重新加载配置
   */
  reload(): TNotesConfig {
    this.config = null
    return this.loadConfig()
  }

  /**
   * 获取 __dirname
   */
  getDirname(): string {
    return this.__dirname
  }
}

/**
 * 获取配置管理器实例（便捷函数）
 */
export function getConfigManager(): ConfigManager {
  return ConfigManager.getInstance()
}

/**
 * 获取 TNotes 配置（向后兼容）
 */
export function getTnotesConfig(): TNotesConfig {
  return ConfigManager.getInstance().getAll()
}
