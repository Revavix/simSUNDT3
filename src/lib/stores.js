import { writable } from 'svelte/store'

export const densityAndSignalData = writable({
    data: [
        {x: 0, y: 0, z: 0}
    ]
})

export const selectedSignalData = writable([])

export const interpolationMode = writable([])