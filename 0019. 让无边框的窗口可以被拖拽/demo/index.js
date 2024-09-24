const { BrowserWindow, app } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({ frame: false })
  // win.webContents.openDevTools()
  win.loadFile('./index.html')
}

app.whenReady().then(createWindow)
