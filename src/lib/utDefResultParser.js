import { byteArrayToStr, strToByteArray } from './utils.js'

export class UTDefResultParser
{
    constructor() {
        
    }

    async Extract(simulationResultFolder) {
        try {
            const utindefa = await window.electronAPI.readFile(simulationResultFolder + "/utIndefa.txt")
            const dataDensityRaw = await window.electronAPI.readFileBytes(simulationResultFolder + "/utIndefa-C.dat")
            const dataSignalRaw = await window.electronAPI.readFileBytes(simulationResultFolder + "/utIndefa-A.dat")

            return Promise.resolve({
                parameters: utindefa,
                binaryDensityData: byteArrayToStr(dataDensityRaw),
                binarySignalData: byteArrayToStr(dataSignalRaw)
            })
        } catch (err) {
            return Promise.resolve({})
        }
    }

    async Parse(data) {
        let xStart = 0
        let yStart = 0
        let xIncrement = 0
        let yIncrement = 0
        let stepOfResponse = 0

        // Parse coordinate origins for C-scan coordinate construction
        try {
            let utindefa = data.parameters
            let utindefData = utindefa.split("\r\n")
            let numbers = []
            let matches = 0

            for(let i = 0; i < utindefData.length; i++) {
                if (utindefData[i].includes("Scan along x axis, start, end and increment")) {
                    numbers = utindefData[i+1].match(/(\+|\-)?\d+.\d+/gm)

                    xStart = parseFloat(numbers[0])
                    xIncrement = parseFloat(numbers[2])
                    matches |= 1 << 1
                }

                if (utindefData[i].includes("Scan along y axis, start, end and increment")) {
                    numbers = utindefData[i+1].match(/(\+|\-)?\d+.\d+/gm)

                    yStart = parseFloat(numbers[0])
                    yIncrement = parseFloat(numbers[2])
                    matches |= 1 << 2
                }

                if (utindefData[i].includes("The time start, end, and increment: ")) {
                    numbers = utindefData[i].match(/(\+|\-)?\d+.\d+/gm)

                    stepOfResponse = parseFloat(numbers[2])
                    matches |= 1 << 3
                }
            }

            if (!(matches & (1 << 1) && matches & (1 << 2) && matches & (1 << 3))) {
                return Promise.resolve({})
            }
        } catch (err) {
            return Promise.resolve({})
        }


        // Parse Z signal data for density plot (C-scan)
        const dataDensityRaw = await strToByteArray(data.binaryDensityData)
        let dataDensityParsed = new Float32Array(dataDensityRaw.buffer)

        // Read A data and construct from bytes
        const dataSignalRaw = await strToByteArray(data.binarySignalData)
        let dataSignalParsed = new Float32Array(dataSignalRaw.buffer)

        // Construct valid X, Y, Z data format for density plots
        let coordinates = []

        for(let y = 0; y < dataDensityParsed[1]; y++) {
            for (let x = 0; x < dataDensityParsed[0]; x++) {
                let xindex = 0
                let signals = []
                let idx = x + (y * dataDensityParsed[0])

                for (let i = idx * dataDensityParsed[2]; i < (idx+1) * dataDensityParsed[2]; i++) {
                    signals.push({
                        x: dataDensityParsed[3] + (stepOfResponse * (i % dataDensityParsed[2])),
                        y: dataSignalParsed[i]
                    })
                }

                coordinates.push({
                    x: xStart + x * xIncrement,
                    y: yStart + y * yIncrement,
                    z: dataDensityParsed[10 + idx],
                    r: signals
                })
            }

            // Top level loop await to prevent UI freeze
            await new Promise(r => setTimeout(r, 1));
        }

        return Promise.resolve({
            xs: xStart,
            ys: yStart,
            xi: xIncrement,
            yi: yIncrement,
            columns: dataDensityParsed[0],
            rows: dataDensityParsed[1],
            numberOfSignalPoints: dataDensityParsed[2],
            timeGateStart: dataDensityParsed[3] * Math.pow(10, -6),
            timeGateEnd: dataDensityParsed[4] * Math.pow(10, -6),
            trueAngle: dataDensityParsed[5],
            calibrationLevel: dataDensityParsed[6],
            amplitudeMax: dataDensityParsed[7],
            data: coordinates
        })
    }
}