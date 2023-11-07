import { BaseDirectory, exists, writeFile } from "@tauri-apps/api/fs";
import { tree, constructDefaultTreeData } from "./tree";
import { writeCache } from "./utils";
import { extname, homeDir } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/api/fs'

export class ProjectHandler {
    projectHomeDir = ""
    currentProject = {
        name: "Untitled Project",
        lastSaved: "",
        data: {
            preprocessor: {
                tree: {},
                misc: {
                    parametric: {}
                }
            },
            postprocessor: [
                
            ]
        }
    }
    currentProjectPath = undefined

    constructor() {
        homeDir().then((v) => {
            this.projectHomeDir = v + "/Documents/simSUNDT/Projects"
        })

        // Create a new project on app instantiation
        this.New()
    }

    // Creates a new project and assigns it as the current project
    async New() {
        let date = new Date()

        this.currentProject = {
            name: "Untitled Project",
            lastSaved: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
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
        this.currentProjectPath = undefined

        return Promise.resolve({status: "OK", msg: "", data: ""})
    }

    async Save() {
        if (this.currentProjectPath == undefined) {
            return Promise.resolve({status: "ERROR", msg: "The current project path is invalid, unable to save", data: ""})
        }

        try {
            // Update date
            let date = new Date()
            this.currentProject["lastSaved"] = date.toLocaleDateString() + " " + date.toLocaleTimeString()

            // Save the project using new date data and currently stored data
            await writeFile(this.currentProjectPath, JSON.stringify(this.currentProject))

            // Update cache
            await writeCache(this.currentProject, this.currentProjectPath)

            return Promise.resolve({status: "OK", msg: "", data: this.currentProject})
        } catch (err) {
            return Promise.resolve({status: "ERROR", msg: "Filesystem error occured", data: err})
        }
    }

    async Load(path) {
        const exist = await exists(path)
        const extension = await extname(path)
        
        if (!exist || !(extension == '.ssproj')) {
            return Promise.resolve({status: "ERROR", msg: "The path provided does not contain a project, has an invalid extension, or format", data: null})
        }

        let project = JSON.parse(await readTextFile(path))
        
        this.currentProject = project
        this.currentProjectPath = path

        return Promise.resolve({status: "OK", msg: "", data: project})
    }
}