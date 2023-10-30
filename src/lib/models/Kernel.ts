
interface StatusMessage {
    icon: string, 
    message: string, 
    color: string
}

export interface Run {
    processId: string | null,
    progress: number,
    folder: string,
    exitReason: number,
    finished: boolean
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
    home: string
    aborted: boolean
    runs: Array<Run>
    processes: number
    retries: number

    abstract Execute(executable: string): Promise<Array<Run> | string>

    abstract Stop(): Promise<void>
}

// KernelInitializer interfaces / enums / abstract classes
export interface KernelInitializerValidationResult {
    pass: boolean,
    message: string
}

export interface KernelInitializerExecutionResult {
    date: string,
    time: string,
    runs: Array<Run>
}

export enum KernelInitializerMode {
    PARAMETRIC,
    NON_PARAMETRIC
}