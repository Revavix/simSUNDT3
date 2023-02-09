export interface IElectronAPI {
    getPlatform: () => Promise<string>,
    getDefaultBinaryPath: () => Promise<string>,
    getHomeDir: () => Promise<string>,
    rmDir: (dirPath: string) => Promise<boolean>,
    readFile: (path: string) => Promise<string>,
    writeFile: (path: string, data: string) => Promise<boolean>,
    writeFileByLines: (path: string, data: Array<string>) => Promise<boolean>,
    copyFile: (src: string, target: string) => Promise<boolean>,
    fileExists: (src: string) => Promise<boolean>,
    extname: (path: string) => Promise<string>,
    openFolderModal: (defaultPath) => Promise<string>,
    openFileModal: (defaultPath, filters) => Promise<string>,
    utDefStart: (pathToBinaryFolder: string) => Promise<boolean>,
    utDefStartStd: (pathToBinary: string, inputPath: string) => Promise<boolean>,
    utDefGetProgressStd: () => Promise<object>,
    utDefAlive: () => Promise<boolean>,
    utDefTerminate: () => Promise<void>,
    minimize: () => Promise<void>,
    unmaximize: () => Promise<void>,
    maximize: () => Promise<void>,
    close: () => Promise<void>,
    isMaximized: () => Promise<boolean>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}