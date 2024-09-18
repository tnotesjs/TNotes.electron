const { BrowserWindow, app, MessageChannelMain } = require('electron');

app.whenReady().then(async () => {
  const win1 = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })
  const win2 = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win1.webContents.openDevTools()
  win2.webContents.openDevTools()

  win1.loadFile('./index1.html')
  win2.loadFile('./index2.html')

  // 建立通道，当 webContents 准备就绪后，使用 postMessage 向每个 webContents 发送一个端口。
  const { port1, port2 } = new MessageChannelMain()
  win1.once('ready-to-show', _ => win1.webContents.postMessage('port', null, [port1]))
  win2.once('ready-to-show', _ => win2.webContents.postMessage('port', null, [port2]))
})