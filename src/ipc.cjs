const { app, ipcMain, dialog, BrowserWindow } = require('electron')
const os = require('os')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const readline = require('readline');

class GenericIpc {
    constructor() {
        ipcMain.handle('get-platform', async() => {
            return process.platform
        })

        ipcMain.handle('get-default-binary-path', async () => {
            if (process.platform == 'darwin') {
                return "/usr/local/bin/UTDefect6"
            } else if (process.platform == 'linux') {
                return "/usr/bin/UTDefect6"
            } else if (process.platform == 'win32') {
                return "C:/utdefect/UTDefect6.exe"
            }
        })

        ipcMain.handle('get-basename', async(ev, p) => {
            return Promise.resolve(path.basename(p, path.extname(p)))
        })

        ipcMain.handle('os-get-home-dir', async () => {
            return os.homedir()
        })

        ipcMain.handle('copy-file', async(ev, src, target) => {
            try {
                fs.copyFileSync(src, target)

                return Promise.resolve(true)
            } catch (err) {
                process.stdout.write(err.toString())
                return Promise.resolve(false)
            }
        })

        ipcMain.handle('rmdir', async(ev, dirPath) => {
            try {
                await fs.promises.rm(dirPath, {recursive: true, force: true})
            } catch (err) {
                return Promise.resolve(false)
            }

            return Promise.resolve(true)
        })

        ipcMain.handle('read-file', async(ev, filePath) => {
            return fs.readFileSync(filePath).toString()
        })

        ipcMain.handle('read-file-bytes', async(ev, filePath) => {
            const bytes = fs.readFileSync(filePath)

            return new Uint8Array(bytes)
        })

        ipcMain.handle('write-file', async(ev, filePath, data) => {
            try {
                fs.writeFileSync(filePath, data)

                return true
            } catch (err) {
                return false
            }
        })

        ipcMain.handle('write-file-binary', async(ev, filePath, data) => {
            try {
                let buf = Buffer.from(data).toString('binary')
                fs.writeFileSync(filePath, buf)

                return true
            } catch (err) {
                return false
            }
        })

        ipcMain.handle('write-file-by-lines', async(ev, filePath, data) => {
            data.forEach(element => {
                fs.appendFileSync(filePath, element + "\n", )
            });
        
            return Promise.resolve(true);
        })

        ipcMain.handle('file-exists', async(ev, src) => {
            try {
                return Promise.resolve(fs.existsSync(src))
            } catch {
                return Promise.resolve(false)
            }
        })

        ipcMain.handle('extname', async(ev, trgtPath) => {
            return path.extname(trgtPath)
        })

        ipcMain.handle('mkdir', async(ev, folderPath) => {
            let dirMade = undefined

            try {
                dirMade = await fs.promises.mkdir(folderPath, {recursive: true})
            } catch (err) {
                return Promise.resolve(false)
            }

            if (dirMade != undefined) {
                return Promise.resolve(true)
            } else {
                return Promise.resolve(false)
            }
        })

        ipcMain.handle('open-folder-modal', async(ev, defaultPath) => {
            // Called by renderer to assign a new folder location where to store the project file
            let win = BrowserWindow.fromWebContents(ev.sender)

            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
                defaultPath: defaultPath.defaultProjectFolderPath,
                properties: ['openDirectory']
            })
        
            if (canceled) {
                return ""
            } else {
                return Promise.resolve(filePaths[0])
            }
        })

        ipcMain.handle('open-file-modal', async(ev, defaultPath, filters) => {
            let win = BrowserWindow.fromWebContents(ev.sender)

            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
                defaultPath: defaultPath,
                filters: filters,
                properties: ['openFile']
            })

            if (canceled) {
                return ""
            } else {
                return Promise.resolve(filePaths[0])
            }
        })

        ipcMain.handle('open-save-modal', async(ev, defaultPath, filters) => {
            let win = BrowserWindow.fromWebContents(ev.sender)

            const { canceled, filePath } = await dialog.showSaveDialog(win, {
                defaultPath: defaultPath,
                filters: filters
            })

            if (canceled) {
                return Promise.resolve({fileName: null, fullPath: null})
            } else {
                return Promise.resolve({fileName: path.parse(filePath).name, fullPath: filePath})
            }
        })

        ipcMain.handle('inspect', async(ev, filePath) => {
            spawn("notepad", [filePath])
        })

        ipcMain.handle('readdir', (ev, path) => {
            return fs.readdirSync(path)
        })
    }
}

class UTDefectMultiprocessesIpc {
    // Thread status and related UTDef info for each thread
    stopSignal = false
    maxProcesses = 4
    status = {}

    constructor() {
        // Initialize for up to 64 processes
        this.init()

        ipcMain.handle('utdef-mp-init', async (ev, num) => this.init(num))
        ipcMain.handle('utdef-mp-start', async (ev, executablePath) => this.start(executablePath))
        ipcMain.handle('utdef-mp-stop', async (ev, processId) => this.stop(processId))
        ipcMain.handle('utdef-mp-get-status', async (ev, processId) => this.getStatus(processId))
    }

    async init(num) {
        this.status = {}

        for (let i = 0; i < num; i++) {
            this.status['PROCESS_' + i] = {
                process: null,
                progress: 0,
                exitCode: 0
            }
        }
    }


    // Add a process to status and start listening for progress
    async start(executablePath) {
        let processId = 'INVALID'

        for (const [k, v] of Object.entries(this.status)) {
            if (this.status[k].process == null) {
                processId = k
                break
            }
        }

        if (processId != 'INVALID') {
            this.status[processId].progress = 0
            this.status[processId].exitCode = -1
            this.status[processId].process = spawn(executablePath, { cwd: path.parse(executablePath).dir })

            const progressReadInterval = setInterval(() => this.updateProgress(processId, path.parse(executablePath).dir + "/utdefcontrol"), 200)

            this.status[processId].process.on('close', code => {
                this.status[processId].process = null
                this.status[processId].exitCode = code == null ? this.status[processId].exitCode : code
                clearInterval(progressReadInterval)
                process.stdout.write("UTDef process closed with code " + code + " \n")
            })
        }

        return processId
    }

    // Stop the given thread running UTDef
    async stop(processId) {
        if (this.status[processId].process == null) {
            return
        }

        this.status[processId].process.kill()
        this.status[processId].process = null
        this.status[processId].exitCode = 2
    }

    // Get a status object of if the process is active and its current progress as per file readout
    async getStatus(processId) {
        return {
            active: this.status[processId].process == null ? false : true,
            exitCode: this.status[processId].exitCode,
            progress: this.status[processId].progress
        }
    }

    // For internal use
    async updateProgress(idx, progressFilePath) {
        const data = fs.readFileSync(progressFilePath,
        {encoding: 'utf-8', flag: 'r'}).split("\n")
        const line = data[data.length-2]

        try {
            let strData = (line.toString()).match(/[\d]+/g)
            this.status[idx].progress = parseInt(strData[0]) / parseInt(strData[1])
        } catch (err) {
            
        }
    }
}

class UTDefectIpc {
    childProcess = null
    currentProgress = 0
    maxProgress = 0
    active = false

    // [{
    //     process: null
    //     progress: 0
    //     maxProgress: 100
    //     
    // }]

    constructor() {
        ipcMain.handle('utdef-start-std', async(event, pathToBinary, inputPath) => {
            this.childProcess = spawn(pathToBinary, ["-I", inputPath, "-M", "std"])
        
            process.stdout.write("Starting UTDef process from Electron using path " + pathToBinary + "\n")
        
            this.childProcess.on('spawn', function () {
                this.active = true
            })
        
            this.childProcess.stdout.on('data', function(data) {
                let strData = (data.toString()).split(/[\s,]+/)
                this.currentProgress = parseInt(strData[0])
                this.maxProgress = parseInt(strData[1])
        
                process.stdout.write("UTDefect standard output: " + strData + "\n")
            })
        
            this.childProcess.on('close', function() {
                this.active = false
                // @ts-ignore
                this.childProcess.kill()
            })
    
            return true
        })

        ipcMain.handle('utdef-start', async(ev, pathToBinaryFolder) => {
            let classInstance = this
            let execBinaryName
            let progressFileName = "utdefcontrol"

            if (process.platform == 'darwin' || process.platform == 'linux') {
                execBinaryName = "UTDef6"
            } else if (process.platform == 'win32') {
                execBinaryName = "UTDef6.exe"
            } else {
                return Promise.resolve(false)
            }

            process.stdout.write("Starting UTDef process from Electron using path " + pathToBinaryFolder + "/" + execBinaryName + "\n")

            this.childProcess = spawn(pathToBinaryFolder + "/" + execBinaryName, {
                cwd: pathToBinaryFolder
            })

            this.childProcess.on('spawn', function () {
                process.stdout.write("Process spawned, setting active to true\n")
                classInstance.active = true
            })

            // Delay before listening to utdefcontrol
            await new Promise(r => setTimeout(r, 500));

            const progressReadInterval = setInterval(() => {
                const data = fs.readFileSync(pathToBinaryFolder + "/" + progressFileName,
                {encoding: 'utf-8', flag: 'r'}).split("\n")
                const line = data[data.length-2]

                try {
                    let strData = (line.toString()).match(/[\d]+/g)
                    classInstance.currentProgress = parseInt(strData[0])
                    classInstance.maxProgress = parseInt(strData[1])
                } catch (err) {
                    
                }
            }, 200)

            this.childProcess.on('close', function() {
                classInstance.active = false
                classInstance.currentProgress = 0
                classInstance.maxProgress = 100
                clearInterval(progressReadInterval)
                process.stdout.write("UTDef process closed\n")
            })

            return Promise.resolve(true)
        })
    
        ipcMain.handle('utdef-get-prog-std', async(event) => {
            return {p: this.currentProgress, mp: this.maxProgress}
        })
    
        ipcMain.handle('utdef-active', async(event) => {
            return this.active
        })
    
        ipcMain.handle('utdef-terminate', async(event) => {
            this.childProcess.kill()
        })
    }
}

class WindowIpc {
    constructor() {
        ipcMain.handle('minimize', async(ev) => {
            BrowserWindow.fromWebContents(ev.sender).minimize()
        })

        ipcMain.handle('unmaximize', async(ev) => {
            BrowserWindow.fromWebContents(ev.sender).unmaximize()
        })

        ipcMain.handle('maximize', async(ev) => {
            BrowserWindow.fromWebContents(ev.sender).maximize()
        })

        ipcMain.handle('close', async(ev) => {
            BrowserWindow.fromWebContents(ev.sender).close()
            app.quit()
        })

        ipcMain.handle('is-maximized', async(ev) => {
            return Promise.resolve(BrowserWindow.fromWebContents(ev.sender).isMaximized())
        })
    }
}

module.exports.GenericIpc = GenericIpc
module.exports.UTDefectIpc = UTDefectIpc
module.exports.UTDefectMultiprocessesIpc = UTDefectMultiprocessesIpc
module.exports.WindowIpc = WindowIpc