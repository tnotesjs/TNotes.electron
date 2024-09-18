const { BrowserWindow, app } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    width: 500, height: 300,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 12 },
  })
  win.loadFile('./index.html')
}

app.whenReady().then(createWindow)