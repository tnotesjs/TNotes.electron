const { ipcRenderer } = require('electron')

let port1
ipcRenderer.on('port', (e) => {
  port1 = e.ports[0]
  console.log('渲染进程收到了来自主进程的消息端口', port1)
})

function testInvoke_1() {
  const startTime = Date.now()
  for (let i = 0; i < 10000; i++) {
    ipcRenderer.invoke('invoke', 'Message from renderer')
  }
  const endTime = Date.now()
  console.log('测试用例 1：使用 ipcRenderer.invoke 和 ipcMain.handle【单向】', endTime - startTime)
}

function testMessageChannel_1() {
  const startTime = Date.now()
  for (let i = 0; i < 10000; i++) {
    port1.postMessage('Message from renderer')
  }
  const endTime = Date.now()
  console.log('测试用例 2：使用 MessageChannel【单向】', endTime - startTime)
}

async function testInvoke_2() {
  const startTime = Date.now()
  for (let i = 0; i < 10000; i++) {
    const res = await ipcRenderer.invoke('invoke', 'Message from renderer')
    // console.log(res)
  }
  const endTime = Date.now()
  console.log('测试用例 3：使用 ipcRenderer.invoke 和 ipcMain.handle【双向】', endTime - startTime)
}

function testMessageChannel_2() {
  const startTime = Date.now()
  let messagesReceived = 0

  for (let i = 0; i < 10000; i++) {
    port1.postMessage('Message from renderer')
  }

  port1.onmessage = ({ data: { data }}) => {
    // console.log(data)
    messagesReceived++

    if (messagesReceived === 10000) {
      const endTime = Date.now()
      console.log('测试用例 4：使用 MessageChannel【双向】', endTime - startTime)
    }
  }
}

document.getElementById('btn1').addEventListener('click', testInvoke_1)
document.getElementById('btn2').addEventListener('click', testMessageChannel_1)
document.getElementById('btn3').addEventListener('click', testInvoke_2)
document.getElementById('btn4').addEventListener('click', testMessageChannel_2)