const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')

// ==========================================================
let mainWindow
const CONFIG_PATH = '/Users/tmaier/Documents/Repos/occ/config.json'
var config = {
  settings: {
    width: 1080,
    height: 780
  },
  reports: []
}

// ==========================================================
function loadConfigFromFile() {
  try {
    if (fs.existsSync(CONFIG_PATH)) config = JSON.parse(fs.readFileSync(CONFIG_PATH))
    else fs.appendFileSync(CONFIG_PATH, JSON.stringify(config))
  } catch (error) {}
}

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: config.settings.width,
    height: config.settings.height,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))
  mainWindow.on('ready-to-show', () => mainWindow.show())

  // Dev Tools
  if (isDev) mainWindow.webContents.openDevTools()

  // Add Properties
  global.config = {
    initial: config,
    updateConfiguration: newConfig => (config = newConfig)
  }
}

// ==========================================================
app.on('ready', () => {
  // Load Settings
  loadConfigFromFile()

  // Create BrowserWindow
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('quit', () => {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config))
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
