import { writable } from 'svelte/store'

export const fileCache = writable([])

export const utDefProgress = writable(0)

export const utDefParametricProgress = writable([])

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
    amplitudeMax: 5
})

export const selectedSignalData = writable({
    data: [{x: 0, y: 0}],
    amplitude: 1
})

export const selectedSideData = writable({
    data: [{x: 0, y: 0, z: 0}],
    amplitude: 1
})

export const selectedEndData = writable({
    data: [{x: 0, y: 0, z: 0}],
    amplitude: 1
})

export const interpolationMode = writable([])