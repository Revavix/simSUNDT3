
import { utDefProgress } from './stores';
import { getExecName, sendStatusInfoMessage, sendStatusWarningMessage } from './utDefRunnerUtils';

async function updateFinishConditionForAllRuns(runs) {
    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].processId != null && runs[i].processId != 'INVALID' && runs[i].finished == false) {
            let status = await window.electronAPI.utDefMpGetStatus(runs[i].processId)
            
            if (status['exitCode'] == 0) {
                runs[i].finished = true
            } else if (status['exitCode'] == 2) {
                runs[i].finished = true
            } else if (status['exitCode'] != -1) {
                runs[i].finished = true
            }

            runs[i].exitReason = status['exitCode']
        }
    }
}

async function updateProgressForAllRuns(runs) {
    let parametricProgress = []

    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].processId != null && runs[i].processId != 'INVALID' && runs[i].finished == false) {
            let status = await window.electronAPI.utDefMpGetStatus(runs[i].processId)
            runs[i].progress = status['progress']
        }

        parametricProgress.push({
            progress: runs[i].finished == true ? 1 : runs[i].progress,
            finished: runs[i].finished
        })
    }

    utDefProgress.set(parametricProgress)
}

function getNumberOfActiveRuns(runs) {
    let num = 0

    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].processId != null && runs[i].finished == false) {
            num++
        }
    }

    return num
}

function getFirstInactiveIndex(runs) {
    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].processId == null && runs[i].finished == false) {
            return i
        }
    }

    return -1
}

function areAllRunsFinishedOrAborted(runs) {
    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].finished == false) {
            return false
        }
    }

    return true
}

export class UTDefectRunner {
    abort = false
    runs = null
    maxProcesses = 4
    retries = 5

    constructor(maxProcesses) {
        this.runs = []
        this.maxProcesses = maxProcesses
    }

    async Run() {
        if (this.runs.length == 0) {
            return Promise.reject("No run data is set in the this.runs variable")
        }

        this.abort = false

        const finishedRuns = []
        const platform = await window.electronAPI.getPlatform()
        const homeDir = await window.electronAPI.getHomeDir()
        const execName = getExecName(platform)

        sendStatusInfoMessage(true, "Attempting to start simulation, the runner will execute " + this.runs.length +
        " total simulation(s).")

        // Update the max parallel processes for the IPC
        await window.electronAPI.utDefMpInit(this.maxProcesses)

        while(!areAllRunsFinishedOrAborted(this.runs)) {
            // Check if we can start a run
            let idx = getFirstInactiveIndex(this.runs)

            if (idx != -1 && getNumberOfActiveRuns(this.runs) < this.maxProcesses) {
                let process = await window.electronAPI.utDefMpStart(homeDir + "/Documents/simSUNDT/Simulations/" + this.runs[idx].folder + "/" + execName)
                this.runs[idx].processId = process == 'INVALID' ? null : process
            }

            await new Promise(r => setTimeout(r, 200));

            updateProgressForAllRuns(this.runs)
            updateFinishConditionForAllRuns(this.runs)
        }

        this.runs.forEach(element => {
            finishedRuns.push({
                folder: element.folder,
                exitReason: element.exitReason
            })
        });

        this.runs = []

        return Promise.resolve(finishedRuns)
    }

    async Stop() {
        for(let i = 0; i < this.runs.length; i++) {
            if (this.runs[i].processId != null) {
                await window.electronAPI.utDefMpStop(this.runs[i].processId)
            }

            this.runs[i].finished = true
            this.runs[i].exitReason = 2
        }
    }
}