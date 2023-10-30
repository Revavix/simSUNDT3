import { kernelProgress } from "../../../data/Stores";
import { Runner } from "../../../models/Kernel";
import type { Run } from "../../../models/Kernel";
import { sendStatusInfoMessage } from "../../../utDefRunnerUtils";

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

    kernelProgress.set(parametricProgress)
}

export class KernelRunner extends Runner {
    
    constructor(processes: number) {
        super()
        this.aborted = false
        this.runs = []
        this.processes = processes
        this.retries = 5
        
        window.electronAPI.getHomeDir().then((v) => {
            this.home = v
        })
    }

    async Execute(): Promise<Array<Run>> {
        if (this.runs.length == 0) {
            return Promise.reject("No run data is set in the this.runs variable")
        }

        this.aborted = false

        sendStatusInfoMessage(true, "Attempting to start simulation, the runner will execute " + this.runs.length +
        " total simulation(s).")

        // Update the max parallel processes for the IPC
        await window.electronAPI.utDefMpInit(this.processes)

        while(this.runs.find((e) => e.finished === false)) {
            let freeProcessIdx = this.runs.findIndex((e) => e.processId === null && e.finished === false)
            let numberOfRuns = this.runs.filter((e) => e.processId !== null && e.finished === false).length

            if (freeProcessIdx != -1 && numberOfRuns < this.processes) {
                let process = await window.electronAPI.utDefMpStart(this.home + "/Documents/simSUNDT/Simulations/" + this.runs[freeProcessIdx].folder + "/" + "UTDef6.exe")
                this.runs[freeProcessIdx].processId = process == 'INVALID' ? null : process
            }

            await new Promise(r => setTimeout(r, 200));

            updateProgressForAllRuns(this.runs)
            updateFinishConditionForAllRuns(this.runs)
        }


        const retval = [...this.runs]
        this.runs = []

        return Promise.resolve(retval)
    }

    async Stop(): Promise<void> {
        for(let i = 0; i < this.runs.length; i++) {
            if (this.runs[i].processId !== null) {
                await window.electronAPI.utDefMpStop(this.runs[i].processId)
            }

            this.runs[i].finished = true
            this.runs[i].exitReason = 2
        }
    }
}