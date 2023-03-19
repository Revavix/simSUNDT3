import { tree, constructDefaultTreeData } from "./tree";
import { writeCache } from "./utils";

export class ProjectHandler {
    projectHomeDir = ""
    currentProject = {
        name: "Untitled Project",
        lastSaved: "",
        data: {
            preprocessor: {
                tree: {},
                misc: {}
            },
            postprocessor: {

            }
        }
    }
    currentProjectPath = undefined

    constructor() {
        window.electronAPI.getHomeDir().then((v) => {
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
                        accuracy: 3,
                        binaryPath: "",
                        cloudEndpoint: ""
                    }
                },
                postprocessor: {}
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
            await window.electronAPI.writeFile(this.currentProjectPath, JSON.stringify(this.currentProject))

            // Update cache
            await writeCache(this.currentProject, this.currentProjectPath)

            return Promise.resolve({status: "OK", msg: "", data: this.currentProject})
        } catch (err) {
            return Promise.resolve({status: "ERROR", msg: "Filesystem error occured", data: err})
        }
    }

    async Load(path) {
        const exists = await window.electronAPI.fileExists(path)
        const extname = await window.electronAPI.extname(path)

        if (!exists || !(extname == '.ssproj')) {
            return Promise.resolve({status: "ERROR", msg: "The path provided does not contain a project, has an invalid extension, or format", data: null})
        }

        let project = JSON.parse(await window.electronAPI.readFile(path))
        
        this.currentProject = project
        this.currentProjectPath = path

        return Promise.resolve({status: "OK", msg: "", data: project})
    }
}