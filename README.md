# Electron

<!-- region:toc -->
- [Electron](#electron)
  - [1. Electron 笔记仓库介绍](#1-electron-笔记仓库介绍)
  - [2. electron 学习资源](#2-electron-学习资源)
    - [2.1. electron 书籍](#21-electron-书籍)
    - [2.2. electron 掘金小册](#22-electron-掘金小册)
  - [3. 认识 electron](#3-认识-electron)
    - [3.1. electron 都能用来开发什么类型的应用程序？](#31-electron-都能用来开发什么类型的应用程序)
    - [3.2. 了解 electron 的核心概念](#32-了解-electron-的核心概念)
  - [4. 打通主进程和渲染进程](#4-打通主进程和渲染进程)
    - [4.1. 上下文桥接 contextBridge](#41-上下文桥接-contextbridge)
    - [4.2. IPC 基础](#42-ipc-基础)
      - [4.2.1. 1. 认识 IPC 相关模块](#421-1-认识-ipc-相关模块)
      - [4.2.2. 2. 渲染进程 -> 主进程](#422-2-渲染进程-->-主进程)
      - [4.2.3. 3. 主进程 -> 渲染进程](#423-3-主进程-->-渲染进程)
      - [4.2.4. 4. 渲染进程 <-> 主进程](#424-4-渲染进程-<->-主进程)
    - [4.3. IPC 进阶](#43-ipc-进阶)
      - [4.3.1. 1. 渲染进程 <-> 渲染进程](#431-1-渲染进程-<->-渲染进程)
      - [4.3.2. 2. MessageChannel](#432-2-messagechannel)
  - [5. 窗口](#5-窗口)
    - [5.1. 不同系统的窗口行为兼容适配](#51-不同系统的窗口行为兼容适配)
    - [5.2. 窗口首次加载的白屏问题](#52-窗口首次加载的白屏问题)
    - [5.3. 无边框窗口](#53-无边框窗口)
    - [5.4. 窗口层级](#54-窗口层级)
  - [6. 菜单](#6-菜单)
    - [6.1. 不同系统的菜单适配](#61-不同系统的菜单适配)
    - [6.2. 页面右键菜单](#62-页面右键菜单)
    - [6.3. Dock 菜单](#63-dock-菜单)
    - [6.4. 自定义菜单](#64-自定义菜单)
    - [6.5. Tray 菜单](#65-tray-菜单)
  - [7. app](#7-app)
    - [7.1. 路径](#71-路径)
  - [8. 快捷键](#8-快捷键)
    - [8.1. 页面级别](#81-页面级别)
    - [8.2. 全局级别](#82-全局级别)
  - [9. 剪切板](#9-剪切板)
  - [10. 系统通知](#10-系统通知)
  - [11. 桌面视频流](#11-桌面视频流)
  - [12. 插件化](#12-插件化)
    - [12.1. 集成浏览器插件（其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。）](#121-集成浏览器插件其它第三方插件的集成方案基本都类似集成-vue-调试工具-vue-devtools-的示例可以作为一个参考)
  - [13. 其它功能](#13-其它功能)
    - [13.1. webContents startDrag 原生文件拖放](#131-webcontents-startdrag-原生文件拖放)
  - [14. 第三方库](#14-第三方库)
    - [14.1. electron-reload](#141-electron-reload)
    - [14.2. electron-builder](#142-electron-builder)
  - [15. 项目练习](#15-项目练习)
    - [15.1. 桌面时钟](#151-桌面时钟)
    - [15.2. 微信读书助手](#152-微信读书助手)
    - [15.3. 自动定时截图工具](#153-自动定时截图工具)
<!-- endregion:toc -->

## 1. Electron 笔记仓库介绍

- [ ] [9998. electron 笔记仓库介绍](https://github.com/Tdahuyou/electron/tree/main/9998.%20electron%20%E7%AC%94%E8%AE%B0%E4%BB%93%E5%BA%93%E4%BB%8B%E7%BB%8D/README.md) <!-- [locale](./9998.%20electron%20%E7%AC%94%E8%AE%B0%E4%BB%93%E5%BA%93%E4%BB%8B%E7%BB%8D/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/9998.%20electron%20%E7%AC%94%E8%AE%B0%E4%BB%93%E5%BA%93%E4%BB%8B%E7%BB%8D/README.md#1--summary)
  <!-- endregion:toc -->

## 2. electron 学习资源

### 2.1. electron 书籍

- [ ] [0050. 《Electron 实战：入门、进阶与性能优化》](https://github.com/Tdahuyou/electron/tree/main/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md) <!-- [locale](./0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md#1--summary)
  <!-- endregion:toc -->

### 2.2. electron 掘金小册

- [ ] [0051. 掘金小册 - 《Electron 应用开发实践指南》](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md) <!-- [locale](./0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#2--links)
  - [3. 🔗 links - rubick](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#3--links---rubick)
  - [4. 📒 notes - rubick 是什么](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#4--notes---rubick-是什么)
  <!-- endregion:toc -->

- [ ] [0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》](https://github.com/Tdahuyou/electron/tree/main/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md) <!-- [locale](./0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md#2--links)
  <!-- endregion:toc -->

- [ ] [0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》](https://github.com/Tdahuyou/electron/tree/main/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md) <!-- [locale](./0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md#2--links)
  <!-- endregion:toc -->

- [ ] [0055. WebStudyBooks 免费的前端掘金小册](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md) <!-- [locale](./0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#2--links)
  - [3. 📒 notes - 注意一些可能存在的问题](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#3--notes---注意一些可能存在的问题)
  <!-- endregion:toc -->

## 3. 认识 electron

### 3.1. electron 都能用来开发什么类型的应用程序？

- [ ] [0052. Electron Showcase](https://github.com/Tdahuyou/electron/tree/main/0052.%20Electron%20Showcase/README.md) <!-- [locale](./0052.%20Electron%20Showcase/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0052.%20Electron%20Showcase/README.md#1--summary)
  - [2. 📒 notes - Electron Showcase 简介](https://github.com/Tdahuyou/electron/tree/main/0052.%20Electron%20Showcase/README.md#2--notes---electron-showcase-简介)
  <!-- endregion:toc -->

### 3.2. 了解 electron 的核心概念

- [ ] [0001. Electron 应用的最小组成](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md) <!-- [locale](./0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#2--links)
  - [3. 📒 notes - electron 应用的最小组成](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#3--notes---electron-应用的最小组成)
  - [4. 📒 notes - 最终效果展示](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#4--notes---最终效果展示)
  - [5. 💻 demo - 实现步骤](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#5--demo---实现步骤)
    - [5.1. 安装 Node.js 和 npm](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#51-安装-nodejs-和-npm)
    - [5.2. 安装 Electron](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#52-安装-electron)
    - [5.3. 准备入口文件（主进程）](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#53-准备入口文件主进程)
    - [5.4. 准备页面（渲染进程，非必需）](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#54-准备页面渲染进程非必需)
    - [5.5. 配置启动命令（非必需）](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#55-配置启动命令非必需)
    - [5.6. 启动 Electron 应用](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#56-启动-electron-应用)
  - [6. 🤔 问：主进程加载的入口文件是？](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#6--问主进程加载的入口文件是)
  <!-- endregion:toc -->

- [ ] [0045. Electron 核心概念](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md) <!-- [locale](./0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#1--summary)
  - [2. 🔗 链接](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#2--链接)
  - [3. 💡 导图](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#3--导图)
  - [4. 📝 Electron 架构](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#4--electron-架构)
  - [5. 📝 主进程 vs. 渲染进程](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#5--主进程-vs-渲染进程)
    - [5.1. 数量差异](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#51-数量差异)
    - [5.2. 作用差异](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#52-作用差异)
    - [5.3. 模块差异](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#53-模块差异)
  - [6. 📝 contextBridge](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#6--contextbridge)
    - [6.1. `contextIsolation` 是什么](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#61-`contextisolation`-是什么)
    - [6.2. `contextIsolation` 工作原理](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#62-`contextisolation`-工作原理)
    - [6.3. 为什么要使用 `contextIsolation`](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#63-为什么要使用-`contextisolation`)
    - [6.4. 如何配置 `contextIsolation`](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#64-如何配置-`contextisolation`)
    - [6.5. 小结](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#65-小结)
  - [7. 📝 contextBridge 上下文桥接](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#7--contextbridge-上下文桥接)
    - [7.1. `contextBridge` 是什么](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#71-`contextbridge`-是什么)
    - [7.2. `contextBridge` 工作原理](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#72-`contextbridge`-工作原理)
    - [7.3. `contextBridge` 基本使用](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#73-`contextbridge`-基本使用)
  - [8. 🤔 问：渲染进程中的 remote 模块是？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#8--问渲染进程中的-remote-模块是)
  - [9. 🤔 问：Electron 中的渲染进程也是网页，那么它和我们在浏览器中开发的网页有何区别？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#9--问electron-中的渲染进程也是网页那么它和我们在浏览器中开发的网页有何区别)
  - [10. 🤔 问：IPC 通信是什么？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#10--问ipc-通信是什么)
  - [11. 🤔 问：为什么需要 IPC 通信呢？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#11--问为什么需要-ipc-通信呢)
  - [12. 🤔 问：为什么 Electron 要将主进程和渲染进程分开呢？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#12--问为什么-electron-要将主进程和渲染进程分开呢)
  - [13. 🤔 问：主进程向渲染进程发消息，是向页面发吗？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#13--问主进程向渲染进程发消息是向页面发吗)
  - [14. 🤔 问：为什么要使用 `contextBridge`](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#14--问为什么要使用-`contextbridge`)
  <!-- endregion:toc -->

## 4. 打通主进程和渲染进程

### 4.1. 上下文桥接 contextBridge

- [ ] [0002. 使用 contextBridge 暴露 API 给渲染进程](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md) <!-- [locale](./0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#3--demo)
  <!-- endregion:toc -->

### 4.2. IPC 基础

#### 4.2.1. 1. 认识 IPC 相关模块

- [ ] [0046. 认识 IPC 相关模块](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md) <!-- [locale](./0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#2--links)
  - [3. 💡 导图](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#3--导图)
  - [4. 📝 electron doc - 进程间通信教程](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#4--electron-doc---进程间通信教程)
  - [5. 📝 send vs. sendSync](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#5--send-vs-sendsync)
    - [5.1. send、sendSync 是什么](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#51-sendsendsync-是什么)
    - [5.2. 同步 vs. 异步](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#52-同步-vs-异步)
    - [5.3. 返回值](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#53-返回值)
    - [5.4. 看看官方建议](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#54-看看官方建议)
  - [6. 📝 send vs. invoke](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#6--send-vs-invoke)
    - [6.1. 先给出结论](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#61-先给出结论)
    - [6.2. 场景 - 双向通信](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#62-场景---双向通信)
    - [6.3. 场景 - 单向通信](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#63-场景---单向通信)
  - [7. 🤔 问：使用 send 来实现单向通信能减少开销提高性能？](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#7--问使用-send-来实现单向通信能减少开销提高性能)
  <!-- endregion:toc -->

#### 4.2.2. 2. 渲染进程 -> 主进程

- [ ] [0037. 使用 ipcRenderer.send、ipcMain.on 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demo)
  <!-- endregion:toc -->

- [ ] [0035. 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demo)
  <!-- endregion:toc -->

#### 4.2.3. 3. 主进程 -> 渲染进程

- [ ] [0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息](https://github.com/Tdahuyou/electron/tree/main/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md) <!-- [locale](./0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md#2--demo)
  <!-- endregion:toc -->

#### 4.2.4. 4. 渲染进程 <-> 主进程

- [ ] [0038. 使用 ipcRenderer.send、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demo)
  <!-- endregion:toc -->

- [ ] [0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demo)
  <!-- endregion:toc -->

- [ ] [0036. 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demo)
  <!-- endregion:toc -->

### 4.3. IPC 进阶

#### 4.3.1. 1. 渲染进程 <-> 渲染进程

- [ ] [0047. 分析渲染进程之间的通信](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#2--links)
  - [3. 📝 错误做法 ❌](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#3--错误做法-)
  - [4. 📝 主进程转发消息](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#4--主进程转发消息)
  - [5. 📝 主进程转发 ID](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#5--主进程转发-id)
  - [6. 📝 走消息端口](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#6--走消息端口)
  <!-- endregion:toc -->

- [ ] [0042. 通过主进程转发消息的方式实现两个渲染进程之间互相通信](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 💻 demo1](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--demo1)
  - [3. 💻 demo2](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--demo2)
  <!-- endregion:toc -->

- [ ] [0041. 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#4--demo)
  <!-- endregion:toc -->

- [ ] [0040. 使用 MessagePort 实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0034. 仿观察者模式实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--links)
  - [3. 💡 导图](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--导图)
  - [4. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#4--notes)
  - [5. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#5--demo)
  <!-- endregion:toc -->

#### 4.3.2. 2. MessageChannel

- [ ] [0004. 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--summary)
  - [2. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--notes)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md) <!-- [locale](./0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md#1--summary)
  - [2. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md#2--notes)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md#3--demo)
  <!-- endregion:toc -->

## 5. 窗口

### 5.1. 不同系统的窗口行为兼容适配

- [ ] [0016. 适配 Windows 和 macOS 上的窗口交互行为](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md) <!-- [locale](./0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#4--demo)
  <!-- endregion:toc -->

### 5.2. 窗口首次加载的白屏问题

- [ ] [0015. 等 ready-to-show 事件触发后再显示窗口以解决窗口白屏问题](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#3--demo)
  <!-- endregion:toc -->

### 5.3. 无边框窗口

- [ ] [0048. 认识无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) <!-- [locale](./0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#2--links)
  - [3. 📝 创建无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#3--创建无边框窗口)
  - [4. 📝 无边框窗口的特点](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#4--无边框窗口的特点)
  - [5. 📝 特点 - 可以自定义窗口控制按钮](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#5--特点---可以自定义窗口控制按钮)
  - [6. 📝 特点 - 可以自定义窗口的形状和样式](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#6--特点---可以自定义窗口的形状和样式)
  - [7. 📝 特点 - 需要手动实现窗口的拖拽和窗口的尺寸调整](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#7--特点---需要手动实现窗口的拖拽和窗口的尺寸调整)
  <!-- endregion:toc -->

- [ ] [0018. 创建一个无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) <!-- [locale](./0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0019. 让无边框的窗口可以被拖拽](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md) <!-- [locale](./0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0020. macos 隐藏窗口标题栏但是不隐藏交通灯](https://github.com/Tdahuyou/electron/tree/main/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md) <!-- [locale](./0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md#2--demo)
  <!-- endregion:toc -->

### 5.4. 窗口层级

- [ ] [0017. 窗口置顶](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md) <!-- [locale](./0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#4--demo)
  <!-- endregion:toc -->

## 6. 菜单

### 6.1. 不同系统的菜单适配

- [ ] [0010. macos 应用菜单第一项的问题](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#3--notes)
  - [4. 💻 demo1](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#4--demo1)
  - [5. 💻 demo2](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#5--demo2)
  - [6. 🤔 问：在 macos 中，第一项菜单的名称如何自定义呢？](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#6--问在-macos-中第一项菜单的名称如何自定义呢)
  <!-- endregion:toc -->

### 6.2. 页面右键菜单

- [ ] [0012. 使用 Menu 模块实现页面中的右键菜单](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md) <!-- [locale](./0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#4--demo)
  <!-- endregion:toc -->

### 6.3. Dock 菜单

- [ ] [0009. 设置 macos 的 Dock 菜单](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md) <!-- [locale](./0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#4--demo)
  <!-- endregion:toc -->

### 6.4. 自定义菜单

- [ ] [0011. 自定义系统菜单覆盖默认菜单问题](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#2--links)
  - [3. 📒 notes - 菜单项冲突问题](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#3--notes---菜单项冲突问题)
  - [4. 📒 notes - 如何解决冲突问题](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#4--notes---如何解决冲突问题)
  - [5. 💻 demo1 - 手写调试工具切换的触发逻辑](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#5--demo1---手写调试工具切换的触发逻辑)
  - [6. 💻 demo2 - 使用预设的 role 来快速配置菜单项](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#6--demo2---使用预设的-role-来快速配置菜单项)
  - [7. 🤔 问：role 是什么？](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#7--问role-是什么)
  <!-- endregion:toc -->

### 6.5. Tray 菜单

- [ ] [0025. 创建 macos 应用托盘（Tray）](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md) <!-- [locale](./0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#2--links)
  - [3. 📒 notes - 核心模块概述](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#3--notes---核心模块概述)
  - [4. 📒 notes - 托盘图标](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#4--notes---托盘图标)
  - [5. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#5--demo)
  - [6. 🤔 问：Tray 是 macOS 特有的吗？](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#6--问tray-是-macos-特有的吗)
  <!-- endregion:toc -->

## 7. app

### 7.1. 路径

- [ ] [0024. 通过 app 模块获取应用相关路径](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md) <!-- [locale](./0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#4--demo)
  <!-- endregion:toc -->

## 8. 快捷键

### 8.1. 页面级别

- [ ] [0023. 页面级别的快捷键](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) <!-- [locale](./0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#4--demo)
  <!-- endregion:toc -->

### 8.2. 全局级别

- [ ] [0022. 全局级别的快捷键](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) <!-- [locale](./0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#4--demo)
  <!-- endregion:toc -->

## 9. 剪切板

- [ ] [0021. 使用 clipboard 模块向系统剪切板中读写文本](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md) <!-- [locale](./0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#3--demo)
  <!-- endregion:toc -->

## 10. 系统通知

- [ ] [0026. 使用 Notification 模块弹出系统消息](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md) <!-- [locale](./0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#3--demo)
  <!-- endregion:toc -->

## 11. 桌面视频流

- [ ] [0029. 实现屏幕监听功能](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md) <!-- [locale](./0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#2--links)
  - [3. 📒 notes - `navigator.mediaDevices.getUserMedia()` 的 video 配置结构问题](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#3--notes---`navigatormediadevicesgetusermedia()`-的-video-配置结构问题)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#4--demo)
  <!-- endregion:toc -->

- [ ] [0028. 模拟截图功能](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md) <!-- [locale](./0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0049. desktopCapturer 简介](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md) <!-- [locale](./0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#2--links)
  - [3. 📒 notes - desktopCapturer 是什么](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#3--notes---desktopcapturer-是什么)
  - [4. 📒 notes - desktopCapturer 的基本使用流程](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#4--notes---desktopcapturer-的基本使用流程)
  <!-- endregion:toc -->

## 12. 插件化

- [ ] [0014. 使用 BrowserView 加载外部资源](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md) <!-- [locale](./0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0013. 基于 BrowserView 实现插件化能力](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md) <!-- [locale](./0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#3--demo)
  <!-- endregion:toc -->

### 12.1. 集成浏览器插件（其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。）

- [ ] [0006. 使用 vue-remote-devtools](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md) <!-- [locale](./0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0007. 使用手动安装的方式集成 vue-devtools](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) <!-- [locale](./0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0005. 使用 electron-devtools-installer 安装 vue-devtools](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md) <!-- [locale](./0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#3--demo)
  <!-- endregion:toc -->

- [ ] [0008. 使用自动安装的方式集成 vue-devtools](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) <!-- [locale](./0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#3--demo)
  - [4. 📒 notes - 如何获取 VUE_DEVTOOLS_ID](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#4--notes---如何获取-vue_devtools_id)
  <!-- endregion:toc -->

## 13. 其它功能

### 13.1. webContents startDrag 原生文件拖放

- [ ] [0027. 原生文件拖 & 放](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md) <!-- [locale](./0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#2--links)
  - [3. 📒 notes - 本文要实现一个什么样的效果](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#3--notes---本文要实现一个什么样的效果)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#4--demo)
  <!-- endregion:toc -->

## 14. 第三方库

### 14.1. electron-reload

- [ ] [0031. 使用 electron-reload 实现热更](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md) <!-- [locale](./0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#3--demo)
  <!-- endregion:toc -->

### 14.2. electron-builder

- [ ] [0030. 使用 electron-icon-builder、electron-builder 解决应用打包后的图标问题](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#1--summary)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#2--demo)
  - [3. 📒 notes - electron, electron-builder, 和 electron-icon-builder 应该安装为开发依赖还是生产依赖呢？](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#3--notes---electron,-electron-builder,-和-electron-icon-builder-应该安装为开发依赖还是生产依赖呢)
  <!-- endregion:toc -->

## 15. 项目练习

### 15.1. 桌面时钟

- [ ] [0032. 实现一个桌面时钟](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md) <!-- [locale](./0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#2--links)
  - [3. 📒 notes](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#3--notes)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#4--demo)
  <!-- endregion:toc -->

- [ ] [0056. 实现一个桌面时钟-2](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md) <!-- [locale](./0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#1--summary)
  - [2. 📒 notes - demo 的功能](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#2--notes---demo-的功能)
  - [3. 📒 notes - 编写这个 demo 的初衷](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#3--notes---编写这个-demo-的初衷)
  - [4. 📒 notes - 启动命令 `npm start`](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#4--notes---启动命令-`npm-start`)
  - [5. 📒 notes - 出包命令 `npm run build`](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#5--notes---出包命令-`npm-run-build`)
  - [6. 📒 notes - 图标背景色 `#9feaf9`](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#6--notes---图标背景色-`#9feaf9`)
  <!-- endregion:toc -->

### 15.2. 微信读书助手

- [ ] [0044. weread-helper](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md) <!-- [locale](./0044.%20weread-helper/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md#1--summary)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md#2--links)
  - [3. 📒 notes - Quick Start](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md#3--notes---quick-start)
  <!-- endregion:toc -->

### 15.3. 自动定时截图工具

- [ ] [0033. ScreenCaptureApp](https://github.com/Tdahuyou/electron/tree/main/0033.%20ScreenCaptureApp/README.md) <!-- [locale](./0033.%20ScreenCaptureApp/README.md) -->  
  <!-- region:toc -->
  - [1. 📝 Summary](https://github.com/Tdahuyou/electron/tree/main/0033.%20ScreenCaptureApp/README.md#1--summary)
  <!-- endregion:toc -->
