import { utDefStatus } from "./stores"
import { constructParametricData } from "./tree"
import { UTDefectIsoSaver } from "./utDefIsoSaver"
import { sendStatusInfoMessage, sendStatusWarningMessage } from "./utDefRunnerUtils"
import { constructIsoSaveData } from "./utDefSaverUtils"

async function cleanResultFolder(path, executableName) {
    console.log(path)

    const removedExecutable = await window.electronAPI.rmDir(path + "/" + executableName)
    const removedUtDefControl = await window.electronAPI.rmDir(path + "/utdefcontrol")
    const removedUtDefDat = await window.electronAPI.rmDir(path + "/utdefdat")

    return Promise.resolve()
}

export async function runParametric(homeDirectory, sourceBinary, executableName, data, runner) {
    const saver = new UTDefectIsoSaver()
    const runs = constructParametricData(data.tree, data.misc)

    for(let i = 0; i < runs.length; i++) {
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
            progress: 0,
            processId: null,
            finished: false,
            exitReason: null
        })

        console.log("RUN " + i + " = " + m)
    }

    runner.maxProcesses = data.misc.parametric.numProcesses

    try {
        let date = new Date()
        let runResult = await runner.Run()
        let returnStructure = {
            date: date.toLocaleDateString("en-US"),
            time: date.toLocaleTimeString("en-US"),
            runs: runResult
        }
        let failResults = []
        let genericFailRejection = false

        // Clean up unused files post run
        await runResult.forEach(async (element) => {
            await cleanResultFolder(homeDirectory + "/Documents/simSUNDT/Simulations/" + element.folder, executableName)
        });

        // Check if we should return a generic failure string or if we can assert it was a user cancellation
        runResult.forEach(e => {
            if (e.exitReason != 0) {
                failResults.push(e.exitReason)
            }
        })

        failResults.forEach(element => {
            if (element != 2) {
                genericFailRejection = true
            }
        });

        // Produce failure if one exists
        if (genericFailRejection && failResults.length > 0) {
            return Promise.reject("The parametric runner aborted unexpectedly, the program exited with the exit codes: " + failResults.toString())
        } else if (failResults.length > 0 && !genericFailRejection) {
            return Promise.reject("The parametric runner was cancelled by user")
        }

        sendStatusInfoMessage(false, "The parametric runner has exited successfully")

        return Promise.resolve(returnStructure)
    } catch (err) {
        sendStatusWarningMessage(false, "The parametric runner closed unexpectedly with the reason: " + err)
        await runner.Stop()

        return Promise.reject()
    }

}

export async function runNonParametric(homeDirectory, sourceBinary, executableName, data, runner) {
    const unixTs = Date.now()
    const saver = new UTDefectIsoSaver()
    const folder = "Non_Parametric_Run_" + unixTs.toString()

    await window.electronAPI.mkdir(homeDirectory + "/Documents/simSUNDT/Simulations/" + folder)

    saver.data = constructIsoSaveData(data.tree, data.misc)
    const saved = await saver.Save(homeDirectory + "/Documents/simSUNDT/Simulations/" + folder + "/utdefdat")

    if (!saved) {
        return Promise.reject("Failed to save the utdefdat file to folder")
    }

    const copied = await window.electronAPI.copyFile(sourceBinary, homeDirectory + "/Documents/simSUNDT/Simulations/" + folder + "/" + executableName)

    if (!copied) {
        return Promise.reject("Failed to copy the source binary to the target binary")
    }

    runner.runs = [
        {
            folder: folder,
            progress: 0,
            processId: null,
            finished: false,
            exitReason: null
        }
    ]

    runner.maxProcesses = 1

    try {
        let date = new Date()
        let runResult = await runner.Run()
        let returnStructure = {
            date: date.toLocaleDateString("en-US"),
            time: date.toLocaleTimeString("en-US"),
            result: runResult[0].folder
        }

        await cleanResultFolder(homeDirectory + "/Documents/simSUNDT/Simulations/" + runResult[0].folder, executableName)

        if (runResult[0].exitReason == 0) {
            return Promise.resolve(returnStructure)
        } else if (runResult[0].exitReason == 2) {
            return Promise.reject("Runner closed by user cancellation")
        } else if ((runResult[0].exitReason > 2 || runResult[0].exitReason == null) && runResult[0].exitReason != -1) {
            return Promise.reject("Runner closed unexpectedly with exit code " + runResult[0].exitReason)
        }
    } catch (err) {
        await runner.Stop()

        return Promise.reject()
    }
}