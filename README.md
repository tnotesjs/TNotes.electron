# electron

<!-- region:toc -->
- [electron](#electron)
  - [1. electron 笔记内容简介](#1-electron-笔记内容简介)
  - [2. electron 概述](#2-electron-概述)
  - [3. electron 的一些学习资源](#3-electron-的一些学习资源)
    - [3.1. electron 书籍](#31-electron-书籍)
    - [3.2. electron 掘金小册](#32-electron-掘金小册)
  - [4. 认识 electron](#4-认识-electron)
    - [4.1. electron 都能用来开发什么类型的应用程序？](#41-electron-都能用来开发什么类型的应用程序)
    - [4.2. 了解 electron 的核心概念](#42-了解-electron-的核心概念)
  - [5. 打通主进程和渲染进程](#5-打通主进程和渲染进程)
    - [5.1. 上下文桥接 contextBridge](#51-上下文桥接-contextbridge)
    - [5.2. IPC 基础](#52-ipc-基础)
      - [5.2.1. 认识 IPC 相关模块](#521-认识-ipc-相关模块)
      - [5.2.2. 渲染进程 -> 主进程](#522-渲染进程---主进程)
      - [5.2.3. 主进程 -> 渲染进程](#523-主进程---渲染进程)
      - [5.2.4. 渲染进程 <-> 主进程](#524-渲染进程---主进程)
    - [5.3. IPC 进阶](#53-ipc-进阶)
      - [5.3.1. 渲染进程 <-> 渲染进程](#531-渲染进程---渲染进程)
      - [5.3.2. MessageChannel](#532-messagechannel)
  - [6. 窗口](#6-窗口)
    - [6.1. 不同系统的窗口行为兼容适配](#61-不同系统的窗口行为兼容适配)
    - [6.2. 窗口首次加载的白屏问题](#62-窗口首次加载的白屏问题)
    - [6.3. 无边框窗口](#63-无边框窗口)
    - [6.4. 窗口层级](#64-窗口层级)
  - [7. 菜单](#7-菜单)
    - [7.1. 不同系统的菜单适配](#71-不同系统的菜单适配)
    - [7.2. 页面右键菜单](#72-页面右键菜单)
    - [7.3. Dock 菜单](#73-dock-菜单)
    - [7.4. 自定义菜单](#74-自定义菜单)
    - [7.5. Tray 菜单](#75-tray-菜单)
  - [8. app](#8-app)
    - [8.1. 路径](#81-路径)
  - [9. 快捷键](#9-快捷键)
    - [9.1. 页面级别](#91-页面级别)
    - [9.2. 全局级别](#92-全局级别)
  - [10. 剪切板](#10-剪切板)
  - [11. 系统通知](#11-系统通知)
  - [12. 桌面视频流](#12-桌面视频流)
  - [13. 插件化](#13-插件化)
    - [13.1. 集成浏览器插件](#131-集成浏览器插件)
  - [14. 其它功能](#14-其它功能)
    - [14.1. webContents startDrag 原生文件拖放](#141-webcontents-startdrag-原生文件拖放)
  - [15. 第三方库](#15-第三方库)
    - [15.1. electron-reload](#151-electron-reload)
    - [15.2. electron-builder](#152-electron-builder)
  - [16. 小练习](#16-小练习)
    - [16.1. 桌面时钟](#161-桌面时钟)
    - [16.2. 微信读书助手](#162-微信读书助手)
    - [16.3. 自动定时截图工具](#163-自动定时截图工具)
  - [17. 📺 bilibili](#17--bilibili)
<!-- endregion:toc -->

## 1. electron 笔记内容简介

- [ ] [0060. electron 笔记仓库介绍](https://github.com/Tdahuyou/electron/tree/main/0060.%20electron%20%E7%AC%94%E8%AE%B0%E4%BB%93%E5%BA%93%E4%BB%8B%E7%BB%8D/README.md) <!-- [locale](./0060.%20electron%20%E7%AC%94%E8%AE%B0%E4%BB%93%E5%BA%93%E4%BB%8B%E7%BB%8D/README.md) -->  
  - 该仓库 https://github.com/Tdahuyou/electron 存放的是个人的 electron 学习笔记，有需要的可自行 clone。
  - https://tdahuyou.github.io/notes/
    - 这是个人的笔记博客，汇总个人写的一些笔记内容，以便查阅。
  
  
  
  
  
  
  

- [ ] [0059. bilibili 视频播放链接](https://github.com/Tdahuyou/electron/tree/main/0059.%20bilibili%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%93%BE%E6%8E%A5/README.md) <!-- [locale](./0059.%20bilibili%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%93%BE%E6%8E%A5/README.md) -->  
  - https://www.bilibili.com/video/BV1544219774
    - bilibili 视频播放链接
  - 视频内容及更新说明
    - **根据编号定位**：B 站上仅录制了一小部分的视频，可以根据编号来定位笔记和视频。
    - **不定期更新**：结合实际情况，会不定期更新笔记和视频。
    - **内容**：视频内容主要是展示一些 demo 效果，并附带简单的说明，大部分视频的时长均在 10min 左右，在查看具体笔记时若有疑问，可查阅视频作为一个参考。
  
  
  
  
  
  
  
  
  

## 2. electron 概述

- [ ] [0057. electron 源码仓库](https://github.com/Tdahuyou/electron/tree/main/0057.%20electron%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93/README.md) <!-- [locale](./0057.%20electron%20%E6%BA%90%E7%A0%81%E4%BB%93%E5%BA%93/README.md) -->  
  - https://github.com/electron/electron
    - Github electron 项目源码仓库链接
  - ⏰ 学习 electron 源码
  
  
  
  
  
  
  
  
  

- [ ] [0058. electron 官方文档](https://github.com/Tdahuyou/electron/tree/main/0058.%20electron%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/README.md) <!-- [locale](./0058.%20electron%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/README.md) -->  
  - https://www.electronjs.org/
    - 这是 Electron 的官网链接，可以说是除了源码之外最权威的 Electron 内容了。官网有中文版，翻译得非常友好。
    - ![](https://raw.githubusercontent.com/Tdahuyou/electron/main/0058.%20electron%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3/assets%2F2024-10-05-19-22-00.png)
  - ⏰ 记录查阅官方文档的经验
  - ⏰ 官方文档内容概述
  - ⏰ 官方文档基本结构介绍
  
  
  
  
  
  
  
  
  

## 3. electron 的一些学习资源

### 3.1. electron 书籍

- [ ] [0050. 《Electron 实战：入门、进阶与性能优化》](https://github.com/Tdahuyou/electron/tree/main/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md) <!-- [locale](./0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md) -->  
  

  - [bilibili.electron.0050.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 📝 备注](https://github.com/Tdahuyou/electron/tree/main/0050.%20%E3%80%8AElectron%20%E5%AE%9E%E6%88%98%EF%BC%9A%E5%85%A5%E9%97%A8%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E3%80%8B/README.md#1--备注)
  

### 3.2. electron 掘金小册

- [ ] [0051. 掘金小册 - 《Electron 应用开发实践指南》](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md) <!-- [locale](./0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md) -->  
  - [1. 🔗 个人推广链接](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#1--个人推广链接)
  - [2. 🔗 rubick](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#2--rubick)
  - [3. 📒 rubick 简介](https://github.com/Tdahuyou/electron/tree/main/0051.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5%E6%8C%87%E5%8D%97%E3%80%8B/README.md#3--rubick-简介)
  - 《Electron 应用开发实践指南》 这本小册的作者，是开源项目 [rubick](https://github.com/rubickCenter/rubick) 的作者。
  

- [ ] [0053. 掘金小册 - 《Electron + Vue 3 桌面应用开发》](https://github.com/Tdahuyou/electron/tree/main/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md) <!-- [locale](./0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md) -->  
  - [1. 🔗 个人推广链接](https://github.com/Tdahuyou/electron/tree/main/0053.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20Vue%203%20%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E3%80%8B/README.md#1--个人推广链接)
  - 《Electron + Vue 3 桌面应用开发》 这本小册的作者就是 electron.0050. 《Electron 实战：入门、进阶与性能优化》 这本书的作者“刘晓伦”。
  

- [ ] [0054. 掘金小册 - 《Electron + React 从 0 到 1 实现简历平台实战》](https://github.com/Tdahuyou/electron/tree/main/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md) <!-- [locale](./0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md) -->  
  - [1. 🔗 个人推广链接](https://github.com/Tdahuyou/electron/tree/main/0054.%20%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%20-%20%E3%80%8AElectron%20%2B%20React%20%E4%BB%8E%200%20%E5%88%B0%201%20%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8E%86%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%88%98%E3%80%8B/README.md#1--个人推广链接)
  - 《Electron + React 从 0 到 1 实现简历平台实战》 这一本小册还没购买，其它的跟 electron 相关的都已经购买了，并阅读了一部分，也都还没读完，后续学习的时候会顺带着将相关的知识点整理到当前的笔记仓库中。
  

- [ ] [0055. WebStudyBooks 免费的前端掘金小册](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md) <!-- [locale](./0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md) -->  
  - [1. 🔗 WebStudyBooks 相关链接](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#1--webstudybooks-相关链接)
  - [2. 📒 注意一些可能存在的问题](https://github.com/Tdahuyou/electron/tree/main/0055.%20WebStudyBooks%20%E5%85%8D%E8%B4%B9%E7%9A%84%E5%89%8D%E7%AB%AF%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C/README.md#2--注意一些可能存在的问题)
  - 介绍了一个 github 仓库 [WebStudyBooks](https://github.com/zhaoxinkun/WebStudyBooks)，这里边存放了一些作者上传的掘金小册的压缩包，可以免费获取。
  - 介绍了阅读这些内容可能存在的一些问题。
  

## 4. 认识 electron

### 4.1. electron 都能用来开发什么类型的应用程序？

- [ ] [0052. Electron Showcase](https://github.com/Tdahuyou/electron/tree/main/0052.%20Electron%20Showcase/README.md) <!-- [locale](./0052.%20Electron%20Showcase/README.md) -->  
  - [1. 📒Electron Showcase 简介](https://github.com/Tdahuyou/electron/tree/main/0052.%20Electron%20Showcase/README.md#1-electron-showcase-简介)
  - 本节介绍了一下 **Electron Showcase** 是什么。
  

### 4.2. 了解 electron 的核心概念

- [x] [0001. Electron 应用的最小组成](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md) <!-- [locale](./0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md) -->  
  

  - [bilibili.electron.0001.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#1--links)
  - [2. 📒 electron 应用的最小组成](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#2--electron-应用的最小组成)
  - [3. 📒 最终效果展示](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#3--最终效果展示)
  - [4. 💻 demo - 实现步骤](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#4--demo---实现步骤)
    - [4.1. 安装 Node.js 和 npm](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#41-安装-nodejs-和-npm)
    - [4.2. 安装 Electron](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#42-安装-electron)
    - [4.3. 准备入口文件（主进程）](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#43-准备入口文件主进程)
    - [4.4. 准备页面（渲染进程，非必需）](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#44-准备页面渲染进程非必需)
    - [4.5. 配置启动命令（非必需）](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#45-配置启动命令非必需)
    - [4.6. 启动 Electron 应用](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#46-启动-electron-应用)
  - [5. 🤔 问：主进程加载的入口文件是？](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md#5--问主进程加载的入口文件是)
  - 实现一个 demo - 从 0 到 1 搭建一个 hello world 应用
    - 知道 Electron 应用的最小组成，要求能够做到快速搭建一个简单的 Electron 学习环境，全程耗时控制在 1min ~ 3min（不算下载依赖耗时）实现一个小 demo，为接下来的 Electron 相关知识点的学习做准备。
  - 本节内容，主要就是仨文件：
    - package.json 指定入口
    - index.js 主进程
    - index.html 渲染进程（非必需）
  

- [ ] [0045. Electron 核心概念](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md) <!-- [locale](./0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md) -->  
  - [1. 🔗 链接](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#1--链接)
  - [2. 💡 导图](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#2--导图)
  - [3. 📝 Electron 架构](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#3--electron-架构)
  - [4. 📝 主进程 vs. 渲染进程](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#4--主进程-vs-渲染进程)
    - [4.1. 数量差异](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#41-数量差异)
    - [4.2. 作用差异](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#42-作用差异)
    - [4.3. 模块差异](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#43-模块差异)
  - [5. 📝 contextBridge](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#5--contextbridge)
    - [5.1. `contextIsolation` 是什么](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#51-contextisolation-是什么)
    - [5.2. `contextIsolation` 工作原理](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#52-contextisolation-工作原理)
    - [5.3. 为什么要使用 `contextIsolation`](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#53-为什么要使用-contextisolation)
    - [5.4. 如何配置 `contextIsolation`](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#54-如何配置-contextisolation)
    - [5.5. 小结](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#55-小结)
  - [6. 📝 contextBridge 上下文桥接](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#6--contextbridge-上下文桥接)
    - [6.1. `contextBridge` 是什么](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#61-contextbridge-是什么)
    - [6.2. `contextBridge` 工作原理](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#62-contextbridge-工作原理)
    - [6.3. `contextBridge` 基本使用](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#63-contextbridge-基本使用)
  - [7. 🤔 问：渲染进程中的 remote 模块是？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#7--问渲染进程中的-remote-模块是)
  - [8. 🤔 问：Electron 中的渲染进程也是网页，那么它和我们在浏览器中开发的网页有何区别？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#8--问electron-中的渲染进程也是网页那么它和我们在浏览器中开发的网页有何区别)
  - [9. 🤔 问：IPC 通信是什么？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#9--问ipc-通信是什么)
  - [10. 🤔 问：为什么需要 IPC 通信呢？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#10--问为什么需要-ipc-通信呢)
  - [11. 🤔 问：为什么 Electron 要将主进程和渲染进程分开呢？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#11--问为什么-electron-要将主进程和渲染进程分开呢)
  - [12. 🤔 问：主进程向渲染进程发消息，是向页面发吗？](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#12--问主进程向渲染进程发消息是向页面发吗)
  - [13. 🤔 问：为什么要使用 `contextBridge`](https://github.com/Tdahuyou/electron/tree/main/0045.%20Electron%20%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5/README.md#13--问为什么要使用-contextbridge)
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
  

## 5. 打通主进程和渲染进程

### 5.1. 上下文桥接 contextBridge

- [ ] [0002. 使用 contextBridge 暴露 API 给渲染进程](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md) <!-- [locale](./0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md#2--demo)
  - 学会在开启 `contextIsolation` 的情况下，使用 `contextBridge` 来给渲染进程暴露 Electron API，使用系统的原生能力。
  

### 5.2. IPC 基础

#### 5.2.1. 认识 IPC 相关模块

- [ ] [0046. 认识 IPC 相关模块](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md) <!-- [locale](./0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#1--links)
  - [2. 💡 导图](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#2--导图)
  - [3. 📒 electron doc - 进程间通信教程](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#3--electron-doc---进程间通信教程)
  - [4. 📒 send vs. sendSync](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#4--send-vs-sendsync)
    - [4.1. send、sendSync 是什么](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#41-sendsendsync-是什么)
    - [4.2. 同步 vs. 异步](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#42-同步-vs-异步)
    - [4.3. 返回值](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#43-返回值)
    - [4.4. 看看官方建议](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#44-看看官方建议)
  - [5. 📒 send vs. invoke](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#5--send-vs-invoke)
    - [5.1. 先给出结论](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#51-先给出结论)
    - [5.2. 场景 - 双向通信](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#52-场景---双向通信)
    - [5.3. 场景 - 单向通信](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#53-场景---单向通信)
  - [6. 🤔 问：使用 send 来实现单向通信能减少开销提高性能？](https://github.com/Tdahuyou/electron/tree/main/0046.%20%E8%AE%A4%E8%AF%86%20IPC%20%E7%9B%B8%E5%85%B3%E6%A8%A1%E5%9D%97/README.md#6--问使用-send-来实现单向通信能减少开销提高性能)
  - 把官方教程中提到的 IPC 通信模式刷一遍
  - 认识用于实现 IPC 通信的模块 ipcMain、ipcRenderer
  - send 和 sendSync 之间的一些差异（这俩 API “已过时”）
  - invoke 比 send 好在哪
  

#### 5.2.2. 渲染进程 -> 主进程

- [ ] [0037. 使用 ipcRenderer.send、ipcMain.on 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0037.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0037.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--demo)
  

- [ ] [0035. 使用 ipcRenderer.invoke、ipcMain.handle 实现从渲染进程到主进程的单向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0035.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0035.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%BB%8E%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%88%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%8D%95%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--demo)
  

#### 5.2.3. 主进程 -> 渲染进程

- [ ] [0043. 主进程通过 BrowserWindow 实例的 webContents.send 方法主动给指定的渲染进程发消息](https://github.com/Tdahuyou/electron/tree/main/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md) <!-- [locale](./0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md) -->  
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0043.%20%E4%B8%BB%E8%BF%9B%E7%A8%8B%E9%80%9A%E8%BF%87%20BrowserWindow%20%E5%AE%9E%E4%BE%8B%E7%9A%84%20webContents.send%20%E6%96%B9%E6%B3%95%E4%B8%BB%E5%8A%A8%E7%BB%99%E6%8C%87%E5%AE%9A%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E5%8F%91%E6%B6%88%E6%81%AF/README.md#1--demo)
  - 直接看 demo
  

#### 5.2.4. 渲染进程 <-> 主进程

- [ ] [0038. 使用 ipcRenderer.send、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0038.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0038.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.send%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--demo)
  

- [ ] [0039. 使用 ipcRenderer.sendSync、ipcMain.on 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0039.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0039.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.sendSync%E3%80%81ipcMain.on%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--demo)
  - 通过对比 `ipcRenderer.send`、`ipcRenderer.sendSync` 来熟悉 `sendSync` API 的一些特点和基本用法。
  - 注意：ipcRenderer.sendSync 非必要，不建议使用。
  

- [ ] [0036. 使用 ipcRenderer.invoke、ipcMain.handle 实现主进程和渲染进程之间的双向 IPC 通信](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md) -->  
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0036.%20%E4%BD%BF%E7%94%A8%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8F%8C%E5%90%91%20IPC%20%E9%80%9A%E4%BF%A1/README.md#1--demo)
  - 渲染进程通过 ipcRenderer.invoke 给主进程发送消息，可以通过 await 来等待主进程响应，并获取到主进程的处理结果。主进程通过 ipcMain.handle 来接受来自渲染进程的消息，通过 return xxx 的写法给渲染进程响应处理结果。以此来实现从渲染进程到主进程的双向通信。
  - 本文介绍的这种通信方式，是官方推荐的做法，也是目前比较主流的写法。
  

### 5.3. IPC 进阶

#### 5.3.1. 渲染进程 <-> 渲染进程

- [ ] [0047. 分析渲染进程之间的通信](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) -->  
  - [1. 🔗 官方文档 > Electron 中的消息端口](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#1--官方文档--electron-中的消息端口)
  - [2. 📒 错误做法 ❌](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#2--错误做法-)
  - [3. 📒 主进程转发消息](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#3--主进程转发消息)
  - [4. 📒 主进程转发 ID](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#4--主进程转发-id)
  - [5. 📒 走消息端口](https://github.com/Tdahuyou/electron/tree/main/0047.%20%E5%88%86%E6%9E%90%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#5--走消息端口)
  - 主进程转发消息
  - 主进程转发 ID
  - 消息端口
  - 通过笔记中的时序图来介绍了两个渲染进程之间通信的一种方式 —— 借助主进程来转发消息。
  - 相关实现示例，见后续文档中对应的 demo。
  - 这篇笔记中画的几张图，在后续的 demo 的视频介绍中有被反复提及。
  

- [ ] [0042. 通过主进程转发消息的方式实现两个渲染进程之间互相通信](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0042.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 💻 demo1](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--demo1)
  - [2. 💻 demo2](https://github.com/Tdahuyou/electron/tree/main/0042.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E7%9A%84%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--demo2)
  - 理解 demo1 的写法存在的问题
  - 理解 demo2 的实现原理
  - 一共有 2 个 demo，其中 demo1 的写法是存在一些问题的，demo2 对 demo1 的问题进行了处理。
  - 类似于 demo2 的效果，在工作中实践过，使用起来感觉没啥问题，还 OK。需要注意的是 channel 的语义化，如果 channel 的数量比较多，那么可以尝试通过一些特殊的自定义命名规则来区分哪些 channel 是用于在两个渲染进程之间互相通信的。当然，除了通过自定义命名规范来区分，还可以单独写一个全局对象来存储 channel，比如 `CHANNEL_LIST.r2r.xxx`、`CHANNEL_LIST.r2m.xxx`、`CHANNEL_LIST.m2r.xxx`。
  

- [ ] [0041. 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0041.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/README.md#2--demo)
  - 本文介绍了两个渲染进程之间实现互相通信的一种方式 —— 通过主进程获取另一个渲染进程的 ID 来实现两个渲染进程之间的通信。
  - 本文介绍的这种通信方式需要依赖 ipcRenderer 模块中的 ipcRenderer.sendTo方法，这个方法在 Electron 的 v28 版本中已经被丢弃了，如果要使用这种通信方案的话，需要注意 Electron 的版本问题。
  - 这种方式在最新版的 Electron 中已经被淘汰了。
  
  ![](https://raw.githubusercontent.com/Tdahuyou/electron/main/0041.%20%E9%80%9A%E8%BF%87%E4%B8%BB%E8%BF%9B%E7%A8%8B%E8%8E%B7%E5%8F%96%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84%20ID%20%E6%9D%A5%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/assets%2F2024-10-05-22-05-41.png)
  

- [ ] [0040. 使用 MessagePort 实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  

  - [bilibili.electron.0040.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0040.%20%E4%BD%BF%E7%94%A8%20MessagePort%20%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--demo)
  - 如何使用 MessagePort 来实现两个渲染进程之间的相互通信
  

- [ ] [0034. 仿观察者模式实现两个渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--links)
  - [2. 💡 导图](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#2--导图)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0034.%20%E4%BB%BF%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E4%B8%A4%E4%B8%AA%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#3--demo)
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
  

#### 5.3.2. MessageChannel

- [ ] [0004. 使用 web api MessageChannel 实现主进程和渲染进程之间的互相通信](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) <!-- [locale](./0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md) -->  
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0004.%20%E4%BD%BF%E7%94%A8%20web%20api%20MessageChannel%20%E5%AE%9E%E7%8E%B0%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%92%E7%9B%B8%E9%80%9A%E4%BF%A1/README.md#1--demo)
  - 介绍如何使用 web api 来实现 IPC 通信
  - 主进程有 MessageChannelMain 模块，渲染进程可以使用 Web API MessageChannel。
  - 用哪个模块都可以实现通信的效果，差异是通信的端口是在主进程生产还是在渲染进程生产。
  

- [ ] [0003. 比较消息端口 MessageChannel 和 ipcRenderer.invoke、ipcMain.handle 的性能](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md) <!-- [locale](./0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md) -->  
  

  - [bilibili.electron.0003.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 💻 demo - MessageChannel vs. ipcRenderer.invoke、ipcMain.handle](https://github.com/Tdahuyou/electron/tree/main/0003.%20%E6%AF%94%E8%BE%83%E6%B6%88%E6%81%AF%E7%AB%AF%E5%8F%A3%20MessageChannel%20%E5%92%8C%20ipcRenderer.invoke%E3%80%81ipcMain.handle%20%E7%9A%84%E6%80%A7%E8%83%BD/README.md#1--demo---messagechannel-vs-ipcrendererinvokeipcmainhandle)
  - 本文通过一个 Electron 应用示例对比了 `MessageChannel` 和 `ipcRenderer.invoke`/`ipcMain.handle` 两种 IPC 通信方式的性能，结果显示在单向通信中两者差异不大，但在双向通信中 `MessageChannel` 的性能明显优于 `ipcRenderer.invoke`。
  - 这篇文档写了一个 demo 来比较两种 IPC 通信方式的性能差异。
  - 该 demo 仅仅作为一个参考，实际需求往往会更加复杂，比如通信过程中会携带大量数据。本 demo 的测试用例比较简单，仅仅是传递一个写死的字符串。
  - 建议先读源码，再看视频的后半段测试结果演示。从最终表现出来的结果来看，单向通信几乎没差，但如果是双向通信的话，MessageChannel 比 invoke 快了 3～5 倍。
  

## 6. 窗口

### 6.1. 不同系统的窗口行为兼容适配

- [ ] [0016. 适配 Windows 和 macOS 上的窗口交互行为](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md) <!-- [locale](./0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#1--links)
  - [2. 📒 macos 上特有的 window-all-closed、activate 事件](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#2--macos-上特有的-window-all-closedactivate-事件)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0016.%20%E9%80%82%E9%85%8D%20Windows%20%E5%92%8C%20macOS%20%E4%B8%8A%E7%9A%84%E7%AA%97%E5%8F%A3%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA/README.md#3--demo)
  - 理解 Windows 和 macOS 的桌面应用，在窗口交互行为上的一些差异。
  - 处理逻辑很简单，重点在于理解两种系统中窗口交互的一些差异点。
  

### 6.2. 窗口首次加载的白屏问题

- [ ] [0015. 等 ready-to-show 事件触发后再显示窗口以解决窗口白屏问题](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0015.%20%E7%AD%89%20ready-to-show%20%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E5%90%8E%E5%86%8D%E6%98%BE%E7%A4%BA%E7%AA%97%E5%8F%A3%E4%BB%A5%E8%A7%A3%E5%86%B3%E7%AA%97%E5%8F%A3%E7%99%BD%E5%B1%8F%E9%97%AE%E9%A2%98/README.md#2--demo)
  - 白屏问题是很经典的一个常见问题，处理方案：
    - 优先展示主题色的全屏背景
    - 使用骨架屏
    - 等一切就绪再 show【本文介绍的方法】
  

### 6.3. 无边框窗口

- [ ] [0048. 认识无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) <!-- [locale](./0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#1--links)
  - [2. 📝 创建无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#2--创建无边框窗口)
  - [3. 📒 无边框窗口的特点](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#3--无边框窗口的特点)
  - [4. 📒 特点 - 可以自定义窗口控制按钮](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#4--特点---可以自定义窗口控制按钮)
  - [5. 📒 特点 - 可以自定义窗口的形状和样式](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#5--特点---可以自定义窗口的形状和样式)
  - [6. 📒 特点 - 需要手动实现窗口的拖拽和窗口的尺寸调整](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#6--特点---需要手动实现窗口的拖拽和窗口的尺寸调整)
  - 如何创建一个无边框窗口
  - 无边框窗口的特点
    - 了解无边框窗口的特点，如果你创建的窗口要求具备这些特性，可以考虑使用无边框窗口来实现。
  

- [ ] [0018. 创建一个无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) <!-- [locale](./0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md) -->  
  

  - [bilibili.electron.0018.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0018.%20%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3/README.md#2--demo)
  - 创建无边框窗口 frame: false
  - 无边框窗口的特点
  

- [ ] [0019. 让无边框的窗口可以被拖拽](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md) <!-- [locale](./0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md) -->  
  

  - [bilibili.electron.0019.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0019.%20%E8%AE%A9%E6%97%A0%E8%BE%B9%E6%A1%86%E7%9A%84%E7%AA%97%E5%8F%A3%E5%8F%AF%E4%BB%A5%E8%A2%AB%E6%8B%96%E6%8B%BD/README.md#2--demo)
  - 通过 css 来解决无边框的窗口的拖拽问题
  

- [ ] [0020. macos 隐藏窗口标题栏但是不隐藏交通灯](https://github.com/Tdahuyou/electron/tree/main/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md) <!-- [locale](./0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md) -->  
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0020.%20macos%20%E9%9A%90%E8%97%8F%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E6%A0%8F%E4%BD%86%E6%98%AF%E4%B8%8D%E9%9A%90%E8%97%8F%E4%BA%A4%E9%80%9A%E7%81%AF/README.md#1--demo)
  - 只需要调整 BrowserWindow 的配置即可实现在 macos 中隐藏窗口标题栏但是不隐藏交通灯，并且可以微调交通灯的位置。
  

### 6.4. 窗口层级

- [ ] [0017. 窗口置顶](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md) <!-- [locale](./0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0017.%20%E7%AA%97%E5%8F%A3%E7%BD%AE%E9%A1%B6/README.md#2--demo)
  - 本文介绍了两种使窗口置顶的方式，以及它们之间的一些区别。
  - 做法 1：在 new BrowserWindow 的时候，丢一个配置项 `alwaysOnTop: true` 进去，暴力置顶。
  - 做法 2：通过 BrowserWindow 实例 win 的 `setAlwaysOnTop` 方法实现置顶，可以进行更细粒度的控制置顶的层级。
  

## 7. 菜单

### 7.1. 不同系统的菜单适配

- [ ] [0010. macos 应用菜单第一项的问题](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md) -->  
  

  - [bilibili.electron.0010.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#1--links)
  - [2. 💻 demo1](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#2--demo1)
  - [3. 💻 demo2](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#3--demo2)
  - [4. 🤔 问：在 macos 中，第一项菜单的名称如何自定义呢？](https://github.com/Tdahuyou/electron/tree/main/0010.%20macos%20%E5%BA%94%E7%94%A8%E8%8F%9C%E5%8D%95%E7%AC%AC%E4%B8%80%E9%A1%B9%E7%9A%84%E9%97%AE%E9%A2%98/README.md#4--问在-macos-中第一项菜单的名称如何自定义呢)
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
  

### 7.2. 页面右键菜单

- [ ] [0012. 使用 Menu 模块实现页面中的右键菜单](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md) <!-- [locale](./0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/README.md#2--demo)
  - 在页面上创建右键菜单，这是桌面端应用中很常见的一个功能点。本文的介绍了如何使用 Menu 模块来创建一个右键菜单。
  - 本节介绍如何如何使用 Menu 模块来创建一个右键菜单。这里提到的右键菜单，又称为上下文菜单，也就是你在一些应用程序的界面上，点击鼠标右键所弹出的内容。
  - ![](https://raw.githubusercontent.com/Tdahuyou/electron/main/0012.%20%E4%BD%BF%E7%94%A8%20Menu%20%E6%A8%A1%E5%9D%97%E5%AE%9E%E7%8E%B0%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95/assets%2F2024-10-06-01-24-36.png)
  

### 7.3. Dock 菜单

- [ ] [0009. 设置 macos 的 Dock 菜单](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md) <!-- [locale](./0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#1--links)
  - [2. 📒 Dock 菜单是什么](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#2--dock-菜单是什么)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0009.%20%E8%AE%BE%E7%BD%AE%20macos%20%E7%9A%84%20Dock%20%E8%8F%9C%E5%8D%95/README.md#3--demo)
  - 如何通过 Menu 模块来创建 macos 上的 Dock 菜单
  

### 7.4. 自定义菜单

- [ ] [0011. 自定义系统菜单覆盖默认菜单问题](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#1--links)
  - [2. 📒菜单项冲突问题](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#2-菜单项冲突问题)
  - [3. 📒如何解决冲突问题](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#3-如何解决冲突问题)
  - [4. 💻 demo1 - 手写调试工具切换的触发逻辑](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#4--demo1---手写调试工具切换的触发逻辑)
  - [5. 💻 demo2 - 使用预设的 role 来快速配置菜单项](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#5--demo2---使用预设的-role-来快速配置菜单项)
  - [6. 🤔 问：role 是什么？](https://github.com/Tdahuyou/electron/tree/main/0011.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E8%A6%86%E7%9B%96%E9%BB%98%E8%AE%A4%E8%8F%9C%E5%8D%95%E9%97%AE%E9%A2%98/README.md#6--问role-是什么)
  - 自定义系统菜单和默认菜单的冲突问题是什么
  - 如何解决冲突问题
  

### 7.5. Tray 菜单

- [ ] [0025. 创建 macos 应用托盘（Tray）](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md) <!-- [locale](./0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#1--links)
  - [2. 📒核心模块概述](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#2-核心模块概述)
  - [3. 📒托盘图标](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#3-托盘图标)
  - [4. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#4--demo)
  - [5. 🤔 问：Tray 是 macOS 特有的吗？](https://github.com/Tdahuyou/electron/tree/main/0025.%20%E5%88%9B%E5%BB%BA%20macos%20%E5%BA%94%E7%94%A8%E6%89%98%E7%9B%98%EF%BC%88Tray%EF%BC%89/README.md#5--问tray-是-macos-特有的吗)
  - 如何创建托盘 Tray 菜单
  

## 8. app

### 8.1. 路径

- [ ] [0024. 通过 app 模块获取应用相关路径](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md) <!-- [locale](./0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#1--links)
  - [2. 📒 `app.getPath(name)`](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#2--appgetpathname)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0024.%20%E9%80%9A%E8%BF%87%20app%20%E6%A8%A1%E5%9D%97%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E7%9B%B8%E5%85%B3%E8%B7%AF%E5%BE%84/README.md#3--demo)
  - `app.getPath(name)` 的基本使用
  - 本文介绍了通过 app 模块中的 app.getPath 方法来获取应用程序的相关路径。其中很多路径在都是很重要的，不要再使用 nodejs 去组装这些路径信息了，现尝试到 app.getPath 中找找看有没有现成的。
  

## 9. 快捷键

### 9.1. 页面级别

- [ ] [0023. 页面级别的快捷键](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) <!-- [locale](./0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0023.%20%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#2--demo)
  - 本节通过一个很简单的 demo，介绍如何实现页面级别的快捷方式。
  - 全局快捷键可以使用 Electron 提供的模块 globalShortcut 来实现，这是一个主进程模块。但是，就文档中要求的页面级别的快捷方式，完全可以使用原生的 Web API `window.onkeydown = function(e) { ... }` 来实现。
  

### 9.2. 全局级别

- [ ] [0022. 全局级别的快捷键](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) <!-- [locale](./0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md) -->  
  - [1. 🔗 globalShortcut](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#1--globalshortcut)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0022.%20%E5%85%A8%E5%B1%80%E7%BA%A7%E5%88%AB%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE/README.md#2--demo)
  - 学习如何注册全局（系统）级别的快捷方式
  - 全局级别的快捷键，也称系统级别的快捷键，这玩意儿在很多桌面应用程序中多多少少都会有一些。对于一些常用的操作和交互行为，绑定好快捷键，还是蛮必要的。
  - globalShortcut 是一个主进程中的模块，其作用是 在应用程序没有键盘焦点时，监听键盘事件。
  - Q：什么叫“应用程序没有键盘焦点”？
  - A：就是你当前鼠标点击的位置并非该应用，焦点不在这个应用身上。
  

## 10. 剪切板

- [ ] [0021. 使用 clipboard 模块向系统剪切板中读写文本](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md) <!-- [locale](./0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20clipboard%20%E6%A8%A1%E5%9D%97%E5%90%91%E7%B3%BB%E7%BB%9F%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD%E8%AF%BB%E5%86%99%E6%96%87%E6%9C%AC/README.md#2--demo)
  - 该笔记 clipboard 基本使用
  - clipboard 是一个很常用也狠使用的模块，用于读写系统的剪切板。这篇文档介绍它的基本使用，实现剪切板的读写操作。
  

## 11. 系统通知

- [ ] [0026. 使用 Notification 模块弹出系统消息](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md) <!-- [locale](./0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0026.%20%E4%BD%BF%E7%94%A8%20Notification%20%E6%A8%A1%E5%9D%97%E5%BC%B9%E5%87%BA%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF/README.md#2--demo)
  - 如何使用 Notification 弹出系统通知
  - 这个 demo 使用 electron 的内置模块 Notification 实现了一个简单的 demo，最终效果仅仅是将系统消息给展示出来，没有加其它多余的交互逻辑。
  

## 12. 桌面视频流

- [ ] [0029. 实现屏幕监听功能](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md) <!-- [locale](./0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#1--links)
  - [2. 📒`navigator.mediaDevices.getUserMedia()` 的 video 配置结构问题](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#2-navigatormediadevicesgetusermedia-的-video-配置结构问题)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0029.%20%E5%AE%9E%E7%8E%B0%E5%B1%8F%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%9F%E8%83%BD/README.md#3--demo)
  - 这是参照官方示例实现一个屏幕实时监听的 demo。
  

- [ ] [0028. 模拟截图功能](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md) <!-- [locale](./0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0028.%20%E6%A8%A1%E6%8B%9F%E6%88%AA%E5%9B%BE%E5%8A%9F%E8%83%BD/README.md#2--demo)
  - 使用 Electron 并结合传统的前端技术来实现一个截图应用
  - 这篇文档是作者 [mowuu](https://github.com/muwoo) 使用 Electron 内置模块结合前端技术 canvas 写的一个截图工具示例。
  - demo 的核心逻辑简单了解了个大概，屏幕数据的获取使用的是 desktopCapture，页面上的图像最终是使用 canvas 来绘制的。实测在高分辨率的设备下截图效果异常模糊，几乎处于不可用的状态。
  - 临时结论：使用 Electron 内置的原生模块来模拟截图效果，可以说几乎是不可用的。后续找时间去 github 搜一下看看其它解决方案。
  

- [ ] [0049. desktopCapturer 简介](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md) <!-- [locale](./0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md) -->  
  - [1. 🔗 desktopCapturer 相关链接](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#1--desktopcapturer-相关链接)
  - [2. 📒 desktopCapturer 是什么](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#2--desktopcapturer-是什么)
  - [3. 📒 desktopCapturer 的基本使用流程](https://github.com/Tdahuyou/electron/tree/main/0049.%20desktopCapturer%20%E7%AE%80%E4%BB%8B/README.md#3--desktopcapturer-的基本使用流程)
  - desktopCapturer 是什么
  - desktopCapturer 的基本使用流程
  - desktopCapturer 这是主进程中的一个模块，是一个用于处理桌面视频流（你可以理解为就是你眼睛看到的显示屏上的画面数据）的 API。
  

## 13. 插件化

- [ ] [0014. 使用 BrowserView 加载外部资源](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md) <!-- [locale](./0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md) -->  
  

  - [bilibili.electron.0014.1](https://www.bilibili.com/video/BV1544219774)
  - [1. ⏰ TODO 为啥 BrowserView 被废弃掉了](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#1--todo-为啥-browserview-被废弃掉了)
  - [2. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#2--links)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0014.%20%E4%BD%BF%E7%94%A8%20BrowserView%20%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90/README.md#3--demo)
  - 如何使用 BrowserView 加载外部资源
  - 这个 demo 使用 BrowserView 模块来加载第三方资源（掘金主页）到渲染进程的页面上。
  

- [ ] [0013. 基于 BrowserView 实现插件化能力](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md) <!-- [locale](./0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md) -->  
  

  - [bilibili.electron.0013.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#1--links)
  - [2. 💻 demo - BrowserView 实现插件化](https://github.com/Tdahuyou/electron/tree/main/0013.%20%E5%9F%BA%E4%BA%8E%20BrowserView%20%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6%E5%8C%96%E8%83%BD%E5%8A%9B/README.md#2--demo---browserview-实现插件化)
  - 基于 BrowserView 实现插件化能力
  - 该 demo 模拟了使用 BrowserView 模块来加载第三方资源并注入 preload 脚本，使其具备原生能力。
  

### 13.1. 集成浏览器插件

- 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。
- [ ] [0006. 使用 vue-remote-devtools](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md) <!-- [locale](./0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md) -->  
  

  - [bilibili.electron.0006.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0006.%20%E4%BD%BF%E7%94%A8%20vue-remote-devtools/README.md#2--demo)
  - 介绍 vue-remote-devtools 的基本使用
  - 本文介绍如何让基于 Electron 搭建的 Vue 工程，能够远程地使用 Vue 调试工具。本节介绍的其实是一个通用的法子，那些在非浏览器环境下搭建的 Vue 工程，如果想要使用 vue-devtools 的能力，都可以参考文中提到的这种方式。
  - 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。
  

- [ ] [0007. 使用手动安装的方式集成 vue-devtools](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) <!-- [locale](./0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0007.%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#2--demo)
  - 如何通过 session 模块在 Electron 工程中集成 vue-devtools
  

- [ ] [0005. 使用 electron-devtools-installer 安装 vue-devtools](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md) <!-- [locale](./0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0005.%20%E4%BD%BF%E7%94%A8%20electron-devtools-installer%20%E5%AE%89%E8%A3%85%20vue-devtools/README.md#2--demo)
  - 按照官方提供的示例试了一下，最终结果是：**没能安装成功**。
  - 如果不是自己写的测试用例有误，那就是 electron-devtools-installer 这个包过时了。
  

- [ ] [0008. 使用自动安装的方式集成 vue-devtools](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) <!-- [locale](./0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#2--demo)
  - [3. 📒 如何获取 VUE_DEVTOOLS_ID](https://github.com/Tdahuyou/electron/tree/main/0008.%20%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%96%B9%E5%BC%8F%E9%9B%86%E6%88%90%20vue-devtools/README.md#3--如何获取-vue_devtools_id)
  - 如何根据插件 ID 自动下载 chrome 插件源码 `downloadChromeExtension.js`
  - 本文基于 electron-devtools-installer 中的下载 chrome 插件的逻辑，封装了一个 downloadChromeExtension.js 模块，在 electron.0007 的基础上，实现自动安装插件的功能。
  - 其它第三方插件的集成方案基本都类似，集成 vue 调试工具 vue-devtools 的示例可以作为一个参考。
  

## 14. 其它功能

### 14.1. webContents startDrag 原生文件拖放

- [ ] [0027. 原生文件拖 & 放](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md) <!-- [locale](./0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md) -->  
  

  - [bilibili.electron.0027.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#1--links)
  - [2. 📒本文要实现一个什么样的效果](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#2-本文要实现一个什么样的效果)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0027.%20%E5%8E%9F%E7%94%9F%E6%96%87%E4%BB%B6%E6%8B%96%20%26%20%E6%94%BE/README.md#3--demo)
  - 原生文件拖 & 放是什么
  - 如何实现原生文件拖 & 放效果
    - 从视频的 0:50～2:30 开始展示最终的效果，可以从这开始看，快速了解下本节要实现的效果。
  

## 15. 第三方库

### 15.1. electron-reload

- [ ] [0031. 使用 electron-reload 实现热更](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md) <!-- [locale](./0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md) -->  
  

  - [bilibili.electron.0031.1](https://www.bilibili.com/video/BV1544219774)
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#1--links)
  - [2. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0031.%20%E4%BD%BF%E7%94%A8%20electron-reload%20%E5%AE%9E%E7%8E%B0%E7%83%AD%E6%9B%B4/README.md#2--demo)
  - 如何使用 electron-reload 实现热更
  - 使用 electron-reload 监听主进程和渲染进程内容的变更，一旦内容变化，就自动重启 electron。
  - 额，这功能确实有点儿用，不过感觉也是可有可无，因为手动启动的成本也不算太高。
  

### 15.2. electron-builder

- [ ] [0030. 使用 electron-icon-builder、electron-builder 解决应用打包后的图标问题](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md) <!-- [locale](./0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md) -->  
  - [1. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#1--demo)
  - [2. 📒electron, electron-builder, 和 electron-icon-builder 应该安装为开发依赖还是生产依赖呢？](https://github.com/Tdahuyou/electron/tree/main/0030.%20%E4%BD%BF%E7%94%A8%20electron-icon-builder%E3%80%81electron-builder%20%E8%A7%A3%E5%86%B3%E5%BA%94%E7%94%A8%E6%89%93%E5%8C%85%E5%90%8E%E7%9A%84%E5%9B%BE%E6%A0%87%E9%97%AE%E9%A2%98/README.md#2-electron-electron-builder-和-electron-icon-builder-应该安装为开发依赖还是生产依赖呢)
  - 使用 electron-icon-builder 处理应用图标
  - 使用 electron-builder 出包
  

## 16. 小练习

### 16.1. 桌面时钟

- [ ] [0032. 实现一个桌面时钟](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md) <!-- [locale](./0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#1--links)
  - [2. 📒](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#2-)
  - [3. 💻 demo](https://github.com/Tdahuyou/electron/tree/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/README.md#3--demo)
  - 手写一个简单的桌面时钟摆件
  - 最终效果：
    - ![](https://raw.githubusercontent.com/Tdahuyou/electron/main/0032.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F/assets%2F2024-10-13-21-41-11.png)
  

- [ ] [0056. 实现一个桌面时钟-2](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md) <!-- [locale](./0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md) -->  
  - [1. 📒 demo 功能简介](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#1--demo-功能简介)
  - [2. 📒 编写这个 demo 的初衷](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#2--编写这个-demo-的初衷)
  - [3. 📒 启动 `npm start` 和出包 `npm run build`](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#3--启动-npm-start-和出包-npm-run-build)
  - [4. 📒 图标背景色 `#9feaf9`](https://github.com/Tdahuyou/electron/tree/main/0056.%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%A1%8C%E9%9D%A2%E6%97%B6%E9%92%9F-2/README.md#4--图标背景色-9feaf9)
  - 从 0 到 1 实现一个简易的桌面时钟应用。
  - 一共没几行代码，直接看 src 下边的源码即可。
  - 在 0032 也练习了一个桌面时钟的应用，0032 是一个桌面时钟摆件，展示效果是以钟表形式来呈现的。
  

### 16.2. 微信读书助手

- [ ] [0044. weread-helper](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md) <!-- [locale](./0044.%20weread-helper/README.md) -->  
  - [1. 🔗 links](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md#1--links)
  - [2. 📒Quick Start](https://github.com/Tdahuyou/electron/tree/main/0044.%20weread-helper/README.md#2-quick-start)
  - 套壳了微信读书的网页版，并注入了一些自定义脚本。
  

### 16.3. 自动定时截图工具

- [ ] [0033. ScreenCaptureApp](https://github.com/Tdahuyou/electron/tree/main/0033.%20ScreenCaptureApp/README.md) <!-- [locale](./0033.%20ScreenCaptureApp/README.md) -->  
  
  - demo - 自动截图程序
  - 目前在测试 nodejs 的第三方库，看下是否能够支持实现定时定区域自动截图的功能，如果表现良好，可以考虑将其集成到 electron 中，出一个桌面端的自动截图工具。
  - 应用场景：看外文视频的时候，自动定时截字幕。
  - 功能：
    - 定时截图
    - 定区域截图
    - ORC 识别（识别字幕，去重）
  
  
  
  
  
  
  
  

## 17. 📺 bilibili


- [x] [0061. electron bilibili 视频列表](https://github.com/Tdahuyou/electron/tree/main/0061.%20electron%20bilibili%20%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8/README.md) <!-- [locale](./0061.%20electron%20bilibili%20%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8/README.md) -->  
  - [1. 📺 bilibili](https://github.com/Tdahuyou/electron/tree/main/0061.%20electron%20bilibili%20%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8/README.md#1--bilibili)
  
