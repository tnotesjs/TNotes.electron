const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win1 = new BrowserWindow({ alwaysOnTop: true })
  win1.loadFile('./index1.html')

  const win2 = new BrowserWindow()
  win2.loadFile('./index2.html')

  // 使用 win.setAlwaysOnTop 可以实现更细粒度的层级控制。
  // 例如，可以将窗口设置为 'pop-up-menu' 层级，这样它就不会被任务栏遮挡。
  win2.setAlwaysOnTop(true, 'pop-up-menu')
})
