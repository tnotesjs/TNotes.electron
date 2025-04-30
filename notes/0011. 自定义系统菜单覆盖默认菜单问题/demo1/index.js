const { app, BrowserWindow, ipcMain, Menu } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow()
  win.loadFile('./index.html')
}

function createMenu() {
  const template = [
    { label: '菜单一', submenu: [{ label: '功能一' }, { label: '功能二' }] },
    { label: '菜单二', submenu: [{ label: '功能一' }, { label: '功能二' }] },
    {
      label: 'View',
      submenu: [
        {
          label: '切换开发者工具',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: (_, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools()
            }
          },
        },
      ]
    },
  ]

  // 对 macos 特殊处理
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: '功能一' },
        { label: '功能二' },
        {
          label: 'Quit',
          click() {
            app.quit()
          },
        },
        { label: '功能……' },
      ],
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  createWindow()
  createMenu()
})