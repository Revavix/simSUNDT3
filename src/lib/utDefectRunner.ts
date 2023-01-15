

import { writable, type Writable } from 'svelte/store';

export class UTDefectRunner {
    sourceBinaryPath: string
    prototype: boolean
    stdMode: boolean
    runProgress: Writable<number>
    maxRunProgress: Writable<number>
    statusMessage: Writable<object>
    running: Writable<boolean>

    constructor(sourceBinaryPath: string, prototype: boolean, stdMode: boolean) {
        this.sourceBinaryPath = sourceBinaryPath
        this.prototype = prototype
        this.stdMode = stdMode
        this.runProgress = writable(0)
        this.maxRunProgress = writable(100)
        this.statusMessage = writable({icon: "info", message: "Runner initialized", color: "#4d4d4d"})
        this.running = writable(false)
    }

    async Run() {
        let homeDir: string = await window.electronAPI.getHomeDir()
        let failTimer: number = 0
        let maxTime: number = 20 * 60
        let lastProgress: number = 0
        let targetBinaryPath: string

        this.statusMessage.set({icon: "info", message: "Starting simulation...", color: "#4d4d4d"})

        if (this.stdMode) {
            targetBinaryPath = homeDir + "/Documents/simSUNDT/utdefect"

            if (!window.electronAPI.fileExists(targetBinaryPath)) {
                window.electronAPI.copyFile(this.sourceBinaryPath, targetBinaryPath)
                
                // Delay to ensure copyFile finishes copying, may need to change API function to return a bool promise
                await new Promise(r => setTimeout(r, 300));
            }

            window.electronAPI.utdefectStartStd(targetBinaryPath, homeDir + "/Documents/simSUNDT/utdefdat")
        } else {
            targetBinaryPath = homeDir + "/Documents/simSUNDT/UTDef6"
            window.electronAPI.copyFile(this.sourceBinaryPath, targetBinaryPath)
        }

        this.running.set(true)

        while(failTimer < maxTime && await window.electronAPI.utdefectAlive())
        {
            await new Promise(r => setTimeout(r, 50));

            let progressObj = await window.electronAPI.utdefectGetProgressStd()

            if (progressObj['p'] == lastProgress) {
                failTimer++;
            }

            this.maxRunProgress.set(progressObj['mp'])
            this.runProgress.set(progressObj['p'])
            this.running.set(await window.electronAPI.utdefectAlive())

            lastProgress = progressObj['p']
        }

        this.statusMessage.set({icon: "info", message: "Simulation concluded, see the 'Results' tab to view simulation results", color: "#4d4d4d"})
        this.running.set(false)
        this.maxRunProgress.set(100)
        this.runProgress.set(0)
    }

    Stop() {
        window.electronAPI.utdefectTerminate()
    }
}