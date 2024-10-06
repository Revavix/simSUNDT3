import { MathUtils } from "three/src/math/MathUtils.js";
import { Interpolation, Rectification, type Metadata } from "../models/Result";
import { DistanceMode, DistancePath } from "../models/SoundYAxisMode";

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

export function calculateDistance(metadata: Metadata, mode: DistanceMode, path: DistancePath, y: number): number {
    return (metadata.timegate.start + (y * metadata.timegate.increment)) * 
        (mode === DistanceMode.Compressional ? metadata.wavespeeds.compressional : metadata.wavespeeds.shear) * 
        (path === DistancePath.True ? Math.cos(MathUtils.degToRad(metadata.probe.true_angle)) : 1)
}

export function calculateTime(metadata: Metadata, y: number): number {
    return (metadata.timegate.start + (y * metadata.timegate.increment)) * Math.pow(10, -6)
}