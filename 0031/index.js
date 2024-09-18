const { app, BrowserWindow } = require('electron')
const path = require('path')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

app.whenReady().then(() => {
  const win = new BrowserWindow({
    x: 0,
    y: 0,
  })
  win.loadFile('./index.html')
})