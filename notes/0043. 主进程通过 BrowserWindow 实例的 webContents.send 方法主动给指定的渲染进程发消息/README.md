# [0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息](https://github.com/tnotesjs/TNotes.electron/tree/main/notes/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 demos.1 - 主进程通过 BrowserWindow 实例的 `webContents.send` 方法主动给指定的渲染进程发消息](#2--demos1---主进程通过-browserwindow-实例的-webcontentssend-方法主动给指定的渲染进程发消息)

<!-- endregion:toc -->

## 1. 📝 概述

- 主进程 -> 渲染进程
  - 主进程：`webContents.send`
  - 渲染进程：`ipcRenderer.on`

## 2. 💻 demos.1 - 主进程通过 BrowserWindow 实例的 `webContents.send` 方法主动给指定的渲染进程发消息

::: code-group

```js [renderer.js] {2}
const { ipcRenderer } = require('electron')
ipcRenderer.on('msg-from-main-process', (_, ...args) => {
  console.log('renderer-process-received-msg-from-main-process')
  console.log(args)
})
```

```js [index.js] {15}
const { app, BrowserWindow, ipcMain } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  })

  win.webContents.openDevTools()

  win.loadFile('./index.html')
}

function handleIPC() {
  win.webContents.send('msg-from-main-process', 1, 2, 3)
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})
```

:::

- **最终效果**
  - 在主进程中找到需要与之通信的那个渲染进程（可以理解为 BrowserWindow 实例），通过 BrowserWindow 实例的 `webContents.send` 方法主动给指定的渲染进程发消息。实现从主进程到渲染进程的单向通信。
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-05-03-11-11-32.png)
