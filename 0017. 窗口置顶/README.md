# [0017. 窗口置顶](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6)

<!-- region:toc -->
- [1. 📝 summary](#1--summary)
- [2. 🔗 links](#2--links)
- [3. 💻 demo](#3--demo)
<!-- endregion:toc -->
## 1. 📝 summary

- 本文介绍了两种使窗口置顶的方式，以及它们之间的一些区别。
- 做法 1：在 new BrowserWindow 的时候，丢一个配置项 `alwaysOnTop: true` 进去，暴力置顶。
- 做法 2：通过 BrowserWindow 实例 win 的 `setAlwaysOnTop` 方法实现置顶，可以进行更细粒度的控制置顶的层级。

## 2. 🔗 links

- https://www.electronjs.org/zh/docs/latest/api/browser-window#winsetalwaysontopflag-level-relativelevel
  - 官方文档，查看 API `win.setAlwaysOnTop(flag[, level][, relativeLevel])` 的相关描述。

## 3. 💻 demo

```js
// index.js
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win1 = new BrowserWindow({ alwaysOnTop: true })
  win1.loadFile('./index1.html')

  const win2 = new BrowserWindow()
  win2.loadFile('./index2.html')

  // 使用 win.setAlwaysOnTop 可以实现更细粒度的层级控制。
  // 例如，可以将窗口设置为 'pop-up-menu' 层级，这样它就不会被任务栏遮挡。
  win2.setAlwaysOnTop(true, 'pop-up-menu')
})
```

**最终效果**

![](md-imgs/2024-10-06-00-49-26.png)

- 一共两个窗口，一个使用 API win.setAlwaysOnTop 实现置顶，一个使用配置项 alwaysOnTop 实现置顶。
  - 前者 win.setAlwaysOnTop 可以实现更细粒度的配置，比如可以让窗口位于 macos 的 Dock 栏之上显示。
  - 后者 alwaysOnTop 配置的置顶效果虽然可以位于其他窗口之上显示，但是它默认会在 Dock 之下显示，如果想要让窗口位于 Dock 之上显示，将无法通过这个配置项来解决。
