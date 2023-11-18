import { Interpolation, Rectification } from "../models/Result";

export function interpolationToZsmooth(interpolation: Interpolation): false | "fast" | "best" {
    switch(interpolation) {
        case Interpolation.OFF:
            break
        case Interpolation.BEST:
            return "best"
        case Interpolation.FAST:
            return "fast"
    }

    return false
}

export function rectify(rectification: Rectification, value: number): number {
    let rectified: number = value

    if (rectification === Rectification.FULLWAVE) {
        rectified = value < 0 ? value * -1 : value
    } else if (rectification === Rectification.HALFWAVE_POS) {
        rectified = value < 0 ? 0 : value
    } else if (rectification === Rectification.HALFWAVE_NEG) {
        rectified = value < 0 ? value * -1 : 0
    }

    return rectified
}