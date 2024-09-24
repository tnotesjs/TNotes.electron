// 打开终端输入命令 npm run dev 查看最终的打印结果
const { app } = require('electron')
const { join } = require('path')

app.on('ready', () => {
  const exeFilePath       = app.getPath('exe')
  const installFolderPath = join(exeFilePath, '../')
  const desktopPath       = app.getPath('desktop')
  // ...

  console.log('【可执行文件路径】', exeFilePath)
  console.log('【安装目录】',      installFolderPath)
  console.log('【用户桌面路径】',   desktopPath)
  // ...
})
