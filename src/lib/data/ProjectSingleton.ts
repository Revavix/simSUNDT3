import { basename, extname } from "@tauri-apps/api/path"
import type { Project } from "../models/Project"
import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs"
import { constructDefaultTreeData, tree } from "../tree.js"
import { writable, type Subscriber, type Writable } from "svelte/store"

export class ProjectSingleton {
    private _active: Project
    private _store: Writable<Project>
    private static _instance: ProjectSingleton

    private constructor() {
        this._active = {
            name: "Untitled Project",
            path: null,
            data: {
                preprocessor: {
                    tree: constructDefaultTreeData({}, tree.children),
                    misc: {
                        accuracy: "3",
                        binaryPath: "resources\\bin\\UTDef6.exe",
                        cloudEndpoint: "",
                        parametric: {
                            numProcesses: 4
                        }
                    }
                },
                postprocessor: []
            }
        }
        this._store = writable(this._active)
    }

    public static GetInstance(): ProjectSingleton {
        if (!ProjectSingleton._instance) ProjectSingleton._instance = new ProjectSingleton()
        return ProjectSingleton._instance
    }

    public ForceRefresh() {
        return this._store.set(this._active)
    }

    public Subscribe(fnc: Subscriber<Project>) {
        return this._store.subscribe(fnc)
    }

    public async New(): Promise<void> {
        this._active = {
            name: "Untitled Project",
            path: null,
            data: {
                preprocessor: {
                    tree: constructDefaultTreeData({}, tree.children),
                    misc: {
                        accuracy: "3",
                        binaryPath: "resources\\bin\\UTDef6.exe",
                        cloudEndpoint: "",
                        parametric: {
                            numProcesses: 4
                        }
                    }
                },
                postprocessor: []
            }
        }

        this._store.set(this._active)

        return Promise.resolve()
    }

    public async Save(path: string): Promise<void> { 
        try {
            this._active.path = path
            this._active.name = await basename(path, ".ssproj")
            this._store.set(this._active)
            await writeFile(path, JSON.stringify(this._active))
            return Promise.resolve()
        } catch (err) {
            return Promise.reject()
        }
    }

    public async Load(path: string): Promise<void> { 
        const exist = await exists(path)
        const extension = await extname(path)
        
        if (!exist || !(extension == 'ssproj')) {
            return Promise.reject()
        }
        
        this._active = JSON.parse(await readTextFile(path))
        this._store.set(this._active)

        return Promise.resolve()
    }

    public async PushPostprocessorData(data: any) {
        this._active.data.postprocessor.push(data)
        this._store.set(this._active)
    }

    // Getter / setters
    public get Accuracy() {
        return this._active.data.preprocessor.misc.accuracy
    }

    public set Accuracy(accuracy: string) {
        this._active.data.preprocessor.misc.accuracy = accuracy
    }

    public get ProcessCount() {
        return this._active.data.preprocessor.misc.parametric.numProcesses
    }

    public set ProcessCount(num: number) {
        this._active.data.preprocessor.misc.parametric.numProcesses = num
    }

    public get BinaryPath() {
        return this._active.data.preprocessor.misc.binaryPath
    }

    public set BinaryPath(path: string) {
        this._active.data.preprocessor.misc.binaryPath = path
    }

    public get Path() {
        return this._active.path
    }

    public get Postprocessor() {
        return this._active.data.postprocessor
    }

    public get Tree() {
        return this._active.data.preprocessor.tree
    }

    public get Misc() {
        return this._active.data.preprocessor.misc
    }
}