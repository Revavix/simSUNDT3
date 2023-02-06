const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    getDefaultBinaryPath: () => ipcRenderer.invoke('get-default-binary-path'),
    getHomeDir: () => ipcRenderer.invoke('os-get-home-dir'),
    readFile: (path) => ipcRenderer.invoke('read-file', path),
    writeFile: (path, data) => ipcRenderer.invoke('write-file', path, data),
    writeFileByLines: (path, data) => ipcRenderer.invoke('write-file-by-lines', path, data),
    copyFile: (src, target) => ipcRenderer.invoke('copy-file', src, target),
    fileExists: (src) => ipcRenderer.invoke('file-exists', src),
    extname: (path) => ipcRenderer.invoke('extname', path),
    openFolderModal: (defaultPath) => ipcRenderer.invoke('open-folder-modal', defaultPath),
    openFileModal: (defaultPath, filters) => ipcRenderer.invoke('open-file-modal', defaultPath, filters),
    utDefStart: (pathToBinary, pathToProgessFile) => ipcRenderer.invoke('utdef-start', pathToBinary, pathToProgessFile),
    utDefStartStd: (pathToBinary, inputPath) => ipcRenderer.invoke('utdef-start-std', pathToBinary, inputPath),
    utDefGetProgressStd: () => ipcRenderer.invoke('utdef-get-prog-std'),
    utDefAlive: () => ipcRenderer.invoke('utdef-active'),
    utDefTerminate: () => ipcRenderer.invoke('utdef-terminate'),
})