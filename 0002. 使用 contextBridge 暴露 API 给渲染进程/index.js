const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const { join } = require('path')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('index.html')

  ipcMain.on('TdahuyouPlugin-showNotification',(_, { title, body }) => {
      if (Notification.isSupported()) {
        const notification = new Notification({ title, body })
        notification.show()
      }
    }
  )
}

app.whenReady().then(createWindow)
