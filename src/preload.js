const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    getDefaultBinaryPath: () => ipcRenderer.invoke('get-default-binary-path'),
    getHomeDir: () => ipcRenderer.invoke('os-get-home-dir'),
    rmDir: (dirPath) => ipcRenderer.invoke('rmdir', dirPath),
    readFile: (path) => ipcRenderer.invoke('read-file', path),
    writeFile: (path, data) => ipcRenderer.invoke('write-file', path, data),
    writeFileByLines: (path, data) => ipcRenderer.invoke('write-file-by-lines', path, data),
    copyFile: (src, target) => ipcRenderer.invoke('copy-file', src, target),
    fileExists: (src) => ipcRenderer.invoke('file-exists', src),
    extname: (path) => ipcRenderer.invoke('extname', path),
    mkdir: (path) => ipcRenderer.invoke('mkdir', path),
    openFolderModal: (defaultPath) => ipcRenderer.invoke('open-folder-modal', defaultPath),
    openFileModal: (defaultPath, filters) => ipcRenderer.invoke('open-file-modal', defaultPath, filters),
    utDefStart: (pathToBinaryFolder) => ipcRenderer.invoke('utdef-start', pathToBinaryFolder),
    utDefStartStd: (pathToBinary, inputPath) => ipcRenderer.invoke('utdef-start-std', pathToBinary, inputPath),
    utDefGetProgressStd: () => ipcRenderer.invoke('utdef-get-prog-std'),
    utDefAlive: () => ipcRenderer.invoke('utdef-active'),
    utDefTerminate: () => ipcRenderer.invoke('utdef-terminate'),
    minimize: () => ipcRenderer.invoke('minimize'),
    unmaximize: () => ipcRenderer.invoke('unmaximize'),
    maximize: () => ipcRenderer.invoke('maximize'),
    close: () => ipcRenderer.invoke('close'),
    isMaximized: () => ipcRenderer.invoke('is-maximized')
})