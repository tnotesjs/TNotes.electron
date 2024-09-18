const { ipcRenderer } = require('electron')

window.addEventListener('contextmenu', (e) => {
  console.log('trigger contextmenu event')
  e.preventDefault()
  ipcRenderer.invoke('show-context-menu')
})

ipcRenderer.on('context-menu-command', (e, command) => {
  console.log('【renderer process received msg from main process】', command)
})
