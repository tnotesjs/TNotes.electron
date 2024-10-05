# 0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息

## 💻 demo

```js
// renderer.js
const { ipcRenderer } = require('electron')
ipcRenderer.on('msg-from-main-process', (_, ...args) => {
  console.log('renderer-process-received-msg-from-main-process')
  console.log(args)
})
```

```js
// index.js
const {app, BrowserWindow, ipcMain} = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.webContents.openDevTools()

  win.loadFile("./index.html")
}

function handleIPC() {
  win.webContents.send('msg-from-main-process', 1, 2, 3)
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})
```

**最终效果**

在主进程中找到需要与之通信的那个渲染进程（可以理解为 BrowserWindow 实例），通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息。实现从主进程到渲染进程的单向通信。

![](md-imgs/2024-10-05-20-03-43.png)
