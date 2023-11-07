import type { Child } from "@tauri-apps/api/shell"
import type { KernelSaver as KernelSaverUTDef6 } from "../kernel/utdefect/v6/KernelSaver"

interface StatusMessage {
    icon: string, 
    message: string, 
    color: string
}

export interface Run {
    executable: string,
    path: string
    started: boolean,
    handle: Child | null,
    watcherId: number
    closed: {
        code: number | null,
        signal: number | null
    }
}

export interface Status {
    running: boolean,
    message: StatusMessage
}

export interface Progress {
    progress: number,
    finished: boolean
}

// KernelRunner interfaces / enums / abstract classes
export abstract class Runner {
    home: string | null
    aborted: boolean | null
    runs: Array<Run>
    processes: number
    retries: number | null

    constructor() {
        this.home = null,
        this.aborted = null
        this.runs = [],
        this.processes = 4,
        this.retries = null
    }

    abstract Execute(executable: string): Promise<void>

    abstract Stop(): Promise<void>
}

// KernelInitializer interfaces / enums / abstract classes
export abstract class Initializer {
    saver: KernelSaverUTDef6 | null
    runner: Runner | null
    executable: string
    binary: string
    home: string
    mode: InitializerMode | null

    constructor() {
        this.saver = null
        this.runner = null
        this.executable = "null"
        this.binary = "null"
        this.home = "null"
        this.mode = null
    }

    abstract Execute(name: string, data: any): Promise<InitializerExecutionResult | undefined | string>
}

export interface InitializerValidationResult {
    pass: boolean,
    message: string
}

export interface InitializerExecutionResult {
    timestamp: Date | null
    runs: Array<Run> | null
}

export enum InitializerMode {
    PARAMETRIC,
    NON_PARAMETRIC
}

// KernelSaver interfaces / enums / abstract classes
export abstract class Saver {
    abstract Save(destination: string): Promise<void>
}
