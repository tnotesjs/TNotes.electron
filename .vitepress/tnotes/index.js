import minimist from 'minimist'

import ReadmeUpdater from './update.js'
import { mergeNotes, distributeNotes } from './merge_distribute.js'
import {
  syncRepo,
  pushRepo,
  pullRepo,
  syncAllRepos,
  pushAllRepos,
  pullAllRepos,
  runCommand_spawn,
} from './utils/index.js'
import { newNotes } from './new.js'
import { __dirname, ROOT_DIR, port } from './constants.js'
import { tempSync } from './temp-sync.js'
;(async () => {
  const args = minimist(process.argv)

  switch (true) {
    case args.dev:
      console.log('dev mode', port) // dev mode 9914
      const port_ = port || 5173
      await runCommand_spawn(`vitepress dev --host --port ${port_}`, ROOT_DIR)
      break
    case args.build:
      runCommand_spawn(`vitepress build`, ROOT_DIR)
      break
    case args.preview:
      runCommand_spawn(`vitepress preview`, ROOT_DIR)
      break
    case args.update:
      const updater = new ReadmeUpdater()
      updater.updateReadme()
      // await syncRepo();
      break
    case args.push:
      await pushRepo()
      break
    case args.pushAll:
      await pushAllRepos()
      break
    case args.pull:
      await pullRepo()
      break
    case args.pullAll:
      await pullAllRepos()
      break
    case args.sync:
      await syncRepo()
      break
    case args.syncAll:
      await syncAllRepos()
      break
    case args.new:
      newNotes()
      break
    case args.merge:
      mergeNotes()
      break
    case args.distribute:
      distributeNotes()
      break
    case args.tempSync:
      tempSync()
      break
    default:
      console.log('No valid command provided.')
      break
  }
})()
