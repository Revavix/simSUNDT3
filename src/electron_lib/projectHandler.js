const fs = require('fs')
const fsPromises = require('fs/promises')
const os = require('os')
const path = require('path')

class ProjectHandler {
    currentProject = null
    currentProjectPath = ""
    defaultProjectFolderPath = ""

    constructor() {
        this.defaultProjectFolderPath = os.homedir() + "/Documents/simSUNDT/Projects/"

        // Check that the projects folder exists, if not create it
        if (!fs.existsSync(this.defaultProjectFolderPath)) {
            fs.mkdirSync(this.defaultProjectFolderPath)
        }
    }

    async New(projectName, projectDirectoryPath, overwrite) {
        if (fs.existsSync(projectDirectoryPath + "/" + projectName + ".ssproj") && overwrite == false) {
            return Promise.resolve({status: "ERROR", msg: "Project already exists", data: {}})
        }

        let date = new Date()

        this.currentProject = {
            name: projectName,
            lastSaved: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
            data: {
                preprocessor: {},
                postprocessor: {}
            }
        }
        this.currentProjectPath = projectDirectoryPath + "/" + projectName + ".ssproj"

        let dataToSave = JSON.stringify(this.currentProject)

        try {
            const writeOperation = await fsPromises.writeFile(projectDirectoryPath + "/" + projectName + ".ssproj", dataToSave)
            return Promise.resolve({status: "OK", msg: "", data: this.currentProject})
        } catch (err) {
            return Promise.resolve({status: "ERROR", msg: "Filesystem error occured", data: err})
        }
    }

    // Save the currently assigned currentProject
    async Save(data) {
        if (!(data.hasOwnProperty("preprocessor")) || !(data.hasOwnProperty("postprocessor"))) {
            return Promise.resolve({status: "ERROR", msg: "Invalid data provided", data: {}})
        }

        let date = new Date()

        this.currentProject["lastSaved"] = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        this.currentProject["data"] = data

        let dataToSave = JSON.stringify(this.currentProject)

        try {
            const writeOperation = await fsPromises.writeFile(this.currentProjectPath, dataToSave)
            Promise.resolve({status: "OK", msg: "", data: this.currentProject})
        } catch (err) {
            return Promise.resolve({status: "ERROR", msg: "Filesystem error occured", data: err})
        }
    }

    // Load a project and assign it to currentProject, which is used by electron to forward the data as per renderer request
    async Load(projectPath) {
        // TODO: Add field validation
        if (!fs.existsSync(projectPath) || !(path.extname(projectPath) == '.ssproj')) {
            return Promise.resolve({status: "ERROR", msg: "The path provided does not contain a project, has an invalid extension, or format", data: null})
        }

        let rawData = fs.readFileSync(projectPath)
        let proj = JSON.parse(rawData.toString())
        
        this.currentProject = proj
        this.currentProjectPath = projectPath

        return Promise.resolve({status: "OK", msg: "", data: proj})
    }
}

module.exports.ProjectHandler = ProjectHandler