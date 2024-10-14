# 0023. 页面级别的快捷键

## 📝 summary

- 一个很简单的 demo，介绍如何实现页面级别的快捷方式。

## 🔗 links

- https://www.electronjs.org/zh/docs/latest/api/global-shortcut
  - Electron，查看 globalShortcut 模块的相关内容。

## 📒 notes

全局快捷键可以使用 Electron 提供的模块 globalShortcut 来实现，这是一个主进程模块。但是，就文档中要求的页面级别的快捷方式，完全可以使用原生的 Web API `window.onkeydown = function(e) { ... }` 来实现。

## 💻 demo

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>页面级别的快捷键 demo</title>
  </head>
  <body>
    <h1>页面级别的快捷键 demo</h1>
    <h1>按下 ctrl + q 控制台将会输出【您按下了 ctrl + q 键】</h1>
    <script>
      // 设置一个页面级别的快捷键
      window.onkeydown = function (e) {
        if (e.ctrlKey && e.key === 'q') {
          // 用户按的键是 ctrl + q
          // 我们可以执行对应的快捷键操作
          console.log('您按下了 ctrl + q 键')
        }
      }
    </script>
  </body>
</html>
```

![](md-imgs/2024-10-06-01-51-02.png)