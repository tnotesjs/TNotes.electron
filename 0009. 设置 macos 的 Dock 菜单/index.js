const { app, BrowserWindow, Menu } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow()
  win.loadFile('./index.html')
}

function createDockMenu() {
  const dockTempalte = [
    {
      label: '菜单一',
      click() {
        console.log('New Window')
      },
    },
    {
      label: '菜单二',
      submenu: [{ label: 'Foo' }, { label: 'Bar' }],
    },
    {
      label: '其他...',
    },
  ]

  const dockMenu = Menu.buildFromTemplate(dockTempalte)
  app.dock.setMenu(dockMenu)
}

app.whenReady().then(() => {
  // createWindow()
  createDockMenu()
})
