const { app, BrowserWindow } = require('electron')
const {
  default: installExtension,
  // VUEJS_DEVTOOLS,
  VUEJS3_DEVTOOLS
} = require('electron-devtools-installer')

let win
function createWindow() {
  win = new BrowserWindow()
  win.loadFile('./index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  installExtension(VUEJS3_DEVTOOLS)
    .then((name) => {
      console.log(`Added Extension:  ${name}`)
      createWindow()
    })
    .catch((err) => console.log('An error occurred: ', err))
})