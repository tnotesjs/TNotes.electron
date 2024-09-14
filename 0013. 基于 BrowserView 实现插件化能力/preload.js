const { contextBridge, ipcRenderer } = require('electron')

const TdahuyouAPI = {
  showNotification: (opts) => { // { title: string, body: string, ... }
    ipcRenderer.send('TdahuyouPlugin-showNotification', { body: opts.body, title: opts.title })
  },
  doSomething: () => {
    console.log('doing something in BrowserView ...');
  }
  // other apis ...
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('TdahuyouPlugin', TdahuyouAPI)
} else {
  window.TdahuyouPlugin = TdahuyouAPI
}