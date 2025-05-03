# electron

<!-- region:toc -->

- [electron](#electron)
  - [1. TNotes.electron 笔记简介](#1-tnoteselectron-笔记简介)
  - [2. Electron 学习资源](#2-electron-学习资源)
  - [3. Electron 应用](#3-electron-应用)
  - [4. Electron 核心概念](#4-electron-核心概念)
  - [5. Electron 应用的最小组成](#5-electron-应用的最小组成)
  - [6. contextBridge 上下文桥接](#6-contextbridge-上下文桥接)
  - [7. IPC 基础](#7-ipc-基础)
  - [8. IPC 进阶](#8-ipc-进阶)
  - [9. 窗口](#9-窗口)
    - [9.1. 不同系统的窗口行为兼容适配](#91-不同系统的窗口行为兼容适配)
    - [9.2. 窗口首次加载的白屏问题](#92-窗口首次加载的白屏问题)
    - [9.3. 无边框窗口](#93-无边框窗口)
    - [9.4. 窗口层级](#94-窗口层级)
  - [10. 菜单](#10-菜单)
    - [10.1. 不同系统的菜单适配](#101-不同系统的菜单适配)
    - [10.2. 页面右键菜单](#102-页面右键菜单)
    - [10.3. Dock 菜单](#103-dock-菜单)
    - [10.4. 自定义菜单](#104-自定义菜单)
    - [10.5. Tray 菜单](#105-tray-菜单)
  - [11. app](#11-app)
    - [11.1. 路径](#111-路径)
  - [12. 快捷键](#12-快捷键)
    - [12.1. 页面级别](#121-页面级别)
    - [12.2. 全局级别](#122-全局级别)
  - [13. 剪切板](#13-剪切板)
  - [14. 系统通知](#14-系统通知)
  - [15. 桌面视频流](#15-桌面视频流)
  - [16. 插件化](#16-插件化)
    - [16.1. 集成浏览器插件](#161-集成浏览器插件)
  - [17. 其它功能](#17-其它功能)
    - [17.1. webContents startDrag 原生文件拖放](#171-webcontents-startdrag-原生文件拖放)
  - [18. 第三方库](#18-第三方库)
    - [18.1. electron-reload](#181-electron-reload)
    - [18.2. electron-builder](#182-electron-builder)
  - [19. 小练习](#19-小练习)
    - [19.1. 桌面时钟](#191-桌面时钟)
    - [19.2. 微信读书助手](#192-微信读书助手)
    - [19.3. 自动定时截图工具](#193-自动定时截图工具)

<!-- endregion:toc -->

## 1. TNotes.electron 笔记简介

- [x] [0059. TNotes.electron 笔记简介](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0059.%20TNotes.electron%20%E7%AC%94%E8%AE%B0%E7%AE%80%E4%BB%8B/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0059.%20TNotes.electron%20%E7%AC%94%E8%AE%B0%E7%AE%80%E4%BB%8B/README.md#1--概述)
  - [2. 🔗 electron 笔记仓库](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0059.%20TNotes.electron%20%E7%AC%94%E8%AE%B0%E7%AE%80%E4%BB%8B/README.md#2--electron-笔记仓库)
  - [3. 🔗 B 站视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0059.%20TNotes.electron%20%E7%AC%94%E8%AE%B0%E7%AE%80%E4%BB%8B/README.md#3--b-站视频)
  - [4. 📂 TNotes.assets](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0059.%20TNotes.electron%20%E7%AC%94%E8%AE%B0%E7%AE%80%E4%BB%8B/README.md#4--tnotesassets)
  - [5. 📒 视频内容及更新说明](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0059.%20TNotes.electron%20%E7%AC%94%E8%AE%B0%E7%AE%80%E4%BB%8B/README.md#5--视频内容及更新说明)

## 2. Electron 学习资源

- [x] [0057. electron 源码仓库](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0057.%20electron%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0057.%20electron%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93/README.md#1--概述)
  - [2. 🔗 electron 源码仓库](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0057.%20electron%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93/README.md#2--electron-源码仓库)
  - [3. 🔗 deepwiki - 借助 AI 来阅读项目源码](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0057.%20electron%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93/README.md#3--deepwiki---借助-ai-来阅读项目源码)
- [x] [0058. electron 官方文档](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0058.%20electron%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0058.%20electron%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/README.md#1--概述)
  - [2. 🔗 Electron 官方文档链接](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0058.%20electron%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/README.md#2--electron-官方文档链接)
- [x] [0050. 《Electron 实战：入门、进阶与性能优化》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md#1--概述)
- [x] [0051. 掘金小册 - 《Electron 应用开发实践指南》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#1--概述)
  - [2. 📒 小册目录](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#2--小册目录)
  - [3. 📒 rubick 简介](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#3--rubick-简介)
  - [4. 🔗 References](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#4--references)
- [x] [0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md#1--概述)
  - [2. 📒 小册目录](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md#2--小册目录)
- [x] [0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md#1--概述)
  - [2. 📒 小册目录](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md#2--小册目录)
- [x] [0055. WebStudyBooks 免费的前端掘金小册](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#1--概述)
  - [2. 📂 白嫖小册列表](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#2--白嫖小册列表)
  - [3. 🔗 WebStudyBooks 相关链接](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#3--webstudybooks-相关链接)
  - [4. 📒 注意一些可能存在的问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#4--注意一些可能存在的问题)

## 3. Electron 应用

- [x] [0052. Electron Showcase](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0052.%20Electron%20Showcase/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0052.%20Electron%20Showcase/README.md#1--概述)
  - [2. 📒 Electron Showcase 简介](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0052.%20Electron%20Showcase/README.md#2--electron-showcase-简介)

## 4. Electron 核心概念

- [x] [0045. Electron 核心概念](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#1--概述)
  - [2. 💡 思维导图](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#2--思维导图)
  - [3. 📒 认识 Electron 基本架构](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#3--认识-electron-基本架构)
  - [4. 📒 主进程 vs. 渲染进程](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#4--主进程-vs-渲染进程)
    - [4.1. 数量差异](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#41-数量差异)
    - [4.2. 作用差异](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#42-作用差异)
    - [4.3. 模块差异](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#43-模块差异)
  - [5. 📒 认识 contextIsolation 上下文隔离](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#5--认识-contextisolation-上下文隔离)
  - [6. 📒 认识 contextBridge 上下文桥接](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#6--认识-contextbridge-上下文桥接)
  - [7. 🤔 Q&A](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#7--qa)
    - [7.1. 🤔 问：渲染进程中的 remote 模块是？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#71--问渲染进程中的-remote-模块是)
    - [7.2. 🤔 问：Electron 中的渲染进程也是网页，那么它和我们在浏览器中开发的网页有何区别？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#72--问electron-中的渲染进程也是网页那么它和我们在浏览器中开发的网页有何区别)
    - [7.3. 🤔 问：IPC 通信是什么？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#73--问ipc-通信是什么)
    - [7.4. 🤔 问：为什么需要 IPC 通信呢？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#74--问为什么需要-ipc-通信呢)
    - [7.5. 🤔 问：为什么 Electron 要将主进程和渲染进程分开呢？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#75--问为什么-electron-要将主进程和渲染进程分开呢)
    - [7.6. 🤔 问：主进程向渲染进程发消息，是向页面发吗？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#76--问主进程向渲染进程发消息是向页面发吗)
    - [7.7. 🤔 问：谈谈为什么要使用 `contextBridge`？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#77--问谈谈为什么要使用-contextbridge)

## 5. Electron 应用的最小组成

- [x] [0001. Electron 应用的最小组成](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md)
  - [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)
    - [bilibili.TNotes.electron.0001.1](https://www.bilibili.com/video/BV1kBFyeREXv)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#1--概述)
  - [2. 💻 demos.1 - Hello World 示例](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#2--demos1---hello-world-示例)
    - [2.1. 安装 Node.js 和 npm](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#21-安装-nodejs-和-npm)
    - [2.2. 安装 Electron](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#22-安装-electron)
    - [2.3. 准备入口文件（主进程）](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#23-准备入口文件主进程)
    - [2.4. 准备页面（渲染进程，非必需）](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#24-准备页面渲染进程非必需)
    - [2.5. 配置启动命令（非必需）](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#25-配置启动命令非必需)
    - [2.6. 启动 Electron 应用](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#26-启动-electron-应用)
  - [3. 🤔 Q&A](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#3--qa)
    - [3.1. 🤔 问：如何查看主进程加载的入口文件？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#31--问如何查看主进程加载的入口文件)
  - [4. 🔗 References](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#4--references)

## 6. contextBridge 上下文桥接

- [x] [0002. 使用 contextBridge 暴露 API 给渲染进程](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#1--概述)
  - [2. 💻 demos.1 - 使用 contextBridge 暴露 API 给渲染进程](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#2--demos1---使用-contextbridge-暴露-api-给渲染进程)

## 7. IPC 基础

- [x] [0046. 认识 IPC 相关模块](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#1--概述)
  - [2. 💡 思维导图](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#2--思维导图)
  - [3. 🔍 查看官方提供的 IPC 通信教程](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#3--查看官方提供的-ipc-通信教程)
  - [4. 📒 send vs. sendSync](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#4--send-vs-sendsync)
  - [5. 📒 send vs. invoke](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#5--send-vs-invoke)
  - [6. 🤔 Q&A](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#6--qa)
    - [6.1. 🤔 问：使用 send 来实现单向通信能减少开销提高性能？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#61--问使用-send-来实现单向通信能减少开销提高性能)
- [x] [0037. 使用 ipcRenderer.send、ipcMain.on 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📝 概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--概述)
  - [2. 💻 demos.1 - 使用 `ipcRenderer.send`、`ipcMain.on` 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demos1---使用-ipcrenderersendipcmainon-实现从渲染进程到主进程的单向-ipc-通信)
- [ ] [0035. 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--视频)
  - [2. 💻 demos.1 - 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demos1---使用-ipcrendererinvokeipcmainhandle-实现从渲染进程到主进程的单向-ipc-通信)
- [ ] [0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md)
  - [1. 💻 demos.1 - 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md#1--demos1---主进程通过-browserwindow-实例的-webcontentssend-方法主动给指定的渲染进程发消息)
- [ ] [0038. 使用 send、on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0038.%20%E4%BD%BF%E7%94%A8%20send%E3%80%81on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0038.%20%E4%BD%BF%E7%94%A8%20send%E3%80%81on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--视频)
  - [2. 💻 demos.1 - 使用 send、on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0038.%20%E4%BD%BF%E7%94%A8%20send%E3%80%81on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demos1---使用-sendon-实现主进程和渲染进程之间的双向-ipc-通信)
- [ ] [0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--视频)
  - [2. 💻 demos.1 - 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#2--demos1---使用-ipcrenderersendsyncipcmainon-实现主进程和渲染进程之间的双向-ipc-通信)
  - 本文档通过对比 `ipcRenderer.send`、`ipcRenderer.sendSync` 这两种通信方法，简单介绍了有关 `ipcRenderer.sendSync` API 的一些特点和基本用法。
  - 注意：`ipcRenderer.sendSync` 非必要，不建议使用。
- [ ] [0036. 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md)
  - [1. 💻 demos.1 - 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--demos1---使用-ipcrendererinvokeipcmainhandle-实现主进程和渲染进程之间的双向-ipc-通信)
  - 本文介绍的这种通信方式，是官方推荐的做法，也是目前比较主流的写法。
  - 渲染进程通过 `ipcRenderer.invoke` 给主进程发送消息，可以通过 `await` 来等待主进程响应，并获取到主进程的处理结果。主进程通过 `ipcMain.handle` 来接受来自渲染进程的消息，通过 `return xxx` 的写法给渲染进程响应处理结果，以此来实现从渲染进程到主进程的双向通信。

## 8. IPC 进阶

- [ ] [0047. 分析渲染进程之间的通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📒 错误做法 ❌](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#1--错误做法-)
  - [2. 📒 主进程转发消息](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#2--主进程转发消息)
  - [3. 📒 主进程转发 ID](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#3--主进程转发-id)
  - [4. 📒 走消息端口](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#4--走消息端口)
  - 注意：mermaid 在 vitepress 中无法正常渲染，后续会将 mermaid 集成到 TNotes 中，在看笔记的时候，先点击标题，跳转到 github 上查看 mermaid 图。
- [ ] [0042. 通过主进程转发消息的方式实现两个渲染进程之间互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📺 视频 - demos.1](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--视频---demos1)
  - [2. 💻 demos.1](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--demos1)
  - [3. 📺 视频 - demos.2](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--视频---demos2)
  - [4. 💻 demos.2](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#4--demos2)
  - 本节一共有 2 个 demo
    - demos.1 的写法是存在一些问题的（需要理解 demos.1 的写法存在的问题）
    - demos.2 对 demos.1 的问题进行了修复（需要理解 demos.2 是如何解决 demos.1 遇到的问题的）
  - 类似于 demos.2 的效果，在工作中实践过，使用起来感觉没啥问题，还 OK。需要注意的是 channel 的语义化，如果 channel 的数量比较多，那么可以尝试通过一些特殊的自定义命名规则来区分哪些 channel 是用于在两个渲染进程之间互相通信的。当然，除了通过自定义命名规范来区分，还可以单独写一个全局对象来存储 channel，比如 `CHANNEL_LIST.r2r.xxx`、`CHANNEL_LIST.r2m.xxx`、`CHANNEL_LIST.m2r.xxx`。
- [ ] [0041. 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#1--视频)
  - [2. 🔍 查看 electron 官方文档 -> breaking-changes](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#2--查看-electron-官方文档---breaking-changes)
  - [3. 💻 demos.1 - 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#3--demos1---通过主进程获取另一个渲染进程的-id-来实现两个渲染进程之间的通信)
  - 本文介绍了两个渲染进程之间实现互相通信的一种方式 —— 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信。
- [ ] [0040. 使用 MessagePort 实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--视频)
  - [2. 🔍 Electron 官方文档 - 如何在两个渲染进程之间建立 MessageChannel](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--electron-官方文档---如何在两个渲染进程之间建立-messagechannel)
  - [3. 🔍 Electron 官方文档 - 主进程的 MessageChannelMain 模块](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--electron-官方文档---主进程的-messagechannelmain-模块)
  - [4. 🔗 引用 - electron.0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#4--引用---electron0003-比较消息端口-messagechannel-和-ipcrendererinvokeipcmainhandle-的性能)
  - [5. 💻 demos.1 - 使用 MessagePort 实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#5--demos1---使用-messageport-实现两个渲染进程之间的互相通信)
- [ ] [0034. 仿观察者模式实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md)
  - [1. 🔍 查看官方文档对 `BrowserWindow.fromId(id)` 此 API 的描述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--查看官方文档对-browserwindowfromidid-此-api-的描述)
  - [2. 📒 原理简述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--原理简述)
  - [3. 💻 demos.1 - 仿观察者模式实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--demos1---仿观察者模式实现两个渲染进程之间的互相通信)
- [ ] [0004. 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md)
  - [1. 💻 demos.1 - 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--demos1---使用-web-api-messagechannel-实现主进程和渲染进程之间的互相通信)
- [ ] [0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md#1--视频)
  - [2. 💻 demos.1 - MessageChannel vs. ipcRenderer.invoke、ipcMain.handle](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md#2--demos1---messagechannel-vs-ipcrendererinvokeipcmainhandle)
  - 本文通过一个 Electron 应用示例对比了 `MessageChannel` 和 `ipcRenderer.invoke`/`ipcMain.handle` 两种 IPC 通信方式的性能差异。

## 9. 窗口

### 9.1. 不同系统的窗口行为兼容适配

- [ ] [0016. 适配 Windows 和 macOS 上的窗口交互行为](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md)
  - [1. 🔍 官方文档 - 查看主进程的 app 模块上的 activate、window-all-closed 事件的相关描述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#1--官方文档---查看主进程的-app-模块上的-activatewindow-all-closed-事件的相关描述)
  - [2. 💻 demos.1 - 适配 Windows 和 macOS 上的窗口交互行为](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#2--demos1---适配-windows-和-macos-上的窗口交互行为)
  - 适配 Windows 和 macOS 上的窗口交互行为的处理逻辑很简单，重点在于理解两种系统中窗口交互的一些差异点。

### 9.2. 窗口首次加载的白屏问题

- [ ] [0015. 等 ready-to-show 事件触发后再显示窗口以解决窗口白屏问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md)
  - [1. 🔍 官方文档 - 主进程模块 - BrowserWindow](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#1--官方文档---主进程模块---browserwindow)
  - [2. 📒 白屏问题常见解决方案](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#2--白屏问题常见解决方案)
  - [3. 💻 demos.1](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#3--demos1)

### 9.3. 无边框窗口

- [ ] [0048. 认识无边框窗口](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#1--links)
  - [2. 📝 创建无边框窗口](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#2--创建无边框窗口)
  - [3. 📒 无边框窗口的特点](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#3--无边框窗口的特点)
  - [4. 📒 特点 - 可以自定义窗口控制按钮](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#4--特点---可以自定义窗口控制按钮)
  - [5. 📒 特点 - 可以自定义窗口的形状和样式](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#5--特点---可以自定义窗口的形状和样式)
  - [6. 📒 特点 - 需要手动实现窗口的拖拽和窗口的尺寸调整](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#6--特点---需要手动实现窗口的拖拽和窗口的尺寸调整)
  - 如何创建一个无边框窗口
  - 无边框窗口的特点
    - 了解无边框窗口的特点，如果你创建的窗口要求具备这些特性，可以考虑使用无边框窗口来实现。
- [ ] [0018. 创建一个无边框窗口](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#3--demo)
  - 创建无边框窗口 frame: false
  - 无边框窗口的特点
- [ ] [0019. 让无边框的窗口可以被拖拽](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#3--demo)
  - 通过 css 来解决无边框的窗口的拖拽问题
- [ ] [0020. macos 隐藏窗口标题栏但是不隐藏交通灯](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md)
  - [1. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md#1--demo)
  - 只需要调整 BrowserWindow 的配置即可实现在 macos 中隐藏窗口标题栏但是不隐藏交通灯，并且可以微调交通灯的位置。

### 9.4. 窗口层级

- [ ] [0017. 窗口置顶](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#2--demo)
  - 本文介绍了两种使窗口置顶的方式，以及它们之间的一些区别。
  - 做法 1：在 new BrowserWindow 的时候，丢一个配置项 `alwaysOnTop: true` 进去，暴力置顶。
  - 做法 2：通过 BrowserWindow 实例 win 的 `setAlwaysOnTop` 方法实现置顶，可以进行更细粒度的控制置顶的层级。

## 10. 菜单

### 10.1. 不同系统的菜单适配

- [ ] [0010. macos 应用菜单第一项的问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#2--links)
  - [3. 💻 demo1](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#3--demo1)
  - [4. 💻 demo2](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#4--demo2)
  - [5. 🤔 问：在 macos 中，第一项菜单的名称如何自定义呢？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#5--问在-macos-中第一项菜单的名称如何自定义呢)
  - macos 应用菜单第一项的有什么问题【demo1】
  - 如何解决 macos 应用菜单第一项的有什么问题【demo2】
  - 【demo1】介绍了 macos 应用菜单第一项的问题 —— 始终显示应用程序的名称，我们配置的 label 不生效。
  - 【demo2】介绍了让我们配置的菜单项信息能够完整展示出来的一种解决方案 —— 对 macos 特殊处理，往菜单列表中 unshift 一项内容作为第一项。
  - Q：实际开发中会存在这个问题吗？应该如何解决呢？
  - A：不存在，解决方式也很简单。
  - 在实际开发中会使用一些主流工具（比如 electron-builder）来出包，这时候 macos 菜单的第一项可以很方便地自定义配置，只需要配置 pageage.json 中的 productName 即可。
  ```json
  {
    // ...
    "productName": "xxx", // 在这里配置你的应用名称
    // ...
  }
  ```

### 10.2. 页面右键菜单

- [ ] [0012. 使用 Menu 模块实现页面中的右键菜单](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#2--demo)
  - 在页面上创建右键菜单，这是桌面端应用中很常见的一个功能点。本文的介绍了如何使用 Menu 模块来创建一个右键菜单。
  - 本节介绍如何如何使用 Menu 模块来创建一个右键菜单。这里提到的右键菜单，又称为上下文菜单，也就是你在一些应用程序的界面上，点击鼠标右键所弹出的内容。
  - ![](https://github.com/Tdahuyou/TNotes.electron/blob/main/notes/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/assets/2024-10-06-01-24-36.png?raw=true)

### 10.3. Dock 菜单

- [ ] [0009. 设置 macos 的 Dock 菜单](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#1--links)
  - [2. 📒 Dock 菜单是什么](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#2--dock-菜单是什么)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#3--demo)
  - 如何通过 Menu 模块来创建 macos 上的 Dock 菜单

### 10.4. 自定义菜单

- [ ] [0011. 自定义系统菜单覆盖默认菜单问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#1--links)
  - [2. 📒菜单项冲突问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#2-菜单项冲突问题)
  - [3. 📒如何解决冲突问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#3-如何解决冲突问题)
  - [4. 💻 demo1 - 手写调试工具切换的触发逻辑](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#4--demo1---手写调试工具切换的触发逻辑)
  - [5. 💻 demo2 - 使用预设的 role 来快速配置菜单项](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#5--demo2---使用预设的-role-来快速配置菜单项)
  - [6. 🤔 问：role 是什么？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#6--问role-是什么)
  - 自定义系统菜单和默认菜单的冲突问题是什么
  - 如何解决冲突问题

### 10.5. Tray 菜单

- [ ] [0025. 创建 macos 应用托盘（Tray）](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#1--links)
  - [2. 📒核心模块概述](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#2-核心模块概述)
  - [3. 📒托盘图标](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#3-托盘图标)
  - [4. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#4--demo)
  - [5. 🤔 问：Tray 是 macOS 特有的吗？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#5--问tray-是-macos-特有的吗)
  - 如何创建托盘 Tray 菜单

## 11. app

### 11.1. 路径

- [ ] [0024. 通过 app 模块获取应用相关路径](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#1--links)
  - [2. 📒 `app.getPath(name)`](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#2--appgetpathname)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#3--demo)
  - `app.getPath(name)` 的基本使用
  - 本文介绍了通过 app 模块中的 app.getPath 方法来获取应用程序的相关路径。其中很多路径在都是很重要的，不要再使用 nodejs 去组装这些路径信息了，现尝试到 app.getPath 中找找看有没有现成的。

## 12. 快捷键

### 12.1. 页面级别

- [ ] [0023. 页面级别的快捷键](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#2--demo)
  - 本节通过一个很简单的 demo，介绍如何实现页面级别的快捷方式。
  - 全局快捷键可以使用 Electron 提供的模块 globalShortcut 来实现，这是一个主进程模块。但是，就文档中要求的页面级别的快捷方式，完全可以使用原生的 Web API `window.onkeydown = function(e) { ... }` 来实现。

### 12.2. 全局级别

- [ ] [0022. 全局级别的快捷键](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md)
  - [1. 🔗 globalShortcut](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#1--globalshortcut)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#2--demo)
  - 学习如何注册全局（系统）级别的快捷方式
  - 全局级别的快捷键，也称系统级别的快捷键，这玩意儿在很多桌面应用程序中多多少少都会有一些。对于一些常用的操作和交互行为，绑定好快捷键，还是蛮必要的。
  - globalShortcut 是一个主进程中的模块，其作用是 在应用程序没有键盘焦点时，监听键盘事件。
  - Q：什么叫“应用程序没有键盘焦点”？
  - A：就是你当前鼠标点击的位置并非该应用，焦点不在这个应用身上。

## 13. 剪切板

- [ ] [0021. 使用 clipboard 模块向系统剪切板中读写文本](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#2--demo)
  - 该笔记 clipboard 基本使用
  - clipboard 是一个很常用也狠使用的模块，用于读写系统的剪切板。这篇文档介绍它的基本使用，实现剪切板的读写操作。

## 14. 系统通知

- [ ] [0026. 使用 Notification 模块弹出系统消息](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#2--demo)
  - 如何使用 Notification 弹出系统通知
  - 这个 demo 使用 electron 的内置模块 Notification 实现了一个简单的 demo，最终效果仅仅是将系统消息给展示出来，没有加其它多余的交互逻辑。

## 15. 桌面视频流

- [ ] [0029. 实现屏幕监听功能](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#1--links)
  - [2. 📒`navigator.mediaDevices.getUserMedia()` 的 video 配置结构问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#2-navigatormediadevicesgetusermedia-的-video-配置结构问题)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#3--demo)
  - 这是参照官方示例实现一个屏幕实时监听的 demo。
- [ ] [0028. 模拟截图功能](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#2--demo)
  - 使用 Electron 并结合传统的前端技术来实现一个截图应用
  - 这篇文档是作者 [mowuu](https://github.com/muwoo) 使用 Electron 内置模块结合前端技术 canvas 写的一个截图工具示例。
  - demo 的核心逻辑简单了解了个大概，屏幕数据的获取使用的是 desktopCapture，页面上的图像最终是使用 canvas 来绘制的。实测在高分辨率的设备下截图效果异常模糊，几乎处于不可用的状态。
  - 临时结论：使用 Electron 内置的原生模块来模拟截图效果，可以说几乎是不可用的。后续找时间去 github 搜一下看看其它解决方案。
- [ ] [0049. desktopCapturer 简介](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md)
  - [1. 🔗 desktopCapturer 相关链接](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#1--desktopcapturer-相关链接)
  - [2. 📒 desktopCapturer 是什么](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#2--desktopcapturer-是什么)
  - [3. 📒 desktopCapturer 的基本使用流程](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#3--desktopcapturer-的基本使用流程)
  - desktopCapturer 是什么
  - desktopCapturer 的基本使用流程
  - desktopCapturer 这是主进程中的一个模块，是一个用于处理桌面视频流（你可以理解为就是你眼睛看到的显示屏上的画面数据）的 API。

## 16. 插件化

- [ ] [0014. 使用 BrowserView 加载外部资源](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#1--视频)
  - [2. ⏰ TODO 为啥 BrowserView 被废弃掉了](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#2--todo-为啥-browserview-被废弃掉了)
  - [3. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#3--links)
  - [4. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#4--demo)
  - 如何使用 BrowserView 加载外部资源
  - 这个 demo 使用 BrowserView 模块来加载第三方资源（掘金主页）到渲染进程的页面上。
- [ ] [0013. 基于 BrowserView 实现插件化能力](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#2--links)
  - [3. 💻 demo - BrowserView 实现插件化](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#3--demo---browserview-实现插件化)
  - 基于 BrowserView 实现插件化能力
  - 该 demo 模拟了使用 BrowserView 模块来加载第三方资源并注入 preload 脚本，使其具备原生能力。

### 16.1. 集成浏览器插件

- 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。
- [ ] [0006. 使用 vue-remote-devtools](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#3--demo)
  - 介绍 vue-remote-devtools 的基本使用
  - 本文介绍如何让基于 Electron 搭建的 Vue 工程，能够远程地使用 Vue 调试工具。本节介绍的其实是一个通用的法子，那些在非浏览器环境下搭建的 Vue 工程，如果想要使用 vue-devtools 的能力，都可以参考文中提到的这种方式。
  - 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。
- [ ] [0007. 使用手动安装的方式集成 vue-devtools](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#2--demo)
  - 如何通过 session 模块在 Electron 工程中集成 vue-devtools
- [ ] [0005. 使用 electron-devtools-installer 安装 vue-devtools](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#2--demo)
  - 按照官方提供的示例试了一下，最终结果是：**没能安装成功**。
  - 如果不是自己写的测试用例有误，那就是 electron-devtools-installer 这个包过时了。
- [ ] [0008. 使用自动安装的方式集成 vue-devtools](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#2--demo)
  - [3. 📒 如何获取 VUE_DEVTOOLS_ID](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#3--如何获取-vue_devtools_id)
  - 如何根据插件 ID 自动下载 chrome 插件源码 `downloadChromeExtension.js`
  - 本文基于 electron-devtools-installer 中的下载 chrome 插件的逻辑，封装了一个 downloadChromeExtension.js 模块，在 electron.0007 的基础上，实现自动安装插件的功能。
  - 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。

## 17. 其它功能

### 17.1. webContents startDrag 原生文件拖放

- [ ] [0027. 原生文件拖 & 放](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#2--links)
  - [3. 📒本文要实现一个什么样的效果](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#3-本文要实现一个什么样的效果)
  - [4. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#4--demo)
  - 原生文件拖 & 放是什么
  - 如何实现原生文件拖 & 放效果
    - 从视频的 0:50～2:30 开始展示最终的效果，可以从这开始看，快速了解下本节要实现的效果。

## 18. 第三方库

### 18.1. electron-reload

- [ ] [0031. 使用 electron-reload 实现热更](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md)
  - [1. 📺 视频](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#1--视频)
  - [2. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#3--demo)
  - 如何使用 electron-reload 实现热更
  - 使用 electron-reload 监听主进程和渲染进程内容的变更，一旦内容变化，就自动重启 electron。
  - 额，这功能确实有点儿用，不过感觉也是可有可无，因为手动启动的成本也不算太高。

### 18.2. electron-builder

- [ ] [0030. 使用 electron-icon-builder、electron-builder 解决应用打包后的图标问题](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md)
  - [1. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#1--demo)
  - [2. 📒electron, electron-builder, 和 electron-icon-builder 应该安装为开发依赖还是生产依赖呢？](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#2-electron-electron-builder-和-electron-icon-builder-应该安装为开发依赖还是生产依赖呢)
  - 使用 electron-icon-builder 处理应用图标
  - 使用 electron-builder 出包

## 19. 小练习

### 19.1. 桌面时钟

- [ ] [0032. 实现一个桌面时钟](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#1--links)
  - [2. 📒](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#2-)
  - [3. 💻 demo](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#3--demo)
  - 手写一个简单的桌面时钟摆件
  - 最终效果：
    - ![](https://github.com/Tdahuyou/TNotes.electron/blob/main/notes/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/assets/2024-10-13-21-41-11.png?raw=true)
- [ ] [0056. 实现一个桌面时钟-2](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md)
  - [1. 📒 demo 功能简介](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#1--demo-功能简介)
  - [2. 📒 编写这个 demo 的初衷](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#2--编写这个-demo-的初衷)
  - [3. 📒 启动 `npm start` 和出包 `npm run build`](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#3--启动-npm-start-和出包-npm-run-build)
  - [4. 📒 图标背景色 `#9feaf9`](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#4--图标背景色-9feaf9)
  - 从 0 到 1 实现一个简易的桌面时钟应用。
  - 一共没几行代码，直接看 src 下边的源码即可。
  - 在 0032 也练习了一个桌面时钟的应用，0032 是一个桌面时钟摆件，展示效果是以钟表形式来呈现的。

### 19.2. 微信读书助手

- [ ] [0044. weread-helper](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0044.%20weread-helper/README.md)
  - [1. 🔗 links](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0044.%20weread-helper/README.md#1--links)
  - [2. 📒Quick Start](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0044.%20weread-helper/README.md#2-quick-start)
  - 套壳了微信读书的网页版，并注入了一些自定义脚本。

### 19.3. 自动定时截图工具

- [ ] [0033. ScreenCaptureApp](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0033.%20ScreenCaptureApp/README.md)
  - demo - 自动截图程序
  - 目前在测试 nodejs 的第三方库，看下是否能够支持实现定时定区域自动截图的功能，如果表现良好，可以考虑将其集成到 electron 中，出一个桌面端的自动截图工具。
  - 应用场景：看外文视频的时候，自动定时截字幕。
  - 功能：
    - 定时截图
    - 定区域截图
    - ORC 识别（识别字幕，去重）
