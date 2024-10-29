import type { Position3D } from "../Positions";

export interface CScanLoadedData {
    currentCol: number,
    currentRow: number,
    cols: number,
    rows: number,
    samples: number,
    amplitude: number,
    content: Array<Position3D>
}