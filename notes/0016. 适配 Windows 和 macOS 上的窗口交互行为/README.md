# [0016. 适配 Windows 和 macOS 上的窗口交互行为](https://github.com/tnotesjs/TNotes.electron/tree/main/notes/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA)

<!-- region:toc -->

- [1. 官方文档 - 查看主进程的 app 模块上的 activate、window-all-closed 事件的相关描述](#1-官方文档---查看主进程的-app-模块上的-activatewindow-all-closed-事件的相关描述)
- [2. demos.1 - 适配 Windows 和 macOS 上的窗口交互行为](#2-demos1---适配-windows-和-macos-上的窗口交互行为)

<!-- endregion:toc -->

- 适配 Windows 和 macOS 上的窗口交互行为的处理逻辑很简单，重点在于理解两种系统中窗口交互的一些差异点。

## 1. 官方文档 - 查看主进程的 app 模块上的 activate、window-all-closed 事件的相关描述

- https://www.electronjs.org/zh/docs/latest/api/app#%E4%BA%8B%E4%BB%B6-activate-macos
- https://www.electronjs.org/zh/docs/latest/api/app#%E4%BA%8B%E4%BB%B6-window-all-closed
- 事件: 'activate'
  - 当应用被激活时触发。
- 事件: 'window-all-closed'
  - 当所有的窗口都被关闭时触发。
  - 如果你没有监听此事件并且所有窗口都关闭了，默认的行为是控制退出程序；但如果你监听了此事件，你可以控制是否退出程序。
- 在桌面端，macOS 和 Windows 有着特别多的操作差异性
  - 在窗口管理上，Windows 用户习惯使用最大化、最小化和关闭窗口的按钮，而 macOS 用户则通常使用（交通灯）红、黄、绿色的按钮分别表示关闭、最小化和全屏。
  - **在 macOS 中，即使所有窗口关闭了，应用仍然在底部的菜单栏中保持活动状态**。
  - **在其他平台（如 Windows 或 Linux）中，关闭最后一个窗口时，默认会退出应用程序**。
- 需要适配的整体行为：
  - 所有窗口关闭时：应用会在 **非 macOS 系统** 中退出。在 macOS 中，应用会保持后台运行，直到用户明确退出应用。
  - 应用被激活 `activate` 时：如果没有打开窗口（例如用户通过 Dock 或任务栏点击图标，但没有窗口打开），会自动调用 `createWindow()` 创建一个新的窗口。
    - 这是 macos 特有的事件

```js
// 当窗口都被关闭了
app.on('window-all-closed', () => {
  // 如果不是 macOS
  if (process.platform !== 'darwin') {
    // 应用退出
    app.quit()
  }
})

// macOS 特定行为：当没有窗口打开时点击应用图标打开新窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

- 在 Windows/Linux 上关闭所有窗口时应用退出。
- 在 macOS 上，应用会保持在后台运行，而不是完全退出。
  - 当用户点击应用图标时，即使没有窗口，应用也会创建一个新的窗口。

## 2. demos.1 - 适配 Windows 和 macOS 上的窗口交互行为

::: code-group

```js [index.js]
const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
  win = new BrowserWindow()

  win.loadFile('./index.html')

  // 当窗口关闭时清除 win 对象
  win.on('closed', () => (win = null))
}

app.on('window-all-closed', () => {
  // macOS 的常规行为是应用及其菜单栏继续激活，直到用户使用 Cmd + Q 明确退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow)

// macOS 特定行为：当没有窗口打开时点击应用图标打开新窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

:::
