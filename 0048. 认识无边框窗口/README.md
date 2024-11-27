# [0048. 认识无边框窗口](https://github.com/Tdahuyou/electron/tree/main/0048.%20%E8%AE%A4%E8%AF%86%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3)

<!-- region:toc -->
- [1. 📝 summary](#1--summary)
- [2. 🔗 links](#2--links)
- [3. 📝 创建无边框窗口](#3--创建无边框窗口)
- [4. 📝 无边框窗口的特点](#4--无边框窗口的特点)
- [5. 📝 特点 - 可以自定义窗口控制按钮](#5--特点---可以自定义窗口控制按钮)
- [6. 📝 特点 - 可以自定义窗口的形状和样式](#6--特点---可以自定义窗口的形状和样式)
- [7. 📝 特点 - 需要手动实现窗口的拖拽和窗口的尺寸调整](#7--特点---需要手动实现窗口的拖拽和窗口的尺寸调整)
<!-- endregion:toc -->
## 1. 📝 summary
- 如何创建一个无边框窗口
- 无边框窗口的特点
  - 了解无边框窗口的特点，如果你创建的窗口要求具备这些特性，可以考虑使用无边框窗口来实现。

## 2. 🔗 links

- https://www.electronjs.org/zh/docs/latest/tutorial/window-customization#%E5%88%9B%E5%BB%BA%E6%97%A0%E8%BE%B9%E6%A1%86%E7%AA%97%E5%8F%A3
  - 官方文档，创建无边框窗口。

## 3. 📝 创建无边框窗口

- 做法非常简单，只需要在 `new BrowserWindow` 的时候，丢一个配置项 `frame: false` 就可以创建一个无边框窗口。

```js
const { BrowserWindow, app } = require('electron')

let win
function createWindow() {
  win = new BrowserWindow({ frame: false })
  win.loadFile('./index.html')
}

app.whenReady().then(createWindow)
```

## 4. 📝 无边框窗口的特点

- 无边框窗口为开发者提供了更大的灵活性和自定义能力，但同时也需要更多的开发工作来实现窗口的各种功能和行为。在设计无边框窗口时，要注意平衡美观性、功能性和用户体验，并考虑不同操作系统的特性和限制。
- 在 Electron 中创建无边框窗口（frameless window）时，窗口具有以下特点。
  - 可以自定义窗口控制按钮
  - 可以自定义窗口的形状和样式
  - 需要手动实现窗口的拖拽和窗口的尺寸调整

## 5. 📝 特点 - 可以自定义窗口控制按钮

- 无边框窗口，没有默认的窗口边框和标题栏，可以实现 **自定义的窗口控制按钮**。无边框窗口没有操作系统提供的默认窗口装饰，如 **标题栏、最小化/最大化/关闭按钮** 等。这给了开发者更多的自由度来自定义窗口的外观和行为。开发者可以自己实现这些按钮的功能，并将其集成到窗口的自定义界面中。

![](md-imgs/2024-10-06-00-14-23.png)

- 这里说的窗口控制按钮，在 macOS 上也叫交通灯 `trafficLight`，也就是这一块区域。
  - Q：知道这个有啥用呢？
  - A：在 `new BaseWindow([options])` 中的 options 配置项中，有一个字段 `trafficLightPosition`，顾名思义，这玩意儿是用来配置窗口交通灯的位置的。如果你知道交通灯 `trafficLight` 代指的是什么，理解起来就很简单了。它是 macOS 中特有的配置项，在 Windows 中不适用。

> 由此可见，在编程中，对于语义的理解是非常重要的。扯远了，回来继续……

- 注意，无边框窗口在不同操作系统上的行为可能有所不同。例如，在 Windows 上，无边框窗口仍然会显示一个细边框；在 macOS 上，无边框窗口可以完全隐藏边框。

## 6. 📝 特点 - 可以自定义窗口的形状和样式

- 无边框窗口允许开发者通过 CSS 和 HTML 来自定义窗口的形状、圆角、阴影等样式。
- 我们平时看到的窗口，大多都是矩形的。但是，也有一些应用的窗口是比较特别的，比如常见的一些加速球的样式就是圆形。

![](md-imgs/2024-10-06-00-16-05.png)

- 其实通过无边框窗口，是可以创建非矩形的窗口，如圆形、三角形等任意其他形状。
- 可以说你想要创建啥形状的都行，你只需要将默认的窗口隐藏，然后展示一张图片给用户，图片的透明部分对于用户而言是不可见的，所以你可以在 **视觉上** 向用户展示任意形状的窗口。
- 这里特别强调任意形状仅仅是体现在“视觉上”，窗口本质还是矩形的，只不过部分区域看不见罢了。

## 7. 📝 特点 - 需要手动实现窗口的拖拽和窗口的尺寸调整

- **由于没有默认的标题栏，无边框窗口默认情况下不能被拖拽和调整大小。**
- 你需要通过监听鼠标事件并调用相应的 Electron API 来实现窗口的拖拽和调整大小功能。
- 除了通过 JS 来处理窗口的拖拽问题之外，还有一种更加简单的做法，就是通过 css 来指定可拖拽的区域来实现窗口的拖拽功能。

```html
<!-- 令窗口的标题栏是可拖拽的区域 -->
<div class="title">这是自定义的窗口标题栏</div>
<!-- 窗口的内容区域不可拖拽 -->
<div class="content">Lorem ipsum dolor sit amet.</div>
```

```css
.title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2rem;
  background-color: lightblue;

  /* 使该区域可拖拽 */
  -webkit-app-region: drag;
}

.content {
  margin-top: 2rem;
}
```

- 对于无边框窗口，我们可以自定义一个标题栏，然后通过 css 给这个标题栏的容器加上一条 css 声明 `-webkit-app-region: drag;`，这样就可以让此区域被拖拽。
- 这是一种比较常见的做法，除了写法简洁这一点好处之外，还可以正常实现窗口的一些交互行为，比如双击标题栏区域，实现窗口的最大化切换。当然，也会存在一些弊端，主要提现在点击行为的交互上 —— click 事件失效。

```js
// 通过 css 的方式来解决无边框窗口的拖拽问题，会导致点击事件失效。
const title = document.querySelector('.title')
title.addEventListener('click', () => {
  console.log('title clicked')
})
// 点击内容区域，可以触发点击事件。
const content = document.querySelector('.content')
content.addEventListener('click', () => {
  console.log('content clicked')
})
```

- 点击标题栏 `.title`，并不会打印 `title clicked`。
- 点击内容区域 `.content`，会打印 `content clicked`。

