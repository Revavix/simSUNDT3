const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
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

  Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})