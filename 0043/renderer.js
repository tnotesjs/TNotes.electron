const { ipcRenderer } = require('electron')
ipcRenderer.on('msg-from-main-process', (_, ...args) => {
  console.log('renderer-process-received-msg-from-main-process')
  console.log(args)
})
