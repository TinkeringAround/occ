const { BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

// Packages
const { MIN_HEIGHT, MIN_WIDTH, DOCUMENTATION_URL } = require('./src/const')
const { logError } = require('./src/logger')

// Variables
var mainWindow = null,
  workerWindow = null

// ==========================================================
// #region Functions
function createWindows() {
  try {
    if (mainWindow == null) {
      mainWindow = new BrowserWindow({
        show: false,
        width: global.config.settings.width,
        height: global.config.settings.height,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        center: true,
        frame: false,
        webPreferences: {
          nodeIntegration: false,
          preload: __dirname + '/src/preload.js'
        },
        icon: __dirname + '/assets/icons.icns'
      })
      mainWindow.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
      )
      mainWindow.on('closed', () => (mainWindow = null))
      mainWindow.on('ready-to-show', () => mainWindow.show())

      // Set Global MainWindow Object
      global.mainWindow = mainWindow
    }

    if (workerWindow == null) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize

      workerWindow = new BrowserWindow({
        width: width,
        height: height,
        show: false,
        closable: false,
        resizable: false,
        minimizable: false,
        fullscreenable: false,
        frame: false
      })

      workerWindow.loadURL(DOCUMENTATION_URL, {
        waitUntil: 'networkidel0',
        timeout: global.config.settings.timeout
      })
      workerWindow.on('close', () => (workerWindow = null))

      // Set Global WorkerWindow Object
      global.workerWindow = workerWindow
    }
  } catch (error) {
    logError(error)
  }
}

function closeWindow() {
  if (mainWindow) {
    workerWindow.destroy()
    mainWindow.destroy()
  }
}

function minimizeWindow() {
  if (mainWindow) mainWindow.minimize()
}

function toggleFullscreen() {
  if (mainWindow) mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
}
// #endregion
// ==========================================================
// #region Setup
try {
  ipcMain.on('closeWindow', closeWindow)
  ipcMain.on('minimizeWindow', minimizeWindow)
  ipcMain.on('fullscreenWindow', toggleFullscreen)
} catch (error) {
  logError(error)
}
// #endregion
// ==========================================================

module.exports = {
  createWindows
}
