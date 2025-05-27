import { VP_DIR_PATH } from '../constants.js'
import fs from 'fs'
import path from 'path'

const readConfig = async () => {
  const configPath = path.resolve(VP_DIR_PATH, 'plugins', 'plugins.json')
  const data = await fs.promises.readFile(configPath, 'utf8')
  return { config: JSON.parse(data), configPath }
}

export const disableHMR = async () => {
  try {
    const { config, configPath } = await readConfig()
    config.hmr_enable = false
    await fs.promises.writeFile(
      configPath,
      JSON.stringify(config, null, 2),
      'utf8'
    )
  } catch (err) {
    console.error('Failed to disable HMR:', err)
  }
}

export const enableHMR = async () => {
  try {
    const { config, configPath } = await readConfig()
    config.hmr_enable = true
    await fs.promises.writeFile(
      configPath,
      JSON.stringify(config, null, 2),
      'utf8'
    )
  } catch (err) {
    console.error('Failed to enable HMR:', err)
  }
}

export const isEnableHRM = async () => {
  try {
    const { config } = await readConfig()
    return config.hmr_enable
  } catch (err) {
    console.error('Failed to check HMR status:', err)
    return false // 默认关闭
  }
}

// 在插件初始化时调用一次
export const ensureConfigExists = async () => {
  const configPath = path.resolve(VP_DIR_PATH, 'plugins', 'plugins.json')
  try {
    await fs.promises.access(configPath)
  } catch {
    await fs.promises.writeFile(
      configPath,
      JSON.stringify({ hmr_enable: true }, null, 2),
      'utf8'
    )
  }
}
