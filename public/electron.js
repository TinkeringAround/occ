const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const JSZip = require('jszip')

// Utlity & PDF
const { initializeMenu } = require('./src/menu')
const {
  initializeReport,
  setWindow,
  createReport,
  cancelReport,
  showWorker,
  createPuppeteerWindow
} = require('./src/report')
const { createPDF } = require('./src/pdf')

// Consts
const ROOT_PATH = app.getPath('documents') + '/OCC'
const CONFIG_PATH = ROOT_PATH + '/config.json'

// ==========================================================
// #region Variables & Configuration
let mainWindow
var config = {
  settings: {
    width: 1280,
    height: 960,
    showWorker: false,
    export: 'images and pdf'
  },
  reports: []
}
// #endregion

// ==========================================================
// #region SETUP
function loadConfigFromFile() {
  try {
    if (fs.existsSync(CONFIG_PATH)) config = JSON.parse(fs.readFileSync(CONFIG_PATH))
    else createFolderAndConfigFile()
  } catch (error) {
    createFolderAndConfigFile()()
  }
}

function createFolderAndConfigFile() {
  fs.mkdirSync(ROOT_PATH)
  fs.appendFileSync(CONFIG_PATH, JSON.stringify(config))
}

function saveConfigurationToDisk() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config))
}

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: config.settings.width,
    height: config.settings.height,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/src/preload.js'
    }
    // icon: __dirname + "/assets/icon.icns"
  })
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => {
    mainWindow = null
    cancelReport()

    // Set Report Window Variables on Report
    setWindow(null)
  })
  mainWindow.on('ready-to-show', () => mainWindow.show())

  // Set Report Window Variables on Report
  setWindow(mainWindow)
}

// #endregion

// ==========================================================
// #region MAIN & APP HANDLER
;(async () => {
  // Setup Puppeteer
  await initializeReport()

  // Initialize Menu
  initializeMenu()
})()

app.on('ready', async () => {
  // Load Configuration
  loadConfigFromFile()

  // Create Directories for Images
  if (!fs.existsSync(ROOT_PATH + '/images')) fs.mkdirSync(ROOT_PATH + '/images')

  // Add Properties
  global.config = config

  // Create BrowserWindow & Set in Report.js
  createWindow()

  // Apply Config Settings to PuppeteerWindow
  createPuppeteerWindow(config.settings.showWorker)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
  saveConfigurationToDisk()
})

app.on('quit', saveConfigurationToDisk)

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
// #endregion

// ==========================================================
// #region RENDERER HANDLER
ipcMain.on('updateConfig', (event, newConfig) => updateConfiguration(newConfig))
ipcMain.on('closeWindow', closeWindow)

// Report
ipcMain.on('createReport', (event, report, suites) => createReport(report, suites))
ipcMain.on('cancelReport', (event, report) => cancelReport(report))
ipcMain.on('exportReport', (event, report, suites) => exportReport(report, suites))

// ==========================================================
async function updateConfiguration(newConfig) {
  // Check Differences => a report has been deleted, then delete not longer user Images
  if (config.reports.length > newConfig.reports.length) {
    var deletedReport = null
    config.reports.forEach(report => {
      const index = newConfig.reports.findIndex(
        x => x.project == report.project && x.url == report.url && x.date == report.date
      )
      if (index < 0) deletedReport = report
    })

    if (deletedReport) {
      deletedReport.results.forEach(result => {
        result.images.forEach(image => {
          if (fs.existsSync(image.path)) fs.unlinkSync(image.path)
        })
      })
    }
  }

  // Update Config
  config = newConfig
  saveConfigurationToDisk()

  // Apply new Settings
  showWorker(config.settings.showWorker)
  mainWindow.focus()

  // Update Global Properties
  global.config = config
}

function closeWindow() {
  if (mainWindow) mainWindow.destroy()
}

async function exportReport(report, suites) {
  const path = dialog.showSaveDialogSync(mainWindow)
  if (path) {
    // Create Zip Object
    zip = new JSZip()

    // Add Images and Content for PDF
    const pdfResults = []
    for (const suite of suites) {
      report.results.forEach(result => {
        if (result.suite == suite) {
          if (config.settings.export.includes('images')) {
            result.images.forEach((image, index) => {
              try {
                const binary = fs.readFileSync(image.path)
                const fileName = report.project + '-' + result.suite + '-' + index + '.jpeg'
                zip.folder(suite).file(fileName, binary)
              } catch (error) {}
            })
          }

          if (config.settings.export.includes('pdf')) pdfResults.push(result)
        }
      })
    }

    if (config.settings.export.includes('pdf')) {
      // Create PDF and Add to ZIP
      const pdfPath = await createPDF(pdfResults)
      zip.file('results.pdf', fs.createReadStream(pdfPath))
      fs.unlinkSync(pdfPath)
    }

    // Save Zip to path
    const finishedZip = await zip.generateAsync({ type: 'uint8array' })
    fs.writeFileSync(path + '.zip', finishedZip)
  }
}
// #endregion
