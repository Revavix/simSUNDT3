export interface IElectronAPI {
    getPlatform: () => Promise<string>,
    getDefaultBinaryPath: () => Promise<string>,
    getHomeDir: () => Promise<string>,
    writeFile: (filePath: string, data: Array<string>) => Promise<boolean>
    copyFile: (src: string, target: string) => Promise<void>
    fileExists: (src: string) => Promise<boolean>,
    utdefectStartStd: (pathToBinary: string, inputPath: string) => Promise<boolean>,
    utdefectGetProgressStd: () => Promise<object>,
    utdefectAlive: () => Promise<boolean>,
    utdefectTerminate: () => Promise<void>,
    projectListLatest: () => Promise<Array<object>>,
    projectLoadByModal: () => Promise<object>,
    projectLoadByPath: (projectPath: string) => Promise<object>,
    projectNewChooseLocation: () => Promise<string>,
    projectNewCreate: (projectName, pathToProject, overwrite) => Promise<object>,
    projectSave: (data) => Promise<object>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}