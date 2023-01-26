const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    getDefaultBinaryPath: () => ipcRenderer.invoke('get-default-binary-path'),
    getHomeDir: () => ipcRenderer.invoke('os-get-home-dir'),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    copyFile: (src, target) => ipcRenderer.invoke('copy-file', src, target),
    fileExists: (src) => ipcRenderer.invoke('file-exists', src),
    utdefectStartStd: (pathToBinary, inputPath) => ipcRenderer.invoke('utdef-start-std', pathToBinary, inputPath),
    utdefectGetProgressStd: () => ipcRenderer.invoke('utdef-get-prog-std'),
    utdefectAlive: () => ipcRenderer.invoke('utdef-active'),
    utdefectTerminate: () => ipcRenderer.invoke('utdef-terminate'),
    projectListLatest: () => ipcRenderer.invoke('project-list-latest'),
    projectLoadByModal: () => ipcRenderer.invoke('project-load-by-modal'),
    projectLoadByPath: (projectPath) => ipcRenderer.invoke('project-load-by-path', projectPath),
    projectNewChooseLocation: () => ipcRenderer.invoke('project-new-choose-loc'),
    projectNewCreate: (projectName, pathToProject, overwrite) => ipcRenderer.invoke('project-new-create', projectName, pathToProject, overwrite)
})