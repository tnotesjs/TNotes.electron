const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow()
  win.loadFile('./index.html')
}

let tray
function createTrayMenu() {
  let trayIcon = nativeImage.createFromPath('./1.png')
  trayIcon = trayIcon.resize({ width: 22, height: 22 })

  tray = new Tray(trayIcon)

  tray.setToolTip('title')

  const trayMenu = Menu.buildFromTemplate([
    { label: 'Quit', click() { app.quit() } },
    { label: 'Foo' },
    { label: 'Bar' },
  ])
  tray.setContextMenu(trayMenu)
}

app.whenReady().then(() => {
  createWindow()
  createTrayMenu()
})
