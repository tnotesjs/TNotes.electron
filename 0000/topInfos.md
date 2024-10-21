### [0001. Electron 应用的最小组成](../0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0001
- 📝 summary
  - 实现一个 demo - 从 0 到 1 搭建一个 hello world 应用
    - 知道 Electron 应用的最小组成，要求能够做到快速搭建一个简单的 Electron 学习环境，全程耗时控制在 1min ~ 3min（不算下载依赖耗时）实现一个小 demo，为接下来的 Electron 相关知识点的学习做准备。
  - 本节内容，主要就是仨文件：
    - package.json 指定入口
    - index.js 主进程
    - index.html 渲染进程（非必需）


<!-- ====================>分隔符<==================== -->
### [0002. 使用 contextBridge 暴露 API 给渲染进程](../0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B) -->

- 📝 summary
  - 学会在开启 `contextIsolation` 的情况下，使用 `contextBridge` 来给渲染进程暴露 Electron API，使用系统的原生能力。


<!-- ====================>分隔符<==================== -->
### [0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能](../0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0003
- 📝 summary
  - 本文通过一个 Electron 应用示例对比了 `MessageChannel` 和 `ipcRenderer.invoke`/`ipcMain.handle` 两种 IPC 通信方式的性能，结果显示在单向通信中两者差异不大，但在双向通信中 `MessageChannel` 的性能明显优于 `ipcRenderer.invoke`。

<!-- ====================>分隔符<==================== -->
### [0004. 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信](../0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1) -->

- 📝 summary
  - 介绍如何使用 web api 来实现 IPC 通信


<!-- ====================>分隔符<==================== -->
### [0005. 使用 electron-devtools-installer 安装 vue-devtools](../0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools) -->

- 📝 summary
  - 按照官方提供的示例试了一下，最终结果是：**没能安装成功**。
  - 如果不是自己写的测试用例有误，那就是 electron-devtools-installer 这个包过时了。


<!-- ====================>分隔符<==================== -->
### [0006. 使用 vue-remote-devtools](../0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0006
- 📝 summary
  - 介绍 vue-remote-devtools 的基本使用
  - 本文介绍如何让基于 Electron 搭建的 Vue 工程，能够远程地使用 Vue 调试工具。本节介绍的其实是一个通用的法子，那些在非浏览器环境下搭建的 Vue 工程，如果想要使用 vue-devtools 的能力，都可以参考文中提到的这种方式。
  - 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。


<!-- ====================>分隔符<==================== -->
### [0007. 使用手动安装的方式集成 vue-devtools](../0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools) -->

- 📝 summary
  - 如何通过 session 模块在 Electron 工程中集成 vue-devtools


<!-- ====================>分隔符<==================== -->
### [0008. 使用自动安装的方式集成 vue-devtools](../0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools) -->

- 📝 summary
  - 如何根据插件 ID 自动下载 chrome 插件源码 `downloadChromeExtension.js`
  - 本文基于 electron-devtools-installer 中的下载 chrome 插件的逻辑，封装了一个 downloadChromeExtension.js 模块，在 electron.0007 的基础上，实现自动安装插件的功能。
  - 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。


<!-- ====================>分隔符<==================== -->
### [0009. 设置 macos 的 Dock 菜单](../0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95) -->

- 📝 summary
  - 如何通过 Menu 模块来创建 macos 上的 Dock 菜单


<!-- ====================>分隔符<==================== -->
### [0010. macos 应用菜单第一项的问题](../0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0010
- 📝 summary
  - macos 应用菜单第一项的有什么问题【demo1】
  - 如何解决 macos 应用菜单第一项的有什么问题【demo2】


<!-- ====================>分隔符<==================== -->
### [0011. 自定义系统菜单覆盖默认菜单问题](../0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98) -->

- 📝 summary
  - 自定义系统菜单和默认菜单的冲突问题是什么
  - 如何解决冲突问题


<!-- ====================>分隔符<==================== -->
### [0012. 使用 Menu 模块实现页面中的右键菜单](../0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95) -->

- 📝 summary
  - 在页面上创建右键菜单，这是桌面端应用中很常见的一个功能点。本文的介绍了如何使用 Menu 模块来创建一个右键菜单。


<!-- ====================>分隔符<==================== -->
### [0013. 基于 BrowserView 实现插件化能力](../0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0013
- 📝 summary
  - 基于 BrowserView 实现插件化能力
  - 该 demo 模拟了使用 BrowserView 模块来加载第三方资源并注入 preload 脚本，使其具备原生能力。


<!-- ====================>分隔符<==================== -->
### [0014. 使用 BrowserView 加载外部资源](../0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0014
- 📝 summary
  - 如何使用 BrowserView 加载外部资源
  - 这个 demo 使用 BrowserView 模块来加载第三方资源（掘金主页）到渲染进程的页面上。
- ⏰ todos
  - 注意，最新版的 Electron，已经将 BrowserView 这个 API 被标注为 Deprecated。这个稍微注意下，找时间看看是啥情况，为啥 BrowserView 被废弃掉了。


<!-- ====================>分隔符<==================== -->
### [0015. 窗口白屏问题 -- 等 ready-to-show 事件触发后再显示窗口](../0015.%20%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98%20--%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98%20--%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3) -->

- 📝 summary
  - 白屏问题是很经典的一个常见问题，处理方案：
    - 优先展示主题色的全屏背景
    - 使用骨架屏
    - 等一切就绪再 show【本文介绍的方法】


<!-- ====================>分隔符<==================== -->
### [0016. 适配 Windows 和 macOS 上的窗口交互行为](../0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA) -->

- 📝 summary
  - 理解 Windows 和 macOS 的桌面应用，在窗口交互行为上的一些差异。
  - 处理逻辑很简单，重点在于理解两种系统中窗口交互的一些差异点。


<!-- ====================>分隔符<==================== -->
### [0017. 窗口置顶](../0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6) -->

- 📝 summary
  - 本文介绍了两种使窗口置顶的方式，以及它们之间的一些区别。
  - 有哪些做法可以实现窗口置顶
  - 这些做法之间的区别是什么


<!-- ====================>分隔符<==================== -->
### [0018. 创建一个无边框窗口](../0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3) -->

- 📝 summary
  - 创建无边框窗口 frame: false
  - 无边框窗口的特点


<!-- ====================>分隔符<==================== -->
### [0019. 让无边框的窗口可以被拖拽](../0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD) -->

- 📝 summary
  - 通过 css 来解决无边框的窗口的拖拽问题


<!-- ====================>分隔符<==================== -->
### [0020. macos 隐藏窗口标题栏但是不隐藏交通灯](../0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF) -->

- 📝 summary
  - 只需要调整 BrowserWindow 的配置即可实现在 macos 中隐藏窗口标题栏但是不隐藏交通灯，并且可以微调交通灯的位置。


<!-- ====================>分隔符<==================== -->
### [0021. 使用 clipboard 模块向系统剪切板中读写文本](../0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC) -->

- 📝 summary
  - 该笔记 clipboard 基本使用
  - clipboard 是一个很常用也狠使用的模块，用于读写系统的剪切板。这篇文档介绍它的基本使用，实现剪切板的读写操作。


<!-- ====================>分隔符<==================== -->
### [0022. 全局级别的快捷键](../0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE) -->

- 📝 summary
  - 如何注册全局（系统）级别的快捷方式


<!-- ====================>分隔符<==================== -->
### [0023. 页面级别的快捷键](../0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE) -->

- 📝 summary
  - 一个很简单的 demo，介绍如何实现页面级别的快捷方式。


<!-- ====================>分隔符<==================== -->
### [0024. 通过 app 模块获取应用相关路径](../0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84) -->

- 📝 summary
  - `app.getPath(name)` 的基本使用
  - 本文介绍了通过 app 模块中的 app.getPath 方法来获取应用程序的相关路径。其中很多路径在都是很重要的，不要再使用 nodejs 去组装这些路径信息了，现尝试到 app.getPath 中找找看有没有现成的。


<!-- ====================>分隔符<==================== -->
### [0025. 创建 macos 应用托盘（Tray）](../0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89) -->

- 📝 summary
  - 如何创建托盘 Tray 菜单


<!-- ====================>分隔符<==================== -->
### [0026. 使用 Notification 模块弹出系统消息](../0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF) -->

- 📝 summary
  - 如何使用 Notification 弹出系统通知
  - 这个 demo 使用 electron 的内置模块 Notification 实现了一个简单的 demo，最终效果仅仅是将系统消息给展示出来，没有加其它多余的交互逻辑。


<!-- ====================>分隔符<==================== -->
### [0027. 原生文件拖 & 放](../0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0027
- 📝 summary
  - 原生文件拖 & 放是什么
  - 如何实现原生文件拖 & 放效果
    - 从视频的 0:50～2:30 开始展示最终的效果，可以从这开始看，快速了解下本节要实现的效果。
- ⏰ todos
  - 视频重录，把狗子替换为 week。


<!-- ====================>分隔符<==================== -->
### [0028. 模拟截图功能](../0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD) -->

- 📝 summary
  - 使用 Electron 并结合传统的前端技术来实现一个截图应用
  - 这篇文档是作者 [mowuu](https://github.com/muwoo) 使用 Electron 内置模块结合前端技术 canvas 写的一个截图工具示例。
  - demo 的核心逻辑简单了解了个大概，屏幕数据的获取使用的是 desktopCapture，页面上的图像最终是使用 canvas 来绘制的。实测在高分辨率的设备下截图效果异常模糊，几乎处于不可用的状态。
  - 临时结论：使用 Electron 内置的原生模块来模拟截图效果，可以说几乎是不可用的。后续找时间去 github 搜一下看看其它解决方案。


<!-- ====================>分隔符<==================== -->
### [0029. 实现屏幕监听功能](../0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD) -->

- 📝 summary
  - 这是参照官方示例实现一个屏幕实时监听的 demo。


<!-- ====================>分隔符<==================== -->
### [0030. 使用 electron-icon-builder、electron-builder 解决应用打包后的图标问题](../0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98) -->

- 📝 summary
  - 使用 electron-icon-builder 处理应用图标
  - 使用 electron-builder 出包


<!-- ====================>分隔符<==================== -->
### [0031. 使用 electron-reload 实现热更](../0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4) -->

- 📝 summary
  - 如何使用 electron-reload 实现热更
  - 使用 electron-reload 监听主进程和渲染进程内容的变更，一旦内容变化，就自动重启 electron。
  - 额，这功能确实有点儿用，不过感觉也是可有可无，因为手动启动的成本也不算太高。


<!-- ====================>分隔符<==================== -->
### [0032. 实现一个桌面时钟](../0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F) -->

- 📝 summary
  - 手写一个简单的桌面时钟摆件
  - 最终效果：
  - ![](md-imgs/2024-10-13-21-41-11.png)


<!-- ====================>分隔符<==================== -->
### [0033. ScreenCaptureApp](../0033.%20ScreenCaptureApp/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0033.%20ScreenCaptureApp) -->

- 📝 summary
  - demo - 自动截图程序
  - 目前在测试 nodejs 的第三方库，看下是否能够支持实现定时定区域自动截图的功能，如果表现良好，可以考虑将其集成到 electron 中，出一个桌面端的自动截图工具。
  - 应用场景：看外文视频的时候，自动定时截字幕。
  - 功能：
    - 定时截图
    - 定区域截图
    - ORC 识别（识别字幕，去重）


<!-- ====================>分隔符<==================== -->
### [0034. 仿观察者模式实现两个渲染进程之间的互相通信](../0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1) -->

- 📝 summary
  - 理解事件注册流程
  - 理解事件触发流程
  - 原理简述
    - 主进程维护一个事件登记表 `messageChannelRecord`，需要监听 `action` 事件的渲染进程在页面加载完毕后立刻通知主进程，主进程记录 `action` 事件和对应渲染进程的 ID `e.sender.id`。当某个渲染触发 `action` 事件的时候，主进程根据记录的 ID 逐个去通知注册了该事件的渲染进程。
    - 其中 messageChannelRecord 的数据结构如下：
```js
const messageChannelRecord:Record<string, Electron.BrowserWindow.id[]>  = {}
messageChannelRecord['action'] = [ e.sender.id ]
// Electron.BrowserWindow.id 是 number 类型
```


<!-- ====================>分隔符<==================== -->
### [0035. 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信](../0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0035


<!-- ====================>分隔符<==================== -->
### [0036. 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信](../0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1) -->



<!-- ====================>分隔符<==================== -->
### [0037. 使用 ipcRenderer.send、ipcMain.on 实现从渲染进程到主进程的单向 IPC 通信](../0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0037


<!-- ====================>分隔符<==================== -->
### [0038. 使用 ipcRenderer.send、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](../0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0038


<!-- ====================>分隔符<==================== -->
### [0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](../0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0039
- 📝 summary
  - 通过对比 `ipcRenderer.send`、`ipcRenderer.sendSync` 来熟悉 `sendSync` API 的一些特点和基本用法。
  - 注意：ipcRenderer.sendSync 非必要，不建议使用。


<!-- ====================>分隔符<==================== -->
### [0040. 使用 MessagePort 实现两个渲染进程之间的互相通信](../0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0040
- 📝 summary
  - 如何使用 MessagePort 来实现两个渲染进程之间的相互通信


<!-- ====================>分隔符<==================== -->
### [0041. 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信](../0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0041


<!-- ====================>分隔符<==================== -->
### [0042. 通过主进程转发消息的方式实现两个渲染进程之间互相通信](../0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0042
- 📝 summary
  - 理解 demo1 的写法存在的问题
  - 理解 demo2 的实现原理
  - 一共有 2 个 demo，其中 demo1 的写法是存在一些问题的，demo2 对 demo1 的问题进行了处理。
  - 类似于 demo2 的效果，在工作中实践过，使用起来感觉没啥问题，还 OK。需要注意的是 channel 的语义化，如果 channel 的数量比较多，那么可以尝试通过一些特殊的自定义命名规则来区分哪些 channel 是用于在两个渲染进程之间互相通信的。当然，除了通过自定义命名规范来区分，还可以单独写一个全局对象来存储 channel，比如 `CHANNEL_LIST.r2r.xxx`、`CHANNEL_LIST.r2m.xxx`、`CHANNEL_LIST.m2r.xxx`。


<!-- ====================>分隔符<==================== -->
### [0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息](../0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF) -->



<!-- ====================>分隔符<==================== -->
### [0044. weread-helper](../0044.%20weread-helper/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper) -->

- 📝 summary
  - 套壳了微信读书的网页版，并注入了一些自定义脚本。


<!-- ====================>分隔符<==================== -->
### [0045. Electron 核心概念](../0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5) -->

- 📝 summary
  - 主进程是什么
  - 渲染进程是什么
  - 主进程和渲染进程之间的差异
  - electron 的渲染进程（Web 页面）和我们传统的在浏览器端开发的 Web 页面有何区别
  - 上下文隔离 contextIsolation 是什么
  - 如何开启 contextIsolation 配置
  - 为什么建议始终开启 contextIsolation 配置
  - 上下文桥接 contextBridge 是什么
  - contextBridge 用来解决什么问题
  - 如何使用 contextBridge API 来给渲染进程暴露方法
  - 需要对 Electron 中的主进程和渲染进程有个初步的认知，在后续的学习中，Electron 的主进程和渲染进程将会是学习的重点内容。“Electron 的主进程”、“Electron 的渲染进程”这两组字眼，在接下来的学习中，会不断地被提及。本文档中提及的内容，仅仅是做一个初步的简单介绍罢了，通过多撸代码，慢慢加深对它们的理解。


<!-- ====================>分隔符<==================== -->
### [0046. 认识 IPC 相关模块](../0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97) -->

- 📝 summary
  - 把官方教程中提到的 IPC 通信模式刷一遍
  - 认识用于实现 IPC 通信的模块 ipcMain、ipcRenderer
  - send 和 sendSync 之间的一些差异（这俩 API “已过时”）
  - invoke 比 send 好在哪


<!-- ====================>分隔符<==================== -->
### [0047. 分析渲染进程之间的通信](../0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1) -->

- 📝 summary
  - 主进程转发消息
  - 主进程转发 ID
  - 消息端口
  - 通过笔记中的时序图来介绍了两个渲染进程之间通信的一种方式 —— 借助主进程来转发消息。
  - 相关实现示例，见后续文档中对应的 demo。
  - 这篇笔记中画的几张图，在后续的 demo 的视频介绍中有被反复提及。


<!-- ====================>分隔符<==================== -->
### [0048. 认识无边框窗口](../0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3) -->

- 📝 summary
  - 如何创建一个无边框窗口
  - 无边框窗口的特点
    - 了解无边框窗口的特点，如果你创建的窗口要求具备这些特性，可以考虑使用无边框窗口来实现。


<!-- ====================>分隔符<==================== -->
### [0049. desktopCapturer 简介](../0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B) -->

- 📝 summary
  - desktopCapturer 是什么
  - desktopCapturer 的基本使用流程
  - desktopCapturer 这是主进程中的一个模块，是一个用于处理桌面视频流（你可以理解为就是你眼睛看到的显示屏上的画面数据）的 API。


<!-- ====================>分隔符<==================== -->
### [0050. 《Electron 实战：入门、进阶与性能优化》](../0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B) -->

- [📺 bilibili](https://www.bilibili.com/video/BV1544219774)
  - electron.0050
- 📝 summary
  - 该笔记存放了 [《Electron 实战：入门、进阶与性能优化》](《Electron实战：入门、进阶与性能优化》.pdf) 这本书的 pdf 版本。
  - 这本书还没读完，记得读了其中的一小部分，现在（24.10）electron 已经升级到 v33 了，书中的版本记得应该是蛮低的，在阅读的时候需要注意一下版本。书中（20.05）的版本是 8 左右。差了 25 个大版本，变化的内容还是挺多的。
    - ![](md-imgs/2024-10-20-01-17-04.png)


<!-- ====================>分隔符<==================== -->
### [0051. 掘金小册 - 《Electron 应用开发实践指南》](../0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B) -->

- 📝 summary
  - 记录了 electron 相关的学习资源 - 掘金小册 - 《Electron 应用开发实践指南》
  - 对 rubick 做了一个简单的介绍。


<!-- ====================>分隔符<==================== -->
### [0052. Electron Showcase](../0052.%20Electron%20Showcase/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0052.%20Electron%20Showcase) -->

- 📝 summary
  - 本节介绍了一下 **Electron Showcase** 是什么。


<!-- ====================>分隔符<==================== -->
### [0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》](../0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B) -->

- 📝 summary
  - 记录了 electron 相关的学习资源 - 掘金小册 - 《Electron + Vue 3 桌面应用开发》


<!-- ====================>分隔符<==================== -->
### [0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》](../0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B) -->

- 📝 summary
  - 记录了 electron 相关的学习资源 - 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》


<!-- ====================>分隔符<==================== -->
### [0055. WebStudyBooks 免费的前端掘金小册](../0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md) <!-- [github](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C) -->

- 📝 summary
  - 介绍了一个 github 仓库 WebStudyBooks，这里边存放了一些作者上传的掘金小册的压缩包，可以免费获取。
  - 介绍了阅读这些内容可能存在的一些问题。


<!-- ====================>分隔符<==================== -->
