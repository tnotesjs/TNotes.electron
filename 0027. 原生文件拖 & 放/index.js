const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

let win
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

ipcMain.on('ondragstart', (event, filePath) => {

  console.log('event.sender === win.webContents =>', event.sender === win.webContents) // true
  console.log('filePath =>', filePath)
  // event.sender === win.webContents => true
  // filePath => /Users/huyouda/Desktop/【demo】原生文件拖 & 放/drag-and-drop.md

  event.sender.startDrag({
    file: filePath,
    icon: path.join(__dirname, 'iconForDragAndDrop.png'),
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
