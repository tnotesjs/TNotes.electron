import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let tnotes_config = null
let tnotes_config_path = path.normalize(
  path.resolve(__dirname, '..', '..', '..', '.tnotes.json')
)

export function getTnotesConfig() {
  if (tnotes_config) return tnotes_config
  tnotes_config = JSON.parse(fs.readFileSync(tnotes_config_path))
  return tnotes_config
}
