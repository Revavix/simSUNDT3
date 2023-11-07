import { cache } from "./data/Stores"

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

export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export function rectifyXY(data, amplitude, mode) {
    let r = []
    
    if (mode == 2) {
        data.forEach(element => {
            r.push({x: element.x, y: Math.abs(element.y / amplitude)})
        });
    } else if (mode == 3) { 
        data.forEach(element => {
            r.push({x: element.x, y: clamp(element.y / amplitude, 0, 1)})
        });
    } else if (mode == 4) { 
        data.forEach(element => {
            r.push({x: element.x, y: clamp(element.y / amplitude, -1, 0)})
        });
    } else {
        data.forEach(element => {
            r.push({x: element.x, y: element.y / amplitude})
        });
    }

    return r
}

export function rectifyXYZ(data, amplitude, mode) {
    let r = []

    if (mode == 2) {
        data.forEach(element => {
            r.push({x: element.x, y: element.y, z: Math.abs(element.z / amplitude)})
        });
    } else if (mode == 3) { 
        data.forEach(element => {
            r.push({x: element.x, y: element.y, z: clamp(element.z / amplitude, 0, 1)})
        });
    } else if (mode == 4) { 
        data.forEach(element => {
            r.push({x: element.x, y: element.y, z: clamp(element.z / amplitude, -1, 0)})
        });
    } else {
        data.forEach(element => {
            r.push({x: element.x, y: element.y, z: element.z / amplitude})
        });
    }

    return r
}