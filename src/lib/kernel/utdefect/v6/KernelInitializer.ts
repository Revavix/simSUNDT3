import { InitializerMode, type InitializerExecutionResult, type InitializerValidationResult, Initializer, type Run } from "../../../models/Kernel"
import { KernelSaver as KernelSaverUTDef6 } from "../../../kernel/utdefect/v6/KernelSaver"
import { BaseDirectory, documentDir, homeDir } from "@tauri-apps/api/path"
import { createDir, removeDir, removeFile } from "@tauri-apps/api/fs"
import { GenerateParametricCombinations } from "./KernelUtils"

export class KernelInitializer extends Initializer {


    constructor() {
        super()
        this.saver = new KernelSaverUTDef6()
        this.executable = "UTDef6.exe"
        this.binary = ""
        
        homeDir().then((v) => {
            this.home = v
        })
    }

    public async Execute(name: string): Promise<InitializerExecutionResult | undefined | string> {
        if (this.saver === null || !this.saver.rootNode) return Promise.reject("No valid saver found")

        let runs = this.mode === InitializerMode.PARAMETRIC ? GenerateParametricCombinations(this.saver.rootNode) : [this.saver?.rootNode]
        let validation: InitializerValidationResult = this.Validate(runs.length)

        if (validation.pass === false) return Promise.reject(validation.message)

        for (let i = 0; i < runs.length; i++) {
            let folder: string = name + "\\" + (i + 1)
            this.saver.rootNode = runs[i]

            // Create a new folder for each combination produced by constructParametricData
            await createDir("simSUNDT\\Simulations\\" + folder, { dir: BaseDirectory.Document, recursive: true })

            // Save each individual run data to folder created above
            await this.saver?.Save("simSUNDT\\Simulations\\" + folder + "\\utdefdat").catch((v) => {
                return Promise.reject("Failed to save the utdefdat file to folder (" + v + ")")
            })

            // Copy binary to the simulation folder
            //await copyFile(await resourceDir() + this.binary, await documentDir() + "simSUNDT\\Simulations\\" + folder + "\\" + this.executable)

            this.runner?.runs.push({
                executable: this.executable,
                path: await documentDir() + "simSUNDT\\Simulations\\" + folder,
                started: false,
                handle: null,
                watcherId: -1,
                closed: {
                    code: null,
                    signal: null
                }
            })
        }

        return await this.runner?.Execute(this.executable).then(() => {
            let retval: InitializerExecutionResult = {
                timestamp: new Date(),
                runs: this.runner?.runs !== undefined ? this.runner?.runs : []
            }

            // Clean up unused files post run
            this.runner?.runs.forEach(async (element) => {
                try {
                    await removeFile(element.path + "\\" + this.executable)
                    await removeDir(element.path + "\\utdefcontrol")
                    await removeDir(element.path + "\\utdefdat")
                } catch (e) {

                }
            });

            let faultyRuns: Array<Run> | undefined = this.runner?.runs.filter((run) => run.closed.code !== 0)

            if (faultyRuns !== undefined && faultyRuns?.length > 0) return Promise.reject("The subprocess of the kernel had faulty exit codes, the codes where [" + faultyRuns.map((r) => r.closed.code) + "]")

            return Promise.resolve(retval)
        }).catch((e) => {
            return Promise.reject(e)
        })
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