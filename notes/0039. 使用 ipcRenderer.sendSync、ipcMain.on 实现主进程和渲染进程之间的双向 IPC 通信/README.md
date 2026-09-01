# [0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/tnotesjs/TNotes.electron/tree/main/notes/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1)

<!-- region:toc -->

::: details 📚 相关资源

- [📺 bilibili（笔记视频资源）](https://space.bilibili.com/407241004)
  - [bilibili.TNotes.electron.0039.1](https://www.bilibili.com/video/BV1CBFyeREu6)

:::

- [1. 概述](#1-概述)
- [2. demos.1 - 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](#2-demos1---使用-ipcrenderersendsyncipcmainon-实现主进程和渲染进程之间的双向-ipc-通信)

<!-- endregion:toc -->

## 1. 概述

<BilibiliVideo id="BV1CBFyeREu6" />

- 主进程 <-> 渲染进程
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-05-03-11-18-08.png)
- 本文档通过对比 `ipcRenderer.send`、`ipcRenderer.sendSync` 这两种通信方法，简单介绍了有关 `ipcRenderer.sendSync` API 的一些特点和基本用法。
- 注意：
  - `ipcRenderer.sendSync` 非必要，不建议使用。

## 2. demos.1 - 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信

- **源码实现**

::: code-group

```html [index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>24.03.02</title>
  </head>

  <body>
    <h1>renderer process</h1>
    <button id="btn1">send</button>
    <button id="btn2">sendSync</button>
    <script src="renderer.js"></script>
  </body>
</html>
```

```javascript [renderer.js] {5,11,18}
const { ipcRenderer } = require('electron')

btn1.onclick = () => {
  // ipcRenderer.send 是异步的，之后的输出语句会立即打印。
  const res = ipcRenderer.send('send-message', 1, 2, 3)

  console.log('ipcRenderer.send 方法收到的返回结果：')
  console.log(res) // => undefined
}

ipcRenderer.on('message-from-main', (_, res) => {
  console.log('receive message from main process')
  console.log(res) // => 6
})

btn2.onclick = () => {
  // ipcRenderer.sendSync 是同步的，会阻塞程序的执行，等主进行处理完任务之后，才会继续往下执行。
  const res = ipcRenderer.sendSync('sendSync-message', 1, 2, 3)

  console.log('收到了主进程的消息 event.returnValue:')
  console.log(res) // => 6
}
```

```javascript [index.js] {18,29,32,43}
const { app, BrowserWindow, ipcMain } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  })

  win.webContents.openDevTools()

  win.loadFile('./index.html')
}

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

function handleIPC() {
  ipcMain.on('send-message', async (event, ...args) => {
    // 睡个 3s，渲染进程不会等。
    await sleep(3000)

    console.log(
      '主进程收到了来自渲染进程的 ipcRenderer.send 方法发送的消息',
      ...args,
    )

    const sum = args.reduce((a, b) => a + b, 0)

    event.reply('message-from-main', sum)
  })

  ipcMain.on('sendSync-message', async (event, ...args) => {
    // 睡个 3s，渲染进程会等。
    await sleep(3000)

    console.log(
      '主进程收到了来自渲染进程的 ipcRenderer.sendSync 方法发送的消息',
      ...args,
    )

    const sum = args.reduce((a, b) => a + b, 0)

    event.returnValue = sum
  })
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})
```

:::

- **最终效果**
  - 先点击 send 按钮，然后再点击 sendSync 按钮，最终结果如下。
  - ![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-05-07-19-09-34.png)
- 主进程日志

```bash
主进程收到了来自渲染进程的 ipcRenderer.send 方法发送的消息 1 2 3
主进程收到了来自渲染进程的 ipcRenderer.sendSync 方法发送的消息 1 2 3
```
