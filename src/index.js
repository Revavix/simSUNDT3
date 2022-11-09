const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
  })

  if (process.env.NODE_ENV !== 'development') {
    win.loadFile(`${__dirname}/renderer/dist/index.html`)
  } else {
    win.loadURL('http://localhost:5173/src/renderer/index.html')
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
