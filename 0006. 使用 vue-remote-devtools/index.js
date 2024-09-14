const { app, BrowserWindow } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow()
  win.loadFile('./index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)