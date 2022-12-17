export interface IElectronAPI {
    getHomeDir: () => Promise<string>,
    writeFile: (filePath: string, data: Array<string>) => Promise<boolean>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}