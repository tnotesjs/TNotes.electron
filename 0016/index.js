const {app, BrowserWindow} = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow();

  win.loadFile('./index.html');

  // 当窗口关闭时清除 win 对象
  win.on('closed', () => win = null);
}

app.on('window-all-closed', () => {
  // macOS 的常规行为是应用及其菜单栏继续激活，直到用户使用 Cmd + Q 明确退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow);

// macOS 特定行为：当没有窗口打开时点击应用图标打开新窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});