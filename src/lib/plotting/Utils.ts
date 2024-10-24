import { MathUtils } from "three/src/math/MathUtils.js";
import { Rectification, type Metadata } from "../models/Result";


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

export function calculateDistance(metadata: Metadata, 
    type: "Shear" | "Longitudinal", 
    path: "Soundpath" | "True", 
    y: number
): number {
    return (metadata.timegate.start + (y * metadata.timegate.increment)) * 
        (type === "Shear" ? metadata.wavespeeds.shear : metadata.wavespeeds.compressional) * 
        (path === "True" ? Math.sin(MathUtils.degToRad(metadata.probe.true_angle ?? metadata.probe.wave_properties?.angle ?? 90)) : 1)
}

export function calculateTime(metadata: Metadata, y: number): number {
    return (metadata.timegate.start + (y * metadata.timegate.increment)) * Math.pow(10, -6)
}