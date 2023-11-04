import type { Position2D, Position3D } from "./Positions"

interface Wavespeeds {
    compressional: number,
    shear: number
}

interface Timegate {
    start: number,
    end: number
}

interface Signal extends Position3D {
    r: Array<Position2D>
}

export interface Result {
    start: Position2D,
    increment: Position2D
    wavespeeds: Wavespeeds
    columns: number,
    rows: number,
    samples: number,
    timegate: Timegate,
    trueAngle: number,
    calibration: number,
    amplitude: number,
    data: Array<Signal>
}

export interface ResultInfo {
    calibration: number
}