const { ipcRenderer } = require('electron')

let electronMessagePort
ipcRenderer.on('port', e => {
  console.log('win1 ready-to-show')
  electronMessagePort = e.ports[0]
  document.getElementById('btn').addEventListener('click', _ => electronMessagePort.postMessage('你好 ～ 我是窗口 1'))
  electronMessagePort.onmessage = msg => console.log('【收到了窗口 2 的消息】', msg)
})