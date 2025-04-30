const {app, BrowserWindow, ipcMain, Menu} = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.webContents.openDevTools()

  win.loadFile("./index.html")
}

function handleIPC() {
  ipcMain.handle('show-context-menu', (event) => {
    const template = [
      {
        label: '菜单一',
        click: () => {
          // 发送点击菜单一事件到渲染进程
          event.sender.send('context-menu-command', 'menu-item-1')
        }
      },
      // 表示菜单分割线。
      { type: 'separator' },
      {
        label: '菜单二',
        type: 'checkbox',
        checked: true
      }
    ]

    // 根据模板创建菜单
    const menu = Menu.buildFromTemplate(template)
    // menu.popup 方法使菜单在指定窗口中弹出。
    menu.popup({
      // BrowserWindow.fromWebContents 返回拥有给定 webContents 的窗口实例（BrowserWindow 类型）
      // 这里其实也可以不需要指定 window 参数，因为默认情况下 window 表示的是当前活动窗口（也就是你正在操作的窗口）。
      window: BrowserWindow.fromWebContents(event.sender)
    })
  })
}

app.whenReady().then(() => {
  createWindow()
  handleIPC()
})