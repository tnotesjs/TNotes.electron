import { spawn, exec } from 'child_process'
import path from 'path'
import { existsSync } from 'fs'

export async function runCommand_spawn(command, dir) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: "${command}" in directory: "${dir}"`)

    const [cmd, ...args] = command.split(' ')
    const localCmdPath = path.join(dir, 'node_modules', '.bin', cmd)

    // 如果本地依赖存在，则优先使用本地路径
    const resolvedCmd = existsSync(localCmdPath) ? localCmdPath : cmd

    const child = spawn(resolvedCmd, args, {
      cwd: dir,
      stdio: 'inherit',
      shell: true,
    })

    child.on('error', (err) => {
      console.error(`Error occurred while running command: ${command}`)
      reject(err)
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        console.error(`Command exited with code ${code}`)
        reject(new Error(`Command failed with code ${code}`))
      }
    })
  })
}

export async function runCommand(command, dir) {
  return new Promise((resolve, reject) => {
    // console.log(`Running command: "${command}" in directory: "${dir}"`)
    exec(command, { cwd: dir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`处理 ${dir} 时出错：${stderr}`)
        reject(error)
      } else {
        // console.log(stdout.trim());
        resolve(stdout.trim())
      }
    })
  })
}
