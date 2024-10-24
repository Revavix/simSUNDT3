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
        couplant: number,
        wave_properties: {
            type_of_probe: number
            angle: number,
            rotation: number,
            size: Position2D,
            elements: Position2D,
            nearfield: {
                length: number,
                wavelength: number
            },
        } | null,
        immersion_properties: {
            fluid_wavespeed: number,
            density_ratio: number,
            distance: number,
            eulers: Position3D
        } | null,
        true_angle: number | null,
        focal_distance: number | null
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
    topData: Top,
    pos: Position2D,
    forceRefresh: boolean
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