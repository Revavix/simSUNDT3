import type { Writable } from "svelte/store"
import { writable } from "svelte/store"
import type { Position2D } from "../models/Positions"
import type { Result } from "../models/Result"
import type { Progress, Status } from "../models/Kernel"
import type { FileCache } from "../models/FileCache"

// Previously fileCache
export const cache: Writable<Array<FileCache>> = writable()

// Previously utDefProgress
export const kernelProgress: Writable<Array<Progress>> = writable()

// Previously utDefStatus
export const kernelStatus: Writable<Status> = writable()

// Previously densityAndSignalData
export const resultData: Writable<Result> = writable()

// Selected positions for A, B and D scans
export const selectedPosSignal: Writable<Position2D> = writable()
export const selectedPosSide: Writable<number> = writable()
export const selectedPosEnd: Writable<number> = writable()

// Interpolation mode, smoothing of C scan
export const interpolationMode = writable([])