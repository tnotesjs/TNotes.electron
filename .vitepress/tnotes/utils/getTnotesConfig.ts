import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { TNotesConfig } from '../types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let tnotesConfig: TNotesConfig | null = null
const tnotesConfigPath = path.normalize(
  path.resolve(__dirname, '..', '..', '..', '.tnotes.json')
)

/**
 * 获取 TNotes 配置
 * @returns TNotes 配置对象
 */
export function getTnotesConfig(): TNotesConfig {
  if (tnotesConfig) return tnotesConfig

  const configContent = fs.readFileSync(tnotesConfigPath, 'utf-8')
  tnotesConfig = JSON.parse(configContent) as TNotesConfig

  return tnotesConfig
}
