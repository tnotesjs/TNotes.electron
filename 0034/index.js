const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const messageChannelRecord = {}

function createWindow(filePath) {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile(filePath)
  win.webContents.openDevTools()
}

function handleIPC () {
  ipcMain.handle('registerChannelEvent', (e, channel) => {
    // 注意：
    // e.senderer.id 是 win.webContents.id
    // BrowserWindow.fromWebContents(e.sender).id 是 win.id
    // 通过 BrowserWindow.fromId(ID) 来查询 BrowserWindow 实例，所需的是 win.id
    if (messageChannelRecord[channel]) {
      messageChannelRecord[channel].push(BrowserWindow.fromWebContents(e.sender).id)
    } else {
      messageChannelRecord[channel] = [BrowserWindow.fromWebContents(e.sender).id]
    }
    console.log('messageChannelRecord:', messageChannelRecord)
  })

  ipcMain.handle('emitterChannelEvent', (e, channel, data) => {
    console.log(BrowserWindow.getAllWindows().map(win => ({ winId: win.id, webContentsId: win.webContents.id })))
    if (messageChannelRecord[channel]) {
      messageChannelRecord[channel].forEach(id => {
        let win = BrowserWindow.fromId(id)
        if (win) {
          win.webContents.send(channel, data)
        }
      })
    }
  })
}

app.whenReady().then(() => {
  ;[
    path.join(__dirname, './renderer/win1/index.html'),
    path.join(__dirname, './renderer/win2/index.html'),
    path.join(__dirname, './renderer/win3/index.html'),
  ].forEach((filePath) => createWindow(filePath));
  handleIPC();
})
