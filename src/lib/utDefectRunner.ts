

import { writable, type Writable } from 'svelte/store';

export class UTDefectRunner {
    sourceBinaryPath: string
    prototype: boolean
    stdMode: boolean
    runProgress: Writable<number>
    maxRunProgress: Writable<number>

    constructor(sourceBinaryPath: string, prototype: boolean, stdMode: boolean) {
        this.sourceBinaryPath = sourceBinaryPath
        this.prototype = prototype
        this.stdMode = stdMode
        this.runProgress = writable(0)
        this.maxRunProgress = writable(100)
    }

    async Run() {
        let homeDir: string = await window.electronAPI.getHomeDir()
        let failTimer: number = 0
        let maxTime: number = 20 * 60
        let lastProgress: number = 0
        let targetBinaryPath: string

        if (this.stdMode) {
            targetBinaryPath = homeDir + "/Documents/simSUNDT/utdefect"
            window.electronAPI.copyFile(this.sourceBinaryPath, targetBinaryPath)
            window.electronAPI.utdefectStartStd(targetBinaryPath, homeDir + "/Documents/simSUNDT/utdefdat")
        } else {
            targetBinaryPath = homeDir + "/Documents/simSUNDT/UTDef6"
            window.electronAPI.copyFile(this.sourceBinaryPath, targetBinaryPath)
        }

        while(failTimer < maxTime && await window.electronAPI.utdefectAlive())
        {
            await new Promise(r => setTimeout(r, 50));

            let progressObj = await window.electronAPI.utdefectGetProgressStd()

            if (progressObj['p'] == lastProgress) {
                failTimer++;
            }

            this.maxRunProgress.set(progressObj['mp'])
            this.runProgress.set(progressObj['p'])

            lastProgress = progressObj['p']
        }

        this.maxRunProgress.set(100)
        this.runProgress.set(0)
    }
}