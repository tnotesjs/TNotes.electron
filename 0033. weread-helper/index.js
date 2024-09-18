const { app, BrowserWindow } = require('electron')
const { join } = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  win.loadURL('https://weread.qq.com/')
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})
