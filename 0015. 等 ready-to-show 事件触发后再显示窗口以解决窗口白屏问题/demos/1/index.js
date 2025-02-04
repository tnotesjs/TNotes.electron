const { app, BrowserWindow } = require('electron')

let win1
let win2
function createWindow() {
  win1 = new BrowserWindow({ x: 0, y: 0, height: 300, width: 500 })
  win2 = new BrowserWindow({ x: 0, y: 300, height: 300, width: 500, show: false })

  win1.loadURL('https://www.electronjs.org/')
  win2.loadURL('https://www.electronjs.org/')

  win2.on('ready-to-show', win2.show)
}

app.whenReady().then(() => {
  createWindow()
})
