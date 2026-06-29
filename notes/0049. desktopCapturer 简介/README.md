# [0049. desktopCapturer 简介](https://github.com/tnotesjs/TNotes.electron/tree/main/notes/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B)

<!-- region:toc -->

- [1. desktopCapturer 相关链接](#1-desktopcapturer-相关链接)
- [2. desktopCapturer 是什么](#2-desktopcapturer-是什么)
- [3. desktopCapturer 的基本使用流程](#3-desktopcapturer-的基本使用流程)

<!-- endregion:toc -->

- desktopCapturer 是什么
- desktopCapturer 的基本使用流程
- desktopCapturer 这是主进程中的一个模块，是一个用于处理桌面视频流（你可以理解为就是你眼睛看到的显示屏上的画面数据）的 API。

## 1. desktopCapturer 相关链接

- https://www.electronjs.org/docs/latest/api/desktop-capturer
  - 查看主进程的 desktopCapturer 模块的相关描述。
- https://www.electronjs.org/zh/docs/latest/api/structures/desktop-capturer-source
  - 查看 DesktopCapturerSource 对象结构详情，desktopCapturer 的返回值类型是 `Promise<DesktopCapturerSource[]>`。

## 2. desktopCapturer 是什么

- Electron 的 desktopCapturer 模块允许开发者 **捕获应用所运行的操作系统的屏幕或单独窗口的视频流**。这个 API 是 **专为在 Electron 应用中捕获屏幕视频或截图而设计的**，非常适合开发需要 **屏幕分享、视频录制或截图功能** 的桌面应用。
- desktopCapturer 可以捕获 **整个屏幕** 或 **特定应用窗口** 的媒体。开发者可以指定捕获特定的屏幕或窗口，甚至是 **多个屏幕和窗口**。捕获的结果是一个 **视频流**，可以用于录制视频或实时屏幕分享。desktopCapturer 可以用于视频流捕获，也可以 **通过视频流帧获取截图**。

## 3. desktopCapturer 的基本使用流程

使用 `desktopCapturer` 模块通常包括以下步骤：

1. 调用 `desktopCapturer.getSources(options)` 方法获取源

- 在 options 可以指定捕获的类型 `types`（屏幕 `screen` 或窗口 `window`，`types: ['window', 'screen']）`。
- 返回值是一个 Promise，类型为 `Promise<DesktopCapturerSource[]>`，其中 DesktopCapturerSource 表示捕获到的源列表。

2. 从源列表 `DesktopCapturerSource[]` 中选择一个源

- 你可以根据需求选择一个或多个捕获源。每个源都是一个对象，其中起作用的是 `id` 字段，它是一个 window 或者 screen 的唯一标识，如果你是首次接触的话，可能会觉得格式长得有些奇怪 —— `window:XX:YY` 或者 `screen:ZZ:0`，这玩意儿是需要在下一步调用 `navigator.mediaDevices.getUserMedia()` 时传入的参数之一。
- 这里刻意强调 `id` 字段，是因为源对象里边还有一个容易混淆的 `display_id` 字段，在写的时候不要写混淆了。

```js
const { BrowserWindow, desktopCapturer } = require('electron')

const mainWindow = new BrowserWindow()

desktopCapturer
  .getSources({ types: ['window', 'screen'] })
  .then(async (sources) => {
    for (const source of sources) {
      if (source.name === 'Electron') {
        mainWindow.webContents.send('SET_SOURCE', source.id)
        return
      }
    }
  })
```

3. 获取媒体流

- 一旦选定了源，就可以使用标准的 Web 技术（如 `navigator.mediaDevices.getUserMedia`）来请求媒体流。

```js
// prealod script...
const { desktopCapturer } = require('electron')

async function captureScreen() {
  // 请求屏幕类型的源
  const inputSources = await desktopCapturer.getSources({ types: ['screen'] })

  try {
    // 请求一个不包含音频的视频流
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          // 从返回的源列表中选择第一个源（通常代表当前屏幕）
          chromeMediaSourceId: inputSources[0].id,
        },
      },
    })

    // 使用这个视频流
    // 该视频流可以用于进一步处理，如显示在页面上、录制或实时传输。
    // ……
  } catch (e) {
    console.error(e)
  }
}

captureScreen()
```
