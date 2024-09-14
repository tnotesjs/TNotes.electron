// 原理：
// 1、普通模式下：先利用transparent创建透明的、全屏的、置顶的窗口，加载页面，页面中利用navigator.mediaDevices.getUserMedia获取整个屏幕截图，然后在屏幕截图上再canvas；
// 2、因为Windows的基本主题和高对比度主题不支持transparent，处理方式为：先利用opacity创建完全透明的窗口，
// 再截取整个屏幕，然后再将窗口调至不透明，然后再canvas；
// 提示：
// 1、普通模式下也可以利用第2种方法，但是截取整个屏幕中间会闪一下（因为先加载不透明的窗口，会显示黑色，然后窗口再加载半透明的图片），效果不好，所以没采用；
// 2、基本主题和高对比度主题下，如果不按照第2种方法，截取的整个屏幕会是透明的，导致canvas后的结果也是透明的；

// 问题：
// 1. 截图延迟
//     - 由于截图目前有一定时间的延迟，所以对截图技术进行了一天左右时间的调研。截图目前采用的技术是navigator.mediaDevices.getUserMedia
//     - 因为有一定时间的延迟，所以我尝试了其他的一些方案，但是都不理想，延迟和现有技术差别不大，如需改进，可能要尝试客户端开发等技术：
//         1. 利用先创ctron的desktopCapturer.getSources
//         3. 利用electron的capturePage，有bug
//         4. Mac利建截图窗口，再隐藏窗口，而不是每次截图都新建窗口
//         2. Mac利用原生命令行screencapture，Windows和Linux有相应的程序包。Mac截图可以利用原生的快捷键command+shift+4，截取的图片在桌面上
// 2. Linux只支持单屏幕截图。由于Chrome内核的原因，Linux系统无法区分多个屏幕，它所有的屏幕ID都是0:0，不像windows和Mac。参考：https://github.com/electron/electron/issues/21321
// 3. 高版本electron获取的是黑屏的问题，参考https://github.com/electron/electron/issues/21063


// 截图
import path from 'path';

import {
  BrowserWindow,
  ipcMain,
  globalShortcut,
  systemPreferences,
  screen
} from 'electron';

require('@electron/remote/main').initialize();

const isDev = process.env.NODE_ENV === 'development';

let mainWindows = [];
let homeWindow = null;
let iswin32 = process.platform == 'win32';
global.isAero = false;

const winURL = `file://${path.resolve(__static, './capture.html')}`;

// 截图时隐藏IM窗口
let isCutHideWindows = false;

// 截图快捷键
if (iswin32) {
  // 因为Windows的基本主题和高对比度主题对transparent: true的兼容问题，这里区分Windows系统的主题，根据不同的主题设置不同的方案
  global.isAero = systemPreferences.isAeroGlassEnabled();
}
// 退出快捷键
let quitKey = 'Esc';

// 创建窗口
function createWindow() {
  // 获取屏幕数
  let displays = screen.getAllDisplays();
  
  mainWindows = displays.map(display => {
    let winOption = {
      fullscreen: iswin32 || undefined,
      width: display.bounds.width,
      height: display.bounds.height,
      x: display.bounds.x,
      y: display.bounds.y,
      frame: false,
      transparent: true,
      movable: false,
      resizable: false,
      hasShadow: false,
      enableLargerThanScreen: true,
      webPreferences: {
        // 允许打开调试窗口
        devTools: isDev,
        // 允许html中运行nodejs
        nodeIntegration: true,
        sandbox: false,
        webviewTag: true,
        webSecurity: false,
        backgroundThrottling: false,
        contextIsolation: false,
        spellcheck: false,
      }
    }
    
    // 对Windows的基本主题和高对比度主题单独处理，因为它不支持transparent
    if (iswin32 && !global.isAero) {
      winOption.opacity = 0.0;
    }
    
    let mainWindow = new BrowserWindow(winOption);
    require('@electron/remote/main').enable(mainWindow.webContents);
    
    // 打开开发者工具
    isDev && mainWindow.webContents.openDevTools();
    
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setSkipTaskbar(true);
    mainWindow.loadURL(winURL);
    return mainWindow;
  });
}


// 退出截图快捷键
function quitCutFun() {
  globalShortcut.register(quitKey, () => {
    windowEdit('quit');
  });
}


// 窗口编辑
function windowEdit(type) {
  if (mainWindows) {
    mainWindows.forEach(win => {
      if (win) {
        win.webContents.send('capture-finish');
        
        // 取消截图（按ESC键）或者截图完成后（如保存，取消，保存至剪切板）恢复聊天窗口
        if (isCutHideWindows) {
            homeWindow.show();
        }
        
        if (type == 'quit') {
          win.destroy();
        } else if (type == 'hide') {
          win.hide();
        }
      }
    });
    mainWindows = [];
  }
  // 注销退出截图快捷键
  globalShortcut.unregister(quitKey);
}


// cutWindow
function cutWindow(window) {
  homeWindow = window;
  quitCutFun();
  
  // 和渲染进程通讯
  ipcMain.on('window-edit', (event, type) => {
    windowEdit(type);
  });
  // 点击截图按钮截图
  ipcMain.on('cut-screen', () => {
    console.log(__static);
    createWindow();
  });
}

export default cutWindow;