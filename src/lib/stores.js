import { writable } from 'svelte/store'

export const fileCache = writable([])

export const utDefProgress = writable([])

export const utDefStatus = writable({
    running: false,
    message: null
})

export const densityAndSignalData = writable({
    data: [
        {x: 0, y: 0, z: 0, r: [{x: 0, y: 0}, {x: 1, y: 1}]}
    ],
    columns: 10,
    rows: 10,
    xs: 0,
    ys: 0,
    xi: 1,
    yi: 0.5,
    numberOfSignalPoints: 2,
    amplitudeMax: 5,
    timeGateStart: 0,
    timeGateEnd: 0,
    compressionalWaveSpeed: 0,
    shearWaveSpeed: 0
})

export const selectedPosSignal = writable({x: 0, y: 0})
export const selectedPosSide = writable(0)
export const selectedPosEnd = writable(0)

export const interpolationMode = writable([])