import { writable, type Writable } from "svelte/store";
import type { AScanCursor, BScanCursor, CScanCursor, DScanCursor } from "../../models/plotting/Cursors";

export const aScanCursor: Writable<AScanCursor> = writable()
export const bScanCursor: Writable<BScanCursor> = writable()
export const cScanCursor: Writable<CScanCursor> = writable()
export const dScanCursor: Writable<DScanCursor> = writable()