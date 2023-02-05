const { ipcMain, dialog, BrowserWindow } = require('electron')
const os = require('os')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

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
            fs.copyFile(src, target, () => {
                process.stdout.write("Copied file from " + src + " to " + target + "\n")
            })
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
            const splitPath = String(filePath).split("/")
            filePath = ""
        
            for(let i = 0; i < splitPath.length-1; i++) {
                filePath += splitPath[i]
        
                if (i != splitPath.length-2){
                filePath += "/"
                }
            }
        
            process.stdout.write(filePath + "\n")
        
            try {
                await fs.promises.access(String(filePath), 
                fs.constants.R_OK | fs.constants.W_OK)
            } catch {
                const result = await fs.promises.mkdir(String(filePath), { recursive: true })
        
                process.stdout.write(result + "\n")
            }
        
            let stream = fs.createWriteStream(
                String(filePath) + "/" + splitPath[splitPath.length-1]
            )
        
            if (!(data instanceof Array)) {
                return false;
            }
        
            data.forEach(element => {
                stream.write(element)
                stream.write("\n")
            });
            
            stream.close()
        
            return true;
        })

        ipcMain.handle('file-exists', async(ev, src) => {
            try {
                await fs.promises.access(String(src), 
                fs.constants.R_OK | fs.constants.W_OK)
        
                return true
            } catch {
                return false
            }
        })

        ipcMain.handle('extname', async(ev, trgtPath) => {
            return path.extname(trgtPath)
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

module.exports.GenericIpc = GenericIpc
module.exports.UTDefectIpc = UTDefectIpc