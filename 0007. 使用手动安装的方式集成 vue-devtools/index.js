const { app, BrowserWindow, session } = require('electron')
const path = require('path')

let win

function createWindow() {
  win = new BrowserWindow()
  win.loadFile('index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(async () => {
  // 这里是手动下载下来的 Vue DevTools 扩展的本地路径。
  const devToolsPath = path.join(__dirname, './6.6.1_0')

  try {
    await session.defaultSession.loadExtension(
      devToolsPath,
      // allowFileAccess is required to load the devtools extension on file:// URLs.
      { allowFileAccess: true }
    )
    console.log('Vue DevTools loaded successfully.')
  } catch (err) {
    console.error('Failed to load Vue DevTools:', err)
  }

  createWindow()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
