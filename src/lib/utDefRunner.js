import { writable } from 'svelte/store';
import { utDefProgress, utDefStatus } from './stores';
import { getExecName } from './utDefRunnerUtils';

export class UTDefectRunner {
    /*runProgress = writable(0)
    maxRunProgress = writable(100)
    statusMessage = writable({icon: "info", message: "Runner initialized", color: "#4d4d4d"})
    running = writable(false)*/

    constructor() {
        
    }

    async Run(sourceBinaryPath) {
        const platform = await window.electronAPI.getPlatform()
        const homeDir = await window.electronAPI.getHomeDir()
        const pathToBinaryFolder = homeDir + "/Documents/simSUNDT/tmp"
        const execName = getExecName(platform)

        utDefStatus.set({
            running: false,
            message: {icon: "info", message: "Attempting to start non-parametric simulation", color: "#4d4d4d"}
        })

        const copied = await window.electronAPI.copyFile(sourceBinaryPath, pathToBinaryFolder + "/" + execName)

        if (!copied) {
            utDefStatus.set({
                running: false,
                message: {
                    icon: "warning", 
                    message: "Simulation canceled, something went wrong while copying binary file to" + pathToBinaryFolder + ", please try again", 
                    color: "#ef4444"
                }
            })
            return
        }

        if (!await window.electronAPI.utDefStart(pathToBinaryFolder)) {
            utDefStatus.set({
                running: false,
                message: {
                    icon: "warning", 
                    message: "Simulation canceled, invalid operating system, runner can not run", 
                    color: "#ef4444"
                }
            })
            return
        }

        utDefStatus.set({
            running: true,
            message: {
                icon: "info",
                message: "Non-parametric simulation started, waiting for " + execName + " to finish",
                color: "#4d4d4d"
            }
        })

        // Sleep to await child process startup
        await new Promise(r => setTimeout(r, 500));

        while(await window.electronAPI.utDefAlive())
        {
            await new Promise(r => setTimeout(r, 50));

            let progressObj = await window.electronAPI.utDefGetProgressStd()

            utDefProgress.set(progressObj['p'] / progressObj['mp'])
        }


        utDefStatus.set({
            running: false,
            message: {
                icon: "info",
                message: "Simulation concluded, see the 'Results' tab to view simulation results",
                color: "#4d4d4d"
            }
        })
        utDefProgress.set(0)

        return Promise.resolve(true)
    }

    async Stop() {
        window.electronAPI.utDefTerminate()
    }
}