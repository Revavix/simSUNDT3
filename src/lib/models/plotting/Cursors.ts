import type { Position3D } from "../Positions"

export interface AScanCursor {
    xIndex: number
}

export interface BScanCursor {
    x: number
    yIndex: number
}

export interface CScanCursor {
    x: number
    y: number
}

export interface DScanCursor {
    x: number
    yIndex: number
}