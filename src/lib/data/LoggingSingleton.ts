import { writable, type Unsubscriber, type Writable, get } from "svelte/store"
import type { LoggingEntry } from "../models/Logging"
import { LoggingLevel } from "../models/Logging"

export class LoggingSingleton {
    private _logs: Writable<LoggingEntry[]>
    private _maxEntries: number
    private static _instance: LoggingSingleton

    private constructor() {
        this._logs = writable([] as LoggingEntry[])
        this._maxEntries = 500
    }

    public static GetInstance(): LoggingSingleton {
        if (!LoggingSingleton._instance) LoggingSingleton._instance = new LoggingSingleton()
        return LoggingSingleton._instance
    }
    
    public set MaxEntries(maxEntries: number) {
        this._maxEntries = maxEntries
    }

    public get MaxEntries() {
        return this._maxEntries
    }

    public Subscribe(fnc: (logs: Array<LoggingEntry>) => void): Unsubscriber {
        return this._logs.subscribe(fnc)
    }

    public Log(level: LoggingLevel, message: string) {
        let logs = get(this._logs)
        if (logs.length >= this._maxEntries) return
        this._logs.update((v) => [...v, {
            icon: level === LoggingLevel.INFO ? "info" : "warning",
            message: message,
            color: level === LoggingLevel.INFO ? "#4d4d4d" : "#ef4444"
        }])
    }

    public Clear() {
        this._logs.set([] as LoggingEntry[])
    }
}