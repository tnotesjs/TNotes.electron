const { ipcRenderer } = require('electron')

const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')
const textarea = document.getElementById('textarea')

btn1.addEventListener('click', _ => ipcRenderer.invoke('write-text', 'hello world'))
btn2.addEventListener('click', async _ => {
  textarea.value = await ipcRenderer.invoke('read-text')
})