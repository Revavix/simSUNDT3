const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getHomeDir: () => ipcRenderer.invoke('os-get-home-dir'),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data)
})