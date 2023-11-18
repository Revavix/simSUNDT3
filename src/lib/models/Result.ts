import type { Position2D, Position3D } from "./Positions"

interface Signal extends Position3D {
    r: Array<Position2D>
}

export interface Metadata {
    path: string
    wavespeeds: {
        compressional: number,
        shear: number
    },
    coordinates: {
        x: {
            start: number,
            end: number,
            increment: number
        },
        y: {
            start: number,
            end: number,
            increment: number
        }
    },
    probe: {
        frequency: number,
        bandwidth: number,
        angle: number,
        couplant: number,
        size: Position2D,
        rotation: number,
        elements: Position2D,
        nearfield: {
            length: number,
            wavelength: number
        },
        true_angle: number
    },
    defect: {
        position: Position2D,
        depth: number,
        diameter: number
    },
    calibration: {
        diameter: number,
        depth: number
    },
    frequencies: number,
    timegate: {
        start: number,
        end: number,
        increment: number
    },
    accuracy: number,
    max_output: number
}

export interface Top {
    columns: number,
    rows: number,
    samples: number,
    amplitude: number,
    content: Array<Position3D>
}

export interface Point {
    amplitude: number,
    ref: {
        cols: number,
        samples: number
    }
    pos: Position2D
}

export interface Side {
    amplitude: number,
    ref: {
        cols: number,
        samples: number
    }
    y: number
}

export interface End {
    amplitude: number,
    ref: {
        rows: number,
        cols: number,
        samples: number
    }
    x: number
}

export enum LoadingState {
    LOADING = 0,
    OK = 1,
    INVALID = 2
}

export enum Rectification {
    UNRECTIFIED = 0,
    FULLWAVE = 1,
    HALFWAVE_POS = 2,
    HALFWAVE_NEG = 3
}

export enum Interpolation {
    OFF = 0,
    FAST = 1,
    BEST = 2
}