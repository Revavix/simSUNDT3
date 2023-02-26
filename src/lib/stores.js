import { writable } from 'svelte/store'

export const fileCache = writable([])

export const densityAndSignalData = writable({
    data: [
        {x: 0, y: 0, z: 0, r: [{x: 0, y: 0}, {x: 1, y: 1}]}
    ],
    yi: 0.5
})

export const selectedSignalData = writable([
    {x: 0, y: 0}
])

export const interpolationMode = writable([])