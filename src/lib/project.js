import { tree, ConstructDefaultTreeData } from "./tree";

export class ProjectCaching {
    homeDir = ""
    cache = []

    constructor() {
        window.electronAPI.getHomeDir().then((v) => {
            this.homeDir = v
        })
    }

    async Write(project, path) {
        let exists = await window.electronAPI.fileExists(this.homeDir + "/Documents/simSUNDT/files.sscache")
        let data = {}

        if (exists) {
            data = JSON.parse(await window.electronAPI.readFile(this.homeDir + "/Documents/simSUNDT/files.sscache"))
        }
        
        data[project.name] = {
            path: path,
            lastSaved: project.lastSaved
        }
        
        return await window.electronAPI.writeFile(this.homeDir + "/Documents/simSUNDT/files.sscache", JSON.stringify(data))
    }

    async Refresh() {
        this.cache = []
        const exists = await window.electronAPI.fileExists(this.homeDir + "/Documents/simSUNDT/files.sscache")

        if (exists) {
            let data = JSON.parse(await window.electronAPI.readFile(this.homeDir + "/Documents/simSUNDT/files.sscache"))
            let deletedKeys = false
        
            for (const [key, value] of Object.entries(data)) {
                if (await window.electronAPI.fileExists(value.path)) {
                    this.cache.push(
                        {
                            name: key,
                            path: value.path,
                            lastSaved: value.lastSaved
                        }
                    )
                } else {
                    deletedKeys = true
                    delete data[key]
                }
            }
        
            if (deletedKeys) {
                window.electronAPI.writeFile(this.homeDir + "/Documents/simSUNDT/files.sscache", JSON.stringify(data))
            }
        }

        return Promise.resolve(true)
    }
}

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
    }

    // Creates a new project and assigns it as the current project
    async New(projectName, path, overwrite) {
        const exists = await window.electronAPI.fileExists(path + "/" + projectName + ".ssproj")

        if (exists && overwrite == false) {
            return Promise.resolve({status: "ERROR", msg: "Project already exists", data: {}})
        }

        let date = new Date()

        this.currentProject = {
            name: projectName,
            lastSaved: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
            data: {
                preprocessor: {
                    tree: ConstructDefaultTreeData({}, tree.children),
                    misc: {}
                },
                postprocessor: {}
            }
        }
        this.currentProjectPath = path + "/" + projectName + ".ssproj"

        let dataToSave = JSON.stringify(this.currentProject)

        try {
            const write = await window.electronAPI.writeFile(path + "/" + projectName + ".ssproj", dataToSave)
            return Promise.resolve({status: "OK", msg: "", data: this.currentProject})
        } catch (err) {
            return Promise.resolve({status: "ERROR", msg: "Filesystem error occured", data: err})
        }
    }

    async Save() {
        if (this.currentProjectPath == undefined) {
            return Promise.resolve({status: "ERROR", msg: "The current project path is invalid, unable to save", data: ""})
        }

        let date = new Date()

        this.currentProject["lastSaved"] = date.toLocaleDateString() + " " + date.toLocaleTimeString()

        let dataToSave = JSON.stringify(this.currentProject)

        try {
            const write = await window.electronAPI.writeFile(this.currentProjectPath, dataToSave)
            Promise.resolve({status: "OK", msg: "", data: this.currentProject})
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