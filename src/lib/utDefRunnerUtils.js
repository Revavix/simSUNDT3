import { utDefStatus } from "./stores"

export function getExecName(platform) {
    if (platform == 'darwin' || platform == 'linux') {
        return "UTDef6"
    } else if (platform == 'win32') {
        return "UTDef6.exe"
    }
}

export function sendStatusInfoMessage(running, msg) {
    utDefStatus.set({
        running: running,
        message: {
            icon: "info", 
            message: msg, 
            color: "#4d4d4d"
        }
    })
}

export function sendStatusWarningMessage(running, msg) {
    utDefStatus.set({
        running: running,
        message: {
            icon: "warning", 
            message: msg, 
            color: "#ef4444"
        }
    })
}

export function calculateProgressFromActives(activeRuns, totalRunCount) {
    let prog = 0

    for(let i = 0; i < activeRuns.length; i++) {
        prog += activeRuns[i].progress
    }

    return prog / totalRunCount
}