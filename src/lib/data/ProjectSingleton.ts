import { basename, extname } from "@tauri-apps/api/path"
import type { Project } from "../models/Project"
import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs"
import { writable, type Subscriber, type Writable } from "svelte/store"
import Root from "../tree/Root"
import TreeNode from "../models/tree/TreeNode"
import { Deserialize, Serialize } from "../tree/Utils"

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
                    tree: Object.assign(new TreeNode("Root", false, null), Root),
                    misc: {
                        accuracy: "3",
                        binaryPath: "binaries/v6/UTDef6",
                        cloudEndpoint: "",
                        parametric: {
                            numProcesses: 4
                        },
                        viewport: {
                            showOrigin: false,
                            showAxes: true,
                            showGrid: true
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
                    tree: Object.assign(new TreeNode("Root", false, null), Root),
                    misc: {
                        accuracy: "3",
                        binaryPath: "binaries/v6/UTDef6",
                        cloudEndpoint: "",
                        parametric: {
                            numProcesses: 4
                        },
                        viewport: {
                            showOrigin: false,
                            showAxes: true,
                            showGrid: true
                        }
                    }
                },
                postprocessor: []
            }
        } as Project

        this._store.set(this._active)

        return Promise.resolve()
    }

    public async Save(path: string): Promise<void> { 
        try {
            this._active.path = path
            this._active.name = await basename(path, ".ssproj")
            this._store.set(this._active)
            let saveData: any = {
                name: this._active.name,
                path: this._active.path,
                data: {
                    preprocessor: {
                        tree: Serialize(this._active.data.preprocessor.tree !== null ? this._active.data.preprocessor.tree : {} as TreeNode),
                        misc: this._active.data.preprocessor.misc
                    },
                    postprocessor: this._active.data.postprocessor
                }
            }
            await writeFile(path, JSON.stringify(saveData, null, 4))
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

        let saveData: any = JSON.parse(await readTextFile(path))
        this._active.name = saveData.name
        this._active.path = saveData.path
        this._active.data.preprocessor.misc = saveData.data.preprocessor.misc
        this._active.data.preprocessor.tree = Deserialize(saveData.data.preprocessor.tree)
        this._active.data.postprocessor = saveData.data.postprocessor
        this._store.set(this._active)

        this._active.data.postprocessor.forEach((element) => {
            element.timestamp = new Date(element.timestamp)
        })

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