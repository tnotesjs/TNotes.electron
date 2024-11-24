# [0021. 使用 clipboard 模块向系统剪切板中读写文本](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC)

- 该笔记 clipboard 基本使用
- clipboard 是一个很常用也狠使用的模块，用于读写系统的剪切板。这篇文档介绍它的基本使用，实现剪切板的读写操作。

## 🔗 links

- https://www.electronjs.org/zh/docs/latest/api/clipboard
  - 官方文档，查看主进程和渲染进程共享的 clipboard 模块的相关内容。

## 💻 demo

```js
// index.js
const { clipboard, app, BrowserWindow, ipcMain } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  })

  win.loadFile('./index.html')
}

function handleIPC() {
  ipcMain.handle('write-text', (_, text) => clipboard.writeText(text))
  ipcMain.handle('read-text', _ => clipboard.readText())
}


app.on('ready', () => {
  createWindow()
  handleIPC()
})
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>clipboard</title>
  </head>
  <body>
    <h1>使用 clipboard 模块向系统剪切板中读写文本</h1>

    <button id="btn1">1. 将 hello world 写入到剪切板中</button>
    <button id="btn2">2. 将剪切板中的内容复制到以下文本框中</button>

    <p>
      <textarea id="textarea" name="" id="" cols="30" rows="10"></textarea>
    </p>

    <script src="renderer.js"></script>
  </body>
</html>
```

```js
// renderer.js
const { ipcRenderer } = require('electron')

const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')
const textarea = document.getElementById('textarea')

btn1.addEventListener('click', _ => ipcRenderer.invoke('write-text', 'hello world'))
btn2.addEventListener('click', async _ => {
  textarea.value = await ipcRenderer.invoke('read-text')
})
```

clipboard 是主进程和渲染进程共享的模块，在 renderer.js 中可以直接引入 clipboard 模块来使用，并不需要使用 IPC 通信。当然，前提是关闭 contextIsolation 才行。

**最终效果**

- 先点击按钮1，会将 hello wolrd 丢到系统剪切板中。
- 再点击按钮2，会将剪切板中的内容复制到下面的文本框中。

![](md-imgs/2024-10-07-22-14-23.png)