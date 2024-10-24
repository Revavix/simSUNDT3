import { writable, type Writable } from "svelte/store";
import type { CScanLoadedData } from "../../models/plotting/Data";

export const cScanLoadedData: Writable<CScanLoadedData> = writable()