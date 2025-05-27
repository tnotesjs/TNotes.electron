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
  disableHMR,
  enableHMR,
} from './utils/index.js'
import { newNotes } from './new.js'
import { __dirname, ROOT_DIR_PATH, port } from './constants.js'
import { tempSync } from './temp-sync.js'
;(async () => {
  try {
    const args = minimist(process.argv)

    const startTime = Date.now()
    let commandExecuted = false

    switch (true) {
      case args.dev:
        const port_ = port || 5173
        await runCommand_spawn(
          `vitepress dev --host --port ${port_}`,
          ROOT_DIR_PATH
        )
        commandExecuted = true
        break
      case args.build:
        await runCommand_spawn(`vitepress build`, ROOT_DIR_PATH)
        commandExecuted = true
        break
      case args.preview:
        await runCommand_spawn(`vitepress preview`, ROOT_DIR_PATH)
        commandExecuted = true
        break
      case args.update:
        await disableHMR()
        const updater = new ReadmeUpdater()
        await updater.updateReadme()
        await enableHMR()
        commandExecuted = true
        break
      case args.push:
        await pushRepo()
        commandExecuted = true
        break
      case args.pushAll:
        await pushAllRepos()
        commandExecuted = true
        break
      case args.pull:
        await pullRepo()
        commandExecuted = true
        break
      case args.pullAll:
        await pullAllRepos()
        commandExecuted = true
        break
      case args.sync:
        await syncRepo()
        commandExecuted = true
        break
      case args.syncAll:
        await syncAllRepos()
        commandExecuted = true
        break
      case args.new:
        newNotes()
        commandExecuted = true
        break
      case args.merge:
        mergeNotes()
        commandExecuted = true
        break
      case args.distribute:
        distributeNotes()
        commandExecuted = true
        break
      case args.tempSync:
        tempSync()
        commandExecuted = true
        break
      default:
        console.log('No valid command provided.')
        break
    }

    if (commandExecuted) {
      const endTime = Date.now() // 记录结束时间
      const duration = endTime - startTime // 计算耗时
      console.log(`✅ Command executed in ${duration}ms`) // 输出耗时日志
    }
  } catch (error) {
    console.error('❌ TNotes Error:', error)
  }
})()
