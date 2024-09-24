# 0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信

通过对比 `ipcRenderer.send`、`ipcRenderer.sendSync` 来熟悉 `sendSync` API 的一些特点和基本用法。

# 流程图

![](https://cdn.nlark.com/yuque/0/2023/jpeg/2331396/1684643460959-290c8544-0a4f-4c0f-836f-b7935c297453.jpeg)

# 视频

- [yuque](https://www.yuque.com/huyouda/electron/ez22kko5wgrkwdw4)

# 源码

## package.json

```json
{
  "name": "sendsync-on",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "electron ."
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "electron": "^29.1.0"
  }
}
```

## index.html

```html
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

## renderer.js

```javascript
const {
  ipcRenderer
} = require('electron')

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

## index.js

```javascript
const {app, BrowserWindow, ipcMain} = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.webContents.openDevTools()

  win.loadFile("./index.html")
}

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

function handleIPC() {
  ipcMain.on('send-message', async (event, ...args) => {

    // 睡个 3s，渲染进程不会等。
    await sleep(3000)

    console.log('主进程收到了来自渲染进程的 ipcRenderer.send 方法发送的消息', ...args)

    const sum = args.reduce((a, b) => a + b, 0)

    event.reply('message-from-main', sum)
  })

  ipcMain.on('sendSync-message', async (event, ...args) => {

    // 睡个 3s，渲染进程会等。
    await sleep(3000)

    console.log('主进程收到了来自渲染进程的 ipcRenderer.sendSync 方法发送的消息', ...args)

    const sum = args.reduce((a, b) => a + b, 0)

    event.returnValue = sum
  })
}

app.on('ready', () => {
  createWindow()
  handleIPC()
})
```

# 最终效果

先点击 send 按钮，然后再点击 sendSync 按钮，最终结果如下。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/2331396/1709350161851-7bd266cd-f38d-49a5-b7b4-f68f61367a5a.png#averageHue=%23f2f2f2&clientId=u072e3cda-36b8-4&from=paste&height=246&id=u5a74b716&originHeight=492&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103767&status=done&style=stroke&taskId=u4519e20a-2695-42bf-9acb-73e5e236e56&title=&width=800)

```bash
主进程收到了来自渲染进程的 ipcRenderer.send 方法发送的消息 1 2 3
主进程收到了来自渲染进程的 ipcRenderer.sendSync 方法发送的消息 1 2 3
```

