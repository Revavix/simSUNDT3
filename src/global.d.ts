export interface IElectronAPI {
    getPlatform: () => Promise<string>,
    getDefaultBinaryPath: () => Promise<string>,
    getPathBasename: (path) => Promise<string>,
    getHomeDir: () => Promise<string>,
    rmDir: (dirPath: string) => Promise<boolean>,
    readFile: (path: string) => Promise<string>,
    readFileBytes: (path: string) => Promise<Uint8Array>,
    writeFile: (path: string, data: string) => Promise<boolean>,
    writeFileByLines: (path: string, data: Array<string>) => Promise<boolean>,
    copyFile: (src: string, target: string) => Promise<boolean>,
    fileExists: (src: string) => Promise<boolean>,
    extname: (path: string) => Promise<string>,
    mkdir: (path: string) => Promise<boolean>,
    openFolderModal: (defaultPath) => Promise<string>,
    openFileModal: (defaultPath, filters) => Promise<string>,
    openSaveModal: (defaultPath, filters) => Promise<object>,
    inspect: (filePath) => Promise<void>,
    readdir: (path) => string[],
    utDefMpInit: (numberOfProcesses: number) => Promise<void>,
    utDefMpStart: (executablePath: string) => Promise<string>,
    utDefMpStop: (processId: string) => Promise<void>,
    utDefMpGetStatus: (processId: string) => Promise<object>,
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

export declare module 'plotly.js-dist'