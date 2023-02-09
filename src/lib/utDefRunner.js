import { writable } from 'svelte/store';

export class UTDefectRunner {
    runProgress = writable(0)
    maxRunProgress = writable(100)
    statusMessage = writable({icon: "info", message: "Runner initialized", color: "#4d4d4d"})
    running = writable(false)

    constructor() {

    }

    async Run(sourceBinaryPath) {
        const platform = await window.electronAPI.getPlatform()
        const homeDir = await window.electronAPI.getHomeDir()
        const pathToBinaryFolder = homeDir + "/Documents/simSUNDT/tmp"
        let execName = ""

        if (platform == 'darwin' || platform == 'linux') {
            execName = "UTDef6"
        } else if (platform == 'win32') {
            execName = "UTDef6.exe"
        }

        this.statusMessage.set({icon: "info", message: "Starting simulation...", color: "#4d4d4d"})

        const copied = await window.electronAPI.copyFile(sourceBinaryPath, pathToBinaryFolder + "/" + execName)

        if (!copied) {
            this.statusMessage.set({
                icon: "warning", 
                message: "Simulation canceled, something went wrong in simulation preparation, please try again.", 
                color: "#ef4444"
            })
            return
        }

        if (!await window.electronAPI.utDefStart(pathToBinaryFolder)) {
            this.statusMessage.set({
                icon: "warning", 
                message: "Simulation canceled, invalid operating system, runner can not run.", 
                color: "#ef4444"
            })
            return
        }

        this.running.set(true)

        // Sleep to await child process startup
        await new Promise(r => setTimeout(r, 500));

        while(await window.electronAPI.utDefAlive())
        {
            await new Promise(r => setTimeout(r, 50));

            let progressObj = await window.electronAPI.utDefGetProgressStd()

            this.maxRunProgress.set(progressObj['mp'])
            this.runProgress.set(progressObj['p'])
            this.running.set(await window.electronAPI.utDefAlive())
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