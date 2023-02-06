

import { writable } from 'svelte/store';

export class UTDefectRunner {
    sourceBinaryPath = ""
    runProgress = writable(0)
    maxRunProgress = writable(100)
    statusMessage = writable({icon: "info", message: "Runner initialized", color: "#4d4d4d"})
    running = writable(false)

    constructor(sourceBinaryPath) {
        this.sourceBinaryPath = sourceBinaryPath
    }

    async Run() {
        const platform = await window.electronAPI.getPlatform()
        const homeDir = await window.electronAPI.getHomeDir()
        const pathToProgessFile = homeDir + "/Documents/simSUNDT/tmp/utdefcontrol"
        let failTimer = 0
        let maxTime = 20 * 60
        let lastProgress = 0
        let targetBinaryPath = ""

        this.statusMessage.set({icon: "info", message: "Starting simulation...", color: "#4d4d4d"})

        // Create a /tmp folder under /Documents/simSUNDT/tmp

        // Set targetBinaryPath to use .exe or no .exe depending on operating system in use
        if (platform == 'darwin' || platform == 'linux') {
            targetBinaryPath = homeDir + "/Documents/simSUNDT/tmp/UTDef6"
        } else if (platform == 'win32') {
            targetBinaryPath = homeDir + "/Documents/simSUNDT/tmp/UTDef6.exe"
        } else {
            this.statusMessage.set({
                icon: "warning", 
                message: "Simulation canceled, invalid operating system, runner can not run.", 
                color: "#ef4444"
            })
            return
        }

       
        const copied = await window.electronAPI.copyFile(this.sourceBinaryPath, targetBinaryPath)

        if (!copied) {
            return
        }

        window.electronAPI.utDefStart(targetBinaryPath, pathToProgessFile)
        

        this.running.set(true)

        while(failTimer < maxTime && await window.electronAPI.utDefAlive())
        {
            await new Promise(r => setTimeout(r, 50));

            let progressObj = await window.electronAPI.utDefGetProgressStd()

            if (progressObj['p'] == lastProgress) {
                failTimer++;
            }

            this.maxRunProgress.set(progressObj['mp'])
            this.runProgress.set(progressObj['p'])
            this.running.set(await window.electronAPI.utDefAlive())

            lastProgress = progressObj['p']
        }

        this.statusMessage.set({icon: "info", message: "Simulation concluded, see the 'Results' tab to view simulation results", color: "#4d4d4d"})
        this.running.set(false)
        this.maxRunProgress.set(100)
        this.runProgress.set(0)
    }

    Stop() {
        window.electronAPI.utDefTerminate()
    }
}