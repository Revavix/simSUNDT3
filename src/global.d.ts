export interface IElectronAPI {
    getPlatform: () => Promise<string>,
    getDefaultBinaryPath: () => Promise<string>,
    getHomeDir: () => Promise<string>,
    readFile: (path: string) => Promise<string>
    writeFile: (path: string, data: string) => Promise<boolean>,
    writeFileByLines: (path: string, data: Array<string>) => Promise<boolean>,
    copyFile: (src: string, target: string) => Promise<void>,
    fileExists: (src: string) => Promise<boolean>,
    extname: (path: string) => Promise<string>,
    openFolderModal: (defaultPath) => Promise<string>,
    openFileModal: (defaultPath, filters) => Promise<string>,
    utdefectStartStd: (pathToBinary: string, inputPath: string) => Promise<boolean>,
    utdefectGetProgressStd: () => Promise<object>,
    utdefectAlive: () => Promise<boolean>,
    utdefectTerminate: () => Promise<void>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}