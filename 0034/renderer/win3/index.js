const { ipcRenderer } = require('electron')

ipcRenderer.on('action', (e, data) => {
  document.querySelector('h1').innerHTML = data
})
ipcRenderer.invoke('registerChannelEvent', 'action')

document.getElementById('btn').addEventListener('click', () => {
  ipcRenderer.invoke('emitterChannelEvent', 'action', 3)
})