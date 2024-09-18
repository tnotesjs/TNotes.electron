const {app, BrowserWindow, Menu} = require('electron')

let win
function createWindow() {
  win = new BrowserWindow()
  win.loadFile("./index.html")
}

function createMenu() {
  const template = [
    { label: '菜单一', submenu: [ { label: '功能一' }, { label: '功能二' } ] },
    { label: '菜单二', submenu: [ { label: '功能一' }, { label: '功能二' } ] }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
  createWindow()
  createMenu()
})