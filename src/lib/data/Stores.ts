import type { Writable } from "svelte/store"
import { writable } from "svelte/store"
import type { End, Metadata, Point, Side } from "../models/Result"
import type { Progress, Status } from "../models/Kernel"
import type { FileCache } from "../models/FileCache"

// Previously fileCache
export const cache: Writable<Array<FileCache>> = writable()

// Previously utDefProgress
export const kernelProgress: Writable<Array<Progress>> = writable()

// Previously utDefStatus
export const kernelStatus: Writable<Status> = writable()

// Previously densityAndSignalData
export const loadedMetadata: Writable<Metadata> = writable()

// Selected positions for A, B and D scans
export const selectedPosSignal: Writable<Point> = writable()
export const selectedPosSide: Writable<Side> = writable()
export const selectedPosEnd: Writable<End> = writable()

// Interpolation mode, smoothing of C scan
export const interpolationMode: Writable<Array<string | boolean>> = writable([])

// Active tab
export const activeTab: Writable<string> = writable("File")