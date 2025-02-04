# [0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD)

<!-- region:toc -->


- [bilibili.electron.0003.1](https://www.bilibili.com/video/BV1CBFyeREWg)
- [1. 📺 视频](#1--视频)
- [2. 💻 demos.1 - MessageChannel vs. ipcRenderer.invoke、ipcMain.handle](#2--demos1---messagechannel-vs-ipcrendererinvokeipcmainhandle)
<!-- endregion:toc -->
- 本文通过一个 Electron 应用示例对比了 `MessageChannel` 和 `ipcRenderer.invoke`/`ipcMain.handle` 两种 IPC 通信方式的性能差异。

## 1. 📺 视频

<BilibiliOutsidePlayer id="BV1CBFyeREWg" />

## 2. 💻 demos.1 - MessageChannel vs. ipcRenderer.invoke、ipcMain.handle

- **先说结论**
  - 单向通信：两者差异不大
  - 双向通信：`MessageChannel` 的性能明显优于 `ipcRenderer.invoke`，MessageChannel 比 invoke 快了 3～5 倍。
    - 如果有短时间内多次在主进程和渲染进程之间互相通信的情况，可以优先考虑使用消息端口的方式来跑。
- 该 demo 仅仅作为一个参考，实际需求往往会更加复杂，比如通信过程中会携带大量数据。本 demo 的测试用例比较简单，仅仅是传递一个写死的字符串。

::: code-group

```js [index.js]
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
  // port2.start() 这一步别忘了，否则消息端口将无法正常接收消息。
  port2.start()
  // #endregion 消息端口



  // #region invoke、handle
  ipcMain.handle('invoke', async (event, message) => {
    console.count(`主进程收到了 invoke 消息${message}`)
    return 'invoke response from main'
  })
  // #endregion invoke、handle
})
```



```html [index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
  </head>
  <body>
    <button id="btn1">testInvoke_1</button>
    <button id="btn2">testMessageChannel_1</button>
    <button id="btn3">testInvoke_2</button>
    <button id="btn4">testMessageChannel_2</button>

    <script src="./renderer.js"></script>
  </body>
</html>
```


```js [renderer.js]
const { ipcRenderer } = require('electron')

let port1
ipcRenderer.on('port', (e) => {
  port1 = e.ports[0]
  console.log('渲染进程收到了来自主进程的消息端口', port1)
})

function testInvoke_1() {
  const startTime = Date.now()
  for (let i = 0; i < 10000; i++) {
    ipcRenderer.invoke('invoke', 'Message from renderer')
  }
  const endTime = Date.now()
  console.log('测试用例 1：使用 ipcRenderer.invoke 和 ipcMain.handle【单向】', endTime - startTime)
}

function testMessageChannel_1() {
  const startTime = Date.now()
  for (let i = 0; i < 10000; i++) {
    port1.postMessage('Message from renderer')
  }
  const endTime = Date.now()
  console.log('测试用例 2：使用 MessageChannel【单向】', endTime - startTime)
}

async function testInvoke_2() {
  const startTime = Date.now()
  for (let i = 0; i < 10000; i++) {
    const res = await ipcRenderer.invoke('invoke', 'Message from renderer')
    // console.log(res)
  }
  const endTime = Date.now()
  console.log('测试用例 3：使用 ipcRenderer.invoke 和 ipcMain.handle【双向】', endTime - startTime)
}

function testMessageChannel_2() {
  const startTime = Date.now()
  let messagesReceived = 0

  for (let i = 0; i < 10000; i++) {
    port1.postMessage('Message from renderer')
  }

  port1.onmessage = ({ data: { data }}) => {
    // console.log(data)
    messagesReceived++

    if (messagesReceived === 10000) {
      const endTime = Date.now()
      console.log('测试用例 4：使用 MessageChannel【双向】', endTime - startTime)
    }
  }
}

document.getElementById('btn1').addEventListener('click', testInvoke_1)
document.getElementById('btn2').addEventListener('click', testMessageChannel_1)
document.getElementById('btn3').addEventListener('click', testInvoke_2)
document.getElementById('btn4').addEventListener('click', testMessageChannel_2)
```

:::
