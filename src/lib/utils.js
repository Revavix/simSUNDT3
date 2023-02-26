import { fileCache } from "./stores"

export function byteArrayToStr(arr) {
    let str = ""

    for(let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i])
    }

    return str
}

export function strToByteArray(str) {
    let arr = new Uint8Array(str.length)

    for(let i = 0; i < str.length; i++) {
        arr[i] = (str.charCodeAt(i))
    }

    return arr
}

export async function writeCache(project, path) {
    const homePath = await window.electronAPI.getHomeDir()
    let exists = await window.electronAPI.fileExists(homePath + "/Documents/simSUNDT/files.sscache")
    let data = {}

    if (exists) {
        data = JSON.parse(await window.electronAPI.readFile(homePath + "/Documents/simSUNDT/files.sscache"))
    }
    
    data[project.name] = {
        path: path,
        lastSaved: project.lastSaved
    }
    
    return await window.electronAPI.writeFile(homePath + "/Documents/simSUNDT/files.sscache", JSON.stringify(data))
}

export async function fetchCache() {
    let data = []
    const homePath = await window.electronAPI.getHomeDir()
    const exists = await window.electronAPI.fileExists(homePath + "/Documents/simSUNDT/files.sscache")

    if (exists) {
        let raw = JSON.parse(await window.electronAPI.readFile(homePath + "/Documents/simSUNDT/files.sscache"))
        let deletedKeys = false
    
        for (const [key, value] of Object.entries(raw)) {
            if (await window.electronAPI.fileExists(value.path)) {
                data.push(
                    {
                        name: key,
                        path: value.path,
                        lastSaved: value.lastSaved
                    }
                )
            } else {
                deletedKeys = true
                delete data[key]
            }
        }
    
        if (deletedKeys) {
            window.electronAPI.writeFile(homePath + "/Documents/simSUNDT/files.sscache", JSON.stringify(data))
        }
    }

    fileCache.set(data)
}