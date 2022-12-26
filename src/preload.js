const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getDefaultBinaryPath: () => ipcRenderer.invoke('get-default-binary-path'),
    getHomeDir: () => ipcRenderer.invoke('os-get-home-dir'),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    copyFile: (src, target) => ipcRenderer.invoke('copy-file', src, target),
    fileExists: (src) => ipcRenderer.invoke('file-exists', src),
    utdefectStartStd: (pathToBinary, inputPath) => ipcRenderer.invoke('utdef-start-std', pathToBinary, inputPath),
    utdefectGetProgressStd: () => ipcRenderer.invoke('utdef-get-prog-std'),
    utdefectAlive: () => ipcRenderer.invoke('utdef-active')
})