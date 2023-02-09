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

        ipcMain.handle('write-file', async(ev, filePath, data) => {
            try {
                fs.writeFileSync(filePath, data)

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
    }
}

class UTDefectIpc {
    childProcess = null
    currentProgress = 0
    maxProgress = 0
    active = false

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
module.exports.WindowIpc = WindowIpc