import { basename, extname } from "@tauri-apps/api/path"
import type { Project } from "../models/Project"
import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs"
import { SIMSUNDT_PROJECT_FOLDER } from "../models/PresetPaths"
import { constructDefaultTreeData, tree } from "../tree"

export class ProjectSingleton {
    private _projectUpdateSubscriberCallbacks: Array<(project: Project) => void>
    private _treeSubscriberCallbacks: Array<(tree: any) => void>
    private _active: Project
    private static _instance: ProjectSingleton

    private constructor() {
        this._projectUpdateSubscriberCallbacks = new Array()
        this._treeSubscriberCallbacks = new Array()
        this._active = {
            name: "Untitled Project",
            path: SIMSUNDT_PROJECT_FOLDER + "Untitled Project.ssproj",
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
    }

    public static GetInstance(): ProjectSingleton {
        if (!ProjectSingleton._instance) ProjectSingleton._instance = new ProjectSingleton()
        return ProjectSingleton._instance
    }

    public TriggerProjectUpdateSubscribers() {
        this._projectUpdateSubscriberCallbacks.forEach((v) => {
            v(this._active)
        })
    }

    public TriggerTreeUpdateSubscribers() {
        this._treeSubscriberCallbacks.forEach((v) => {
            v(this._active.data.preprocessor.tree)
        })
    }

    public SubscribeProjectUpdate(fnc: (project: Project) => void) {
        this._projectUpdateSubscriberCallbacks.push(fnc)
        this.TriggerProjectUpdateSubscribers()
    }

    public SubscribeTreeData(fnc: (tree: any) => void) {
        this._treeSubscriberCallbacks.push(fnc)
        this.TriggerTreeUpdateSubscribers()
    }

    public async New(): Promise<void> {
        this._active = {
            name: "Untitled Project",
            path: SIMSUNDT_PROJECT_FOLDER + "\\Untitled Project.ssproj",
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

        this.TriggerProjectUpdateSubscribers()

        return Promise.resolve()
    }

    public async Save(path: string): Promise<void> { 
        try {
            this._active.path = path
            this._active.name = await basename(path, ".ssproj") 
            await writeFile(path, JSON.stringify(this._active))
            this.TriggerProjectUpdateSubscribers()
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

        this.TriggerProjectUpdateSubscribers()

        return Promise.resolve()
    }

    public async PushPostprocessorData(data: any) {
        this._active.data.postprocessor.push(data)
        this.TriggerProjectUpdateSubscribers()
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