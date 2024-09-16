const { ipcRenderer } = require('electron')

// 单向（请求）
btn1.onclick = () => {
  ipcRenderer.invoke('invoke-message1', 1, 2, 3)
}

// 双向（请求 + 响应）
btn2.onclick = async () => {
  const res = await ipcRenderer.invoke('invoke-message2', 4, 5, 6)
  console.log('ipcRenderer.invoke 方法收到的返回结果：', res)
}
