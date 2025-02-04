// 主进程
const { ipcMain, app, BrowserWindow, MessageChannelMain } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.webContents.openDevTools()
  win.loadFile('./index.html')

  // #region 消息端口
  const { port1, port2 } = new MessageChannelMain()

  // 把其中一个端口丢给渲染进程
  win.once('ready-to-show', () => win.webContents.postMessage('port', null, [port1]))

  port2.on('message', ({ data }) => {
    console.count(`主进程收到了 message port 消息${data}`)
    port2.postMessage({ data: 'port2 response from main' })
  })
  port2.start()
  // #endregion 消息端口

  // #region invoke、handle
  ipcMain.handle('invoke', async (event, message) => {
    console.count(`主进程收到了 invoke 消息${message}`)
    return 'invoke response from main'
  })
  // #endregion invoke、handle
})
