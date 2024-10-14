# 0024. 通过 app 模块获取应用相关路径

## 📝 summary

- `app.getPath(name)` 的基本使用
- 本文介绍了通过 app 模块中的 app.getPath 方法来获取应用程序的相关路径。其中很多路径在都是很重要的，不要再使用 nodejs 去组装这些路径信息了，现尝试到 app.getPath 中找找看有没有现成的。

## 🔗 links

- https://www.electronjs.org/zh/docs/latest/api/app#appgetpathname
  - 官方文档，查看接口 app.getPath 说明文档。

## 📒 notes

`app.getPath(name)`，其中参数 `name` 是一个 string 类型，`name` 可以是以下这些值。

- `home` 用户的 home 文件夹（主目录）
- `appData` 每个用户的应用程序数据目录，默认情况下指向：
    - `%APPDATA%` Windows 中
    - `$XDG_CONFIG_HOME` or `~/.config` Linux 中
    - `~/Library/Application Support` macOS 中
- `userData` 储存你应用程序配置文件的文件夹，默认是 `appData` 文件夹附加应用的名称 按照习惯用户存储的数据文件应该写在此目录，同时不建议在这写大文件，因为某些环境会备份此目录到云端存储。
- `sessionData` 此目录存储由 `Session` 生成的数据，例如 localStorage，cookies，磁盘缓存，下载的字典，网络 状态，开发者工具文件等。 默认为 `userData` 目录。 Chromium 可能在此处写入非常大的磁盘缓存，因此，如果您的应用不依赖于浏览器存储（如 localStorage 或 cookie）来保存用户数据，建议将此目录设置为其他位置，以避免污染 `userData` 目录。
- `temp` 临时文件夹
- `exe`当前的可执行文件
- `module` The `libchromiumcontent` 库
- `desktop` 当前用户的桌面文件夹
- `documents` 用户文档目录的路径
- `downloads` 用户下载目录的路径
- `music` 用户音乐目录的路径
- `pictures` 用户图片目录的路径
- `videos` 用户视频目录的路径
- `recent` 用户最近文件的目录 (仅限 Windows)。
- `logs`应用程序的日志文件夹
- `crashDumps` 崩溃转储文件存储的目录。

其中 `appData`、`userData`、`exe`、`desktop` 这些路径会相对比较常用一些。

## 💻 demo

```js
// index.js
// 打开终端输入命令 npm run dev 查看最终的打印结果
const { app } = require('electron')
const { join } = require('path')

app.on('ready', () => {
  const exeFilePath       = app.getPath('exe')
  const installFolderPath = join(exeFilePath, '../')
  const desktopPath       = app.getPath('desktop')
  // ...

  console.log('【可执行文件路径】', exeFilePath)
  console.log('【安装目录】',      installFolderPath)
  console.log('【用户桌面路径】',   desktopPath)
  // ...
})
```

其中有些路径在开发阶段意义不大，比如应用程序安装后的可执行文件所在的位置，这需要等咱们应用程序出包，丢给用户安装好之后，打印出来的值将是用户选择的程序安装的位置。
