import { exists, readTextFile, copyFile } from "@tauri-apps/api/fs"
import type { Preset } from "../models/Preset"
import { SIMSUNDT_FOLDER } from "../models/PresetPaths"

export class PresetsSingleton {
    private _presets: Array<Preset>
    private static _instance: PresetsSingleton

    private constructor() {
        this._presets = new Array<Preset>()

        // Try to load the presets from the SIMSUNDT_FOLDER
        this.Initialize()
    }

    public static GetInstance(): PresetsSingleton {
        if (!PresetsSingleton._instance) PresetsSingleton._instance = new PresetsSingleton()
        return PresetsSingleton._instance
    }

    public Initialize(): void {
        // Check if the presets are already on the local disk in the SIMSUNDT_FOLDER
        // if not, copy the default presets from the resources folder to the SIMSUNDT_FOLDER
        // then load the presets from the SIMSUNDT_FOLDER
        exists(`${SIMSUNDT_FOLDER}/presets.json`).then((result) => {
            if (result) {
                readTextFile(`${SIMSUNDT_FOLDER}/presets.json`).then((data) => {
                    this._presets = data === null ? [] : JSON.parse(data)
                })
            } else {
                copyFile(`resources/presets.json`, `${SIMSUNDT_FOLDER}/presets.json`).then(() => {
                    readTextFile(`${SIMSUNDT_FOLDER}/presets.json`).then((data) => {
                        this._presets = data === null ? [] : JSON.parse(data)
                    })
                })
            }
        })
    }

    public async Refresh(): Promise<void> {
        await readTextFile(`${SIMSUNDT_FOLDER}/presets.json`).then((data) => {
            this._presets = data === null ? [] : JSON.parse(data)
        })

        return Promise.resolve()
    }

    public get Presets(): Array<Preset> {
        return this._presets
    }
}