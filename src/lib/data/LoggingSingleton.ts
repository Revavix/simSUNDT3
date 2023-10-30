import type { LoggingEntry } from "../models/Logging"
import { LoggingLevel } from "../models/Logging"

export class LoggingSingleton {
    private _logs: Array<LoggingEntry>
    private _callbacks: Array<(logs: Array<LoggingEntry>) => void>
    private _maxEntries: number
    private static _instance: LoggingSingleton

    private constructor() {
        this._callbacks = []
        this._logs = []
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

    public Subscribe(fnc: (logs: Array<LoggingEntry>) => void) {
        this._callbacks.push(fnc)
    }

    public Log(level: LoggingLevel, message: string) {
        if (this._logs.length >= this._maxEntries) return
        this._logs.push({
            icon: level === LoggingLevel.INFO ? "info" : "warning",
            message: message,
            color: level === LoggingLevel.INFO ? "#4d4d4d" : "#ef4444"
        })
        this._callbacks.forEach((v) => {
            v(this._logs)
        })
    }

    public Clear() {
        this._logs = []
    }
}