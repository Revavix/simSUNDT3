import { InitializerMode, type InitializerExecutionResult, type InitializerValidationResult, Initializer } from "../../../models/Kernel"
import { constructParametricData } from "../../../tree"
import { UTDefectIsoSaver } from "../../../utDefIsoSaver"
import { constructIsoSaveData } from "../../../utDefSaverUtils"

export class KernelInitializer extends Initializer {


    constructor() {
        super()
        this.saver = new UTDefectIsoSaver()
        this.executable = "UTDef6.exe"
        this.binary = ""
        
        window.electronAPI.getHomeDir().then((v) => {
            this.home = v
        })
    }

    public async Execute(name: string, data: any): Promise<InitializerExecutionResult> {
        let runs = this.mode === InitializerMode.PARAMETRIC ? constructParametricData(data.tree, data.misc) : [constructIsoSaveData(data.tree, data.misc)]
        let validation: InitializerValidationResult = this.Validate(runs.length)

        if (validation.pass === false) return Promise.reject(validation.message)

        for (let i = 0; i < runs.length; i++) {
            let folder: string = name + "/" + (i + 1)
            this.saver.data = runs[i]

            // Create a new folder for each combination produced by constructParametricData
            await window.electronAPI.mkdir(this.home + "/Documents/simSUNDT/Simulations/" + folder)

            // Save each individual run data to folder created above
            await this.saver.Save(this.home + "/Documents/simSUNDT/Simulations/" + folder + "/utdefdat").then((v) => {
                if (v === false) return Promise.reject("Failed to save the utdefdat file to folder")
            })

            // Copy binary to the simulation folder
            await window.electronAPI.copyFile(this.binary, this.home + "/Documents/simSUNDT/Simulations/" + folder + "/" + this.executable).then((v) => {
                if (v === false) return Promise.reject("Failed to copy the source binary to the target binary")
            })

            this.runner.runs.push({ folder: folder, progress: 0, processId: null, finished: false, exitReason: null})
        }

        console.log(this.runner.runs)

        try {
            let date = new Date()
            let runResult = await this.runner.Execute(this.executable)
            let retval = {
                date: date.toLocaleDateString("en-US"), 
                time: date.toLocaleTimeString("en-US"),
                runs: runResult
            }
            let failResults = []
            let genericFailRejection = false
    
            // Clean up unused files post run
            await runResult.forEach(async (element) => {
                await window.electronAPI.rmDir(this.home + "/Documents/simSUNDT/Simulations/" + element.folder + "/" + this.executable)
                await window.electronAPI.rmDir(this.home + "/Documents/simSUNDT/Simulations/" + element.folder + "/utdefcontrol")
                await window.electronAPI.rmDir(this.home + "/Documents/simSUNDT/Simulations/" + element.folder + "/utdefdat")
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
    
            return Promise.resolve(retval)
        } catch (err) {
            await this.runner.Stop()
            return Promise.reject("The parametric runner closed with error " + err)
        }
    }

    private Validate(runs: number): InitializerValidationResult {
        if (runs > 500) {
            return {
                pass: false,
                message: "The total number of runs (" + runs + ") exceeds \
                the maximum permissible amount of concurrent runs of 500, please reduce the \
                number of runs by changing the simulation setup."
            }
        }

        return {
            pass: true,
            message: ""
        }
    }
}