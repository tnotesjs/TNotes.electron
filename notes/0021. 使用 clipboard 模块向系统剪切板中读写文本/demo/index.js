const { clipboard, app, BrowserWindow, ipcMain } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  })

  win.webContents.openDevTools()

  win.loadFile('./index.html')
}

function handleIPC() {
  ipcMain.handle('write-text', (_, text) => clipboard.writeText(text))
  ipcMain.handle('read-text', _ => clipboard.readText())
}


app.on('ready', () => {
  createWindow()
  handleIPC()
})