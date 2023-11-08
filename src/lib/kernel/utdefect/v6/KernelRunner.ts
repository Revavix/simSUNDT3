import { homeDir } from "@tauri-apps/api/path";
import { LoggingSingleton } from "../../../data/LoggingSingleton";
import { kernelProgress } from "../../../data/Stores";
import { Runner } from "../../../models/Kernel";
import type { Progress, Run } from "../../../models/Kernel";
import { LoggingLevel } from "../../../models/Logging";
import { Child, Command } from "@tauri-apps/api/shell";
import { readTextFile } from "@tauri-apps/api/fs";

export class KernelRunner extends Runner {
    progress: Array<Progress>
    loggingSingleton: LoggingSingleton
    
    constructor(processes: number) {
        super()
        this.progress = []
        this.aborted = false
        this.runs = []
        this.processes = processes
        this.retries = 5
        this.loggingSingleton = LoggingSingleton.GetInstance()
        
        homeDir().then((v) => {
            this.home = v
        })
    }

    private get MaxNumberOfProcesses() {
        return this.processes
    }

    private get NumActiveProccesses() {
        return this.runs.filter((r) => r.started && r.closed.code === null && r.closed.signal === null).length
    }

    private get UnfinishedRuns() {
        return this.runs.filter((r) => r.closed.code === null && r.closed.signal === null).length !== 0
    }

    private async StartProgressWatcher(run: Run, index: number): Promise<void> {
        run.watcherId = setInterval(async () => {
            let progressFileContents: string[] = (await readTextFile(run.path + "\\utdefcontrol")).split("\r\n")
            let lastLine: string = progressFileContents[progressFileContents.length-2]

            if (lastLine !== undefined) {
                let parsedLine = lastLine.split(/\s+/g)
                this.progress[index] = {
                    raw: {
                        freq: parseFloat(parsedLine[1]),
                        target: parseFloat(parsedLine[2])
                    },
                    progress: parseFloat(parsedLine[1]) / parseFloat(parsedLine[2]), 
                    finished: false 
                }
            } else {
                this.progress[index] = {
                    raw: {
                        freq: 0,
                        target: 0
                    },
                    progress: 0, 
                    finished: false 
                }
            }
        }, 100)
    }

    private async StopProgressWatcher(run: Run, index: number): Promise<void> {
        clearInterval(run.watcherId)
        this.progress[index] = {
            raw: {
                freq: this.progress[index].raw.freq,
                target: this.progress[index].raw.target
            },
            progress: 1, 
            finished: true 
        } 
    }
    
    public async Execute(): Promise<void> {
        if (this.runs?.length == 0) {
            return Promise.reject("No run data is set in the this.runs variable")
        }

        let commands: Array<Command> = []
        this.aborted = false
        this.progress = new Array<Progress>(this.runs.length)

        this.loggingSingleton.Log(LoggingLevel.INFO, "Attempting to start simulation, the runner will execute " + this.runs?.length +
        " total simulation(s).")

        // Prepare commands & their handlers
        for(let i = 0; i < this.runs.length; i++) {
            let cmd: Command = Command.sidecar("binaries/v6/UTDef6", [], { cwd: this.runs[i].path })

            cmd.on('close', data => {
                this.runs[i].closed.code = data.code
                this.runs[i].closed.signal = data.signal
                this.StopProgressWatcher(this.runs[i], i)
                kernelProgress.set(this.progress)
            })
            cmd.on('error', err => {
                this.runs[i].closed.code = -1
                this.runs[i].closed.signal = -1
                this.StopProgressWatcher(this.runs[i], i)
            })

            commands.push(cmd)
        }

        // Execute commands
        let index: number = 0
        while (this.UnfinishedRuns) {
            if (this.NumActiveProccesses < this.MaxNumberOfProcesses &&
                index < this.runs.length
            ) {
                this.runs[index].started = true
                commands[index].spawn().then((child: Child) => {
                    this.runs[index].handle = child
                    this.StartProgressWatcher(this.runs[index], index)
                    index += 1
                }).catch((e) => {
                    this.loggingSingleton.Log(LoggingLevel.WARNING, "Run " + index + " failed to start, canceling simulation(s)" + e)
                    return Promise.reject()
                })
            }

            kernelProgress.set(this.progress)

            await new Promise(r => setTimeout(r, 100));
        }

        return Promise.resolve()
    }

    public async Stop(): Promise<void> {
        this.runs.forEach(run => {
            run.handle?.kill()
        });
    }
}