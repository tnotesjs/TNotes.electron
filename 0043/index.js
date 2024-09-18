const {app, BrowserWindow} = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.webContents.openDevTools()

  win.loadFile("./index.html")
}

function handleIPC() {
  win.webContents.send('msg-from-main-process', 1, 2, 3)
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})