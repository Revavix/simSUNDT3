export interface IElectronAPI {
    getDefaultBinaryPath: () => Promise<string>,
    getHomeDir: () => Promise<string>,
    writeFile: (filePath: string, data: Array<string>) => Promise<boolean>
    copyFile: (src: string, target: string) => Promise<void>
    fileExists: (src: string) => Promise<boolean>,
    utdefectStartStd: (pathToBinary: string, inputPath: string) => Promise<boolean>,
    utdefectGetProgressStd: () => Promise<object>,
    utdefectAlive: () => Promise<boolean>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}