
import { utDefParametricProgress } from './stores';
import { calculateProgressFromActives, getExecName, sendProgressUpdate, sendStatusInfoMessage, sendStatusWarningMessage } from './utDefRunnerUtils';

async function updateFinishConditionForAllRuns(runs) {
    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].processId != null && runs[i].processId != 'INVALID' && runs[i].finished == false) {
            let status = await window.electronAPI.utDefMpGetStatus(runs[i].processId)
            
            if (status['exitCode'] == 0 || status['exitCode'] == 2) {
                runs[i].finished = true
            } else if (status['exitCode'] == null) {
                runs[i].processId = null
            } // mby problem here
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

    utDefParametricProgress.set(parametricProgress)
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

function areAllRunsFinished(runs) {
    for(let i = 0; i < runs.length; i++)
    {
        if (runs[i].finished == false) {
            return false
        }
    }

    return true
}

export class UTDefectParametricRunner {
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

        const platform = await window.electronAPI.getPlatform()
        const homeDir = await window.electronAPI.getHomeDir()
        const execName = getExecName(platform)

        sendStatusInfoMessage(true, "Attempting to start parametric simulation, the runner will execute " + this.runs.length +
        " total simulations.")

        // Update the max parallel processes for the IPC
        await window.electronAPI.utDefMpInit(this.maxProcesses)

        // New run logic BELOW
        while(!areAllRunsFinished(this.runs)) {
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

        this.runs = []

        return Promise.resolve()
    }

    async Stop() {
        for(let i = 0; i < this.runs.length; i++) {
            await window.electronAPI.utDefMpStop(this.runs[i].processId)
        }

        this.runs = []

        sendStatusWarningMessage(false, "Parametric simulation canceled by user")
    }
}















        // While we have meta data present, try to complete the runs
        /*
        while (this.meta.length != 0) {
            let process = 'INVALID'

            console.log(this.meta[metaIdx].folder)

            if (this.actives.length < metaOriginalCount) {
                process = await window.electronAPI.utDefMpStart(homeDir + "/Documents/simSUNDT/Simulations/" + this.meta[metaIdx].folder + "/" + execName)
            }

            console.log(this.actives.length + " " + this.meta.length + " metaidx " + metaIdx)

            if (process != 'INVALID') {
                // Send an update to Preprocessor subscribers about new process added
                sendStatusInfoMessage(true, "Initialized new process with ID " + process + 
                " with origin folder " + this.meta[metaIdx].folder)

                this.actives.push({
                    processId: process, 
                    metaIndex: metaIdx,
                    progress: 0
                })
                metaIdx++
            }

            for (let i = 0; i < this.actives.length; i++) {
                let status = await window.electronAPI.utDefMpGetStatus(this.actives[i].processId)
                this.actives[i].progress = status['progress'] / status['maxProgress']

                if (status['active'] == false && status['exitCode'] == 0) {
                    this.meta.splice(this.actives[i].metaIndex)
                } else if (status['active'] == false && status['exitCode'] != 0) {
                    return Promise.reject("UTDefectMultiprocessesIpc run ended unexpectedly with exit code " + status['exitCode'])
                }
            }

            let progress = calculateProgressFromActives(this.actives, metaOriginalCount)
            sendProgressUpdate(progress)

            await new Promise(r => setTimeout(r, 1000));
        }

        this.actives = []
        this.meta = []*/