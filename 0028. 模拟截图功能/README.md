# [0028. 模拟截图功能](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD)

<!-- region:toc -->
- [1. 📝 summary](#1--summary)
- [2. 🔗 links](#2--links)
- [3. 💻 demo](#3--demo)
<!-- endregion:toc -->
## 1. 📝 summary
- 使用 Electron 并结合传统的前端技术来实现一个截图应用
- 这篇文档是作者 [mowuu](https://github.com/muwoo) 使用 Electron 内置模块结合前端技术 canvas 写的一个截图工具示例。
- demo 的核心逻辑简单了解了个大概，屏幕数据的获取使用的是 desktopCapture，页面上的图像最终是使用 canvas 来绘制的。实测在高分辨率的设备下截图效果异常模糊，几乎处于不可用的状态。
- 临时结论：使用 Electron 内置的原生模块来模拟截图效果，可以说几乎是不可用的。后续找时间去 github 搜一下看看其它解决方案。

## 2. 🔗 links

- https://github.com/muwoo/electron-demo
  - 这是一个 GitHub 上的仓库，基于 Electron 实现了截图功能的一个小 demo。
- nodejs.0006 使用 screencapture 命令实现 macos 系统截图
  - 这篇文档介绍了在 macos 上实现截图功能的一种方式，和文中提到的 demo 是完全不同的两种截图方案。

## 3. 💻 demo

```bash
# 克隆并启动项目
$ git clone https://github.com/muwoo/electron-demo.git
$ cd electron-demo
$ yarn add
$ npm run electron:serve
```

- 启动时可能会报 nodejs 版本不支持，可以使用类似 nvm 这样的 nodejs 版本管理工具来安装错误信息中提到的 nodejs 版本。

```bash
# error @achrinza/node-ipc@9.2.2: The engine "node" is incompatible with this module. Expected version "8 || 10 || 12 || 14 || 16 || 17". Got "18.15.0"
# error Found incompatible module.
```

- 源码比较多，就不在文档中展示了。
- **直接说体验效果** - 在 macos 上测试了一下截图效果，有些拉跨，截图时画面会突然变得很模糊。windows 系统下的体验效果未测试过。
- **demo 存在的一些问题分析**
  1. 每次截图都需要创建模拟窗口，对于 Electron 而言，创建窗口是需要耗时的。（可以用窗口池解决，提前预先创建窗口，但容易占用不少内存。）
  2. Linux 只支持单屏幕截图。由于 Chrome 内核的原因，Linux 系统无法区分多个屏幕，它所有的屏幕 ID 都是 0:0。
  3. 使用 Canvas 绘制的屏幕在高分辨率的显示器中，图片总是会模糊。
  4. 使用 Canavs 生成图像层的时候，比较耗时，越高分辨率耗时越高。
  5. 毕竟是模拟窗口，在 macOS 上，还是可以对窗口进行滑屏操作，体验非常不好。

