const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        // opacity: 0.88, // 设置窗口透明度
        resizable: true,
        frame: false, // 隐藏窗口默认的边框
        titleBarStyle: 'hidden', // 隐藏默认标题栏，使窗口可以被拖拽
        menuBarVisible: false, // 隐藏菜单栏

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    win.loadFile(path.resolve(__dirname, './index.html'))

    win.setAlwaysOnTop(true, 'pop-up-menu') // 设置窗口置顶
}

app.whenReady().then(createWindow)
