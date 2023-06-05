const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const { electron, stdout } = require('process')
const os = require('os')
const fs = require('fs')
const fsPromises = require('fs/promises')
const { spawn } = require('child_process')
const { GenericIpc, UTDefectIpc, UTDefectMultiprocessesIpc, WindowIpc } = require('./ipc')

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
    const genericIpc = new GenericIpc()
    const utdefIpc = new UTDefectIpc()
    const utdefMpIpc = new UTDefectMultiprocessesIpc()
    const windowIpc = new WindowIpc()

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

        win.setTitle("SimSUNDT")

        ipcMain.handle('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })
}

app.whenReady().then(() => {
    createWindowAndIPC()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindowAndIPC()
        }
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})