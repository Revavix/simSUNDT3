const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const { electron, stdout } = require('process')
const os = require('os')
const fs = require('fs')
const fsPromises = require('fs/promises')
const { spawn } = require('child_process')
const { ProjectHandler } = require('./electron_lib/projectHandler')

function updateProjectCache(project, path) {
  let data = {}

  if (fs.existsSync(os.homedir() + "/Documents/simSUNDT/files.sscache")) {
    data = JSON.parse(fs.readFileSync(os.homedir() + "/Documents/simSUNDT/files.sscache").toString())
  }

  data[project["name"]] = {
    path: path,
    lastSaved: project["lastSaved"]
  }

  fs.writeFile(os.homedir() + "/Documents/simSUNDT/files.sscache", JSON.stringify(data), err => {
    if (err) {
      process.stdout.write("Fatal error while attempting to write to the cache file 'cache.json'")
    }
  })
}

function createWindowAndIPC () {
  let projectHandler = new ProjectHandler()

  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
    titleBarStyle: 'hidden',
    useContentSize: true
    })

  if (process.env.NODE_ENV !== 'development') {
    win.loadFile(path.join(__dirname, 'dist/index.html'))
    win.webContents.openDevTools()
  } else {
    win.loadURL('http://localhost:5173/index.html')
    win.webContents.openDevTools()
  }

  win.setTitle("Test")

  ipcMain.handle('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

  ipcMain.handle('project-load-by-modal', async() => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      defaultPath: projectHandler.defaultProjectFolderPath,
      filters: [
        {
          name: "Project",
          extensions: [".ssproj"]
        },
        { 
          name: 'All Files', 
          extensions: ['*'] 
        }
      ],
      properties: ['openFile']
    })

    if (canceled) {
      return Promise.reject({status: "ERROR", msg: "Canceled by user", data: null})
    } else {
      const loaded = await projectHandler.Load(filePaths[0])

      if (loaded["status"] == "ERROR") {
        return Promise.reject(loaded)
      } else {
        updateProjectCache(loaded["data"], filePaths[0])
        return Promise.resolve(loaded)
      }
    }
  })

  ipcMain.handle('project-load-by-path' , async(event, projectPath) => {
    const loaded = await projectHandler.Load(projectPath)

    if (loaded["status"] == "ERROR") {
      return Promise.reject(loaded)
    } else {
      updateProjectCache(loaded["data"], projectPath)
      return Promise.resolve(loaded)
    }
  })

  ipcMain.handle('project-list-latest', async() => {
    let data = {}
    
    if (fs.existsSync(os.homedir() + "/Documents/simSUNDT/files.sscache")) {
      data = JSON.parse(fs.readFileSync(os.homedir() + "/Documents/simSUNDT/files.sscache").toString())
      let deletedKeys = false
      let sanitizedData = []

      for (const [key, value] of Object.entries(data)) {
        if (fs.existsSync(value["path"])) {
          sanitizedData.push(
            {
              name: key,
              path: value["path"],
              lastSaved: value["lastSaved"]
            }
          )
        } else {
          deletedKeys = true
          delete data[key]
        }
      }

      if (deletedKeys) {
        fs.writeFileSync(os.homedir() + "/Documents/simSUNDT/files.sscache", JSON.stringify(data))
      }

      return Promise.resolve(sanitizedData)
    } else {
      return Promise.resolve([])
    }
  })

  ipcMain.handle('project-new-choose-loc', async() => {
    // Called by renderer to assign a new folder location where to store the project file
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      defaultPath: projectHandler.defaultProjectFolderPath,
      properties: ['openDirectory']
    })

    if (canceled) {
      return ""
    }

    return filePaths[0]
  })

  ipcMain.handle('project-new-create', async(event, projectName, pathToProject, overwrite) => {
    const loaded = await projectHandler.New(projectName, pathToProject, overwrite)

    if (loaded["status"] == "ERROR") {
      return Promise.reject(loaded)
    } else {
      updateProjectCache(projectHandler.currentProject, projectHandler.currentProjectPath)
      return Promise.resolve(loaded)
    }
  })

  ipcMain.handle('project-save', async(event, data) => {
    const saved = projectHandler.Save(data)

    if (saved["status"] == "ERROR") {
      return Promise.reject(saved)
    } else {
      updateProjectCache(projectHandler.currentProject, projectHandler.currentProjectPath)
      return Promise.resolve(saved)
    }
  })
}

app.whenReady().then(() => {
  let utdefProcess = null
  let utdefectStdCurrentProgress = 0
  let utdefectStdMaxProgress = 0
  let utdefectActive = false

  createWindowAndIPC()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindowAndIPC()
    }
  })

  // OS
  ipcMain.handle('get-platform', async() => {
    return process.platform
  })

  // Misc API
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

  ipcMain.handle('copy-file', async(event, src, target) => {
    fs.copyFile(src, target, () => {
      process.stdout.write("Copied file from " + src + " to " + target + "\n")
    })
  })

  ipcMain.handle('file-exists', async(event, src) => {
    try {
      await fs.promises.access(String(src), 
      fs.constants.R_OK | fs.constants.W_OK)

      return true
    } catch {
      return false
    }
  })

  ipcMain.handle('write-file', async(event, filePath, data) => {
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

  ipcMain.handle('utdef-start-std', async(event, pathToBinary, inputPath) => {
    utdefProcess = spawn(pathToBinary, ["-I", inputPath, "-M", "std"])

    process.stdout.write("Starting UTDef process from Electron using path " + pathToBinary + "\n")

    utdefProcess.on('spawn', function () {
      utdefectActive = true
    })

    utdefProcess.stdout.on('data', function(data) {
      let strData = (data.toString()).split(/[\s,]+/)
      utdefectStdCurrentProgress = parseInt(strData[0])
      utdefectStdMaxProgress = parseInt(strData[1])

      process.stdout.write("UTDefect standard output: " + strData + "\n")
    })

    utdefProcess.on('close', function() {
      utdefectActive = false
      utdefProcess.kill()
    })

    return true
  })

  ipcMain.handle('utdef-get-prog-std', async(event) => {
    return {p: utdefectStdCurrentProgress, mp: utdefectStdMaxProgress}
  })

  ipcMain.handle('utdef-active', async(event) => {
    return utdefectActive
  })

  ipcMain.handle('utdef-terminate', async(event) => {
    utdefProcess.kill()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})