import fs from 'node:fs'
import path from 'node:path'

export interface TNotesConfig {
  sidebarShowNoteId: boolean
  author?: string
  repoName?: string
  [key: string]: any
}

export default {
  watch: ['../../../../.tnotes.json'],
  load(watchedFiles: string[]): TNotesConfig {
    const fileContent = fs.readFileSync(watchedFiles[0], 'utf-8')
    const config = JSON.parse(fileContent) as TNotesConfig
    console.log(
      '📖 [tnotes-config.data.ts] Config loaded, sidebarShowNoteId:',
      config.sidebarShowNoteId
    )
    return config
  },
}
