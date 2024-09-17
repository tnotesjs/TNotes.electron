const {app, BrowserWindow, ipcMain} = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.webContents.openDevTools()

  win.loadFile("./index.html")
}

function handleIPC() {
  ipcMain.handle('invoke-message1', (_, ...args) => {
    console.log('invoke-message1', ...args)
  })

  ipcMain.handle('invoke-message2', (_, ...args) => {
    console.log('invoke-message2', ...args)
    return args.reduce((a, b) => a + b, 0)
  })
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})