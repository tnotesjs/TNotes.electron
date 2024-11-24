# [0036. 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1)

- 渲染进程通过 ipcRenderer.invoke 给主进程发送消息，可以通过 await 来等待主进程响应，并获取到主进程的处理结果。主进程通过 ipcMain.handle 来接受来自渲染进程的消息，通过 return xxx 的写法给渲染进程响应处理结果。以此来实现从渲染进程到主进程的双向通信。
- 本文介绍的这种通信方式，是官方推荐的做法，也是目前比较主流的写法。

## 💻 demo

```js
// renderer.js
const { ipcRenderer } = require('electron')

// 单向（请求）
btn1.onclick = () => {
  ipcRenderer.invoke('invoke-message1', 1, 2, 3)
}

// 双向（请求 + 响应）
btn2.onclick = async () => {
  const res = await ipcRenderer.invoke('invoke-message2', 4, 5, 6)
  console.log('ipcRenderer.invoke 方法收到的返回结果：', res)
}
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
  ipcMain.handle('invoke-message1', (_, ...args) => {
    console.log('invoke-message1', ...args)
  })

  ipcMain.handle('invoke-message2', (_, ...args) => {
    console.log('invoke-message2', ...args)
    return args.reduce((a, b) => a + b, 0)
  })
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})
```

**最终效果**

![](md-imgs/2024-10-05-20-18-59.png)

```bash
# 主进程日志
invoke-message1 1 2 3
invoke-message2 4 5 6
```