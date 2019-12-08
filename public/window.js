const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

// Packages
const { MIN_HEIGHT, MIN_WIDTH } = require('./src/const')
const { logError } = require('./src/logger')
const { showWorker } = require('./src/report')

// Variables
var mainWindow

// ==========================================================
// #region Functions
function createWindow() {
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
      mainWindow.on('closed', () => {
        mainWindow = null
        showWorker(null)
      })
      mainWindow.on('ready-to-show', () => mainWindow.show())

      // Set Report Window Variables on Report
      global.mainWindow = mainWindow
    }
  } catch (error) {
    logError(error)
  }
}

function closeWindow() {
  if (mainWindow) {
    showWorker(null)
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
  createWindow
}
