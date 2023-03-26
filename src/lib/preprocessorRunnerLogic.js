import { utDefStatus } from "./stores"
import { constructParametricData } from "./tree"
import { UTDefectIsoSaver } from "./utDefIsoSaver"
import { sendStatusInfoMessage, sendStatusWarningMessage } from "./utDefRunnerUtils"

export async function runParametric(homeDirectory, sourceBinary, executableName, data, runner) {
    const saver = new UTDefectIsoSaver()
    const runs = constructParametricData(data.tree, data.misc)

    for(let i = 0; i < runs.length; i++) {
        let date = new Date()
        let m = "Parametric_Run_" + Date.now().toString()  + "_" + (i + 1) // Date.now().toString()  + "_" +
        saver.data = runs[i]

        // Create a new folder for each combination produced by constructParametricData
        await window.electronAPI.mkdir(homeDirectory + "/Documents/simSUNDT/Simulations/" + m)

        // Save each individual run to folder created above
        const saved = await saver.Save(homeDirectory + "/Documents/simSUNDT/Simulations/" + m + "/utdefdat")

        if (!saved) {
            return Promise.reject("Failed to save the utdefdat file to folder")
        }

        // Copy binary to the simulation folder
        const copied = await window.electronAPI.copyFile(sourceBinary, homeDirectory + "/Documents/simSUNDT/Simulations/" + m + "/" + executableName)

        if (!copied) {
            return Promise.reject("Failed to copy the source binary to the target binary")
        }

        // Push metadata which will be used by the runner
        runner.runs.push({
            folder: m,
            date: date.toLocaleDateString("en-US"),
            time: date.toLocaleTimeString("en-US"),
            progress: 0,
            processId: null,
            finished: false
        })

        console.log("RUN " + i + " = " + m)
    }

    runner.maxProcesses = 4 // temp, change to adjustable eventually

    try {
        let runResult = await runner.Run()

        console.log(runResult)

        sendStatusInfoMessage(false, "The parametric runner has exited successfully")
    } catch (err) {
        sendStatusWarningMessage(false, "The parametric runner closed unexpectedly with the reason: " + err)
        await runner.Stop()
    }

}

export function runNonParametric(homeDirectory, sourceBinary, executableName, data, runner) {

}