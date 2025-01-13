# [0040. 使用 MessagePort 实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1)

<!-- region:toc -->
- [1. 🔗 links](#1--links-27)
- [2. 💻 demo](#2--demo-16)
<!-- endregion:toc -->
- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
- 如何使用 MessagePort 来实现两个渲染进程之间的相互通信

## 1. 🔗 links

- https://www.electronjs.org/zh/docs/latest/tutorial/message-ports#%E5%9C%A8%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E5%BB%BA%E7%AB%8B-messagechannel
  - 官方文档，Electron 中的消息端口。
  - 查看官方文档对于「如何在两个渲染进程之间建立 MessageChannel」的相关说明。
- https://www.electronjs.org/zh/docs/latest/api/message-channel-main
  - 官方文档，查看主进程的 MessageChannelMain 模块的相关介绍。
- electron/0003
  - 这个是 MessagePort 性能测试案例。
  - 听说 MessagePort 这玩意儿性能还不错，没有实际测试过，工作上也基本上没用过，于是写了这个 demo。

## 2. 💻 demo

```js
// index.js
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
```


```js
// renderer1.js
const { ipcRenderer } = require('electron')

let electronMessagePort
ipcRenderer.on('port', e => {
  console.log('win1 ready-to-show')
  electronMessagePort = e.ports[0]
  document.getElementById('btn').addEventListener('click', _ => electronMessagePort.postMessage('你好 ～ 我是窗口 1'))
  electronMessagePort.onmessage = msg => console.log('【收到了窗口 2 的消息】', msg)
})
```


```js
// renderer2.js
const { ipcRenderer } = require('electron')

let electronMessagePort
ipcRenderer.on('port', e => {
  console.log('win2 ready-to-show')
  electronMessagePort = e.ports[0]
  document.getElementById('btn').addEventListener('click', _ => electronMessagePort.postMessage('你好 ～ 我是窗口 2'))
  electronMessagePort.onmessage = msg => console.log('【收到了窗口 1 的消息】', msg)
})
```

**最终效果**

![](md-imgs/2024-10-05-22-16-04.png)

![](md-imgs/2024-10-05-22-16-08.png)




