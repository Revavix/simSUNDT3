const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { electron } = require('process')
const os = require('os')
const fs = require('fs')
const { spawn } = require('child_process')

function createWindow () {
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

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

  Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
  let utdefProcess = null
  let utdefectStdCurrentProgress = 0
  let utdefectStdMaxProgress = 0
  let utdefectActive = false

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
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