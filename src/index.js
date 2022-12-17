const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { electron } = require('process')
const os = require('os')
const fs = require('fs')

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
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  ipcMain.handle('os-get-home-dir', async () => {
    return os.homedir()
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
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})