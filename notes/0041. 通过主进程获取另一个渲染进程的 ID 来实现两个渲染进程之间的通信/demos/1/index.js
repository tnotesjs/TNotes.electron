const { ipcMain, app, BrowserWindow } = require('electron')

let win1, win2
function createWindows() {
  win1 = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win2 = new BrowserWindow({
    y: 0, x: 0,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win1.webContents.openDevTools()
  win2.webContents.openDevTools()

  win1.loadFile('./index1.html')
  win2.loadFile('./index2.html')
}

function handleIPC() {
  ipcMain.handle('get-win2-id', _ => win2.webContents.id)
  ipcMain.handle('get-win1-id', _ => win1.webContents.id)
}

app.on('ready', () => {
  createWindows()
  handleIPC()
})

