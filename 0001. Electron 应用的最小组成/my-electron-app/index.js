const { app, BrowserWindow } = require('electron')

function createWindow () {
  // 创建浏览器窗口
  const win = new BrowserWindow()

  // 加载应用的 index.html
  win.loadFile('index.html')
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow()
})