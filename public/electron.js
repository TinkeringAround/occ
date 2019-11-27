const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')

const { checkURL, contains } = require('./utility')

// Consts
const CONFIG_PATH = '/Users/tmaier/Documents/Repos/occ/config.json'
const TIMEOUT = 300000 // 5 Minutes

// ==========================================================
// #region Variables & Configuration
let mainWindow, browser, puppeteerWindow
var config = {
  settings: {
    width: 1080,
    height: 780
  },
  reports: []
}

function saveConfigurationToDisk() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config))
}
// #endregion

// ==========================================================
// #region SETUP
async function setupPuppeteer() {
  try {
    browser = await pie.connect(app, puppeteer)
  } catch (error) {}
}

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

  // Show Dev Tools
  //if (isDev) mainWindow.webContents.openDevTools()
}
// #endregion

// ==========================================================
// #region MAIN
;(async () => {
  // Setup Puppeteer
  await setupPuppeteer()
})()
// #endregion

// ==========================================================
// #region APP HANDLER
app.on('ready', async () => {
  // Load Settings
  loadConfigFromFile()

  // Add Properties
  global.config = config

  // Puppeteer
  puppeteerWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    show: false
  })

  // Create BrowserWindow
  createWindow()
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
// #region Event Handler
ipcMain.on('updateConfig', (event, newConfig) => {
  config = newConfig
  saveConfigurationToDisk()

  // Update Global Properties
  global.config = config
})
ipcMain.on('createReport', (event, report, suites) => createReport(report, suites))
// #endregion

// ==========================================================
// #region REPORT HANDLER
async function createReport(report, suites) {
  if (report && suites && browser && puppeteerWindow) {
    try {
      const { url } = report
      const reportResults = []

      const urlIsValid = await checkURL(url)
      console.log('URL Validation Result: ', urlIsValid ? 'VALID' : 'INVALID')

      if (urlIsValid) {
        // Security Headers
        if (contains(suites, ['securityheaders'])) {
          const image = await createDefaultReport(
            'securityheaders',
            'https://securityheaders.com/?q=' + url + '&hide=on&followRedirects=on',
            '.reportBody'
          )
          const securityHeadersResult = {
            url: url,
            suite: 'securityheaders',
            images: [
              {
                url: url,
                binary: image
              }
            ]
          }
          reportResults.push(securityHeadersResult)
        }

        // Send Update Event to Renderer for Update
        if (mainWindow) {
          console.log('Sending finished Report to Renderer')
          mainWindow.webContents.send('reportFinished', {
            report: report,
            results: reportResults
          })
        }
      }
      return null
    } catch (error) {
      // Evtl. close page
      return false
    }
  } else return null
}

function exportReport(report) {}
// #endregion

// ==========================================================
// #region SUITES
async function createDefaultReport(suite, url, selector) {
  return new Promise(async resolve => {
    console.log('Creating ' + suite + ' report for: ', url)
    try {
      // Load URL
      await puppeteerWindow.loadURL(url, { waitUntil: 'networkidel0', timeout: TIMEOUT })

      // Get Page Object
      const page = await pie.getPage(browser, puppeteerWindow)

      // Wait for Selector
      await page.waitForSelector(selector, { timeout: TIMEOUT }) // timeout: 5 Minutes
      await page.waitFor(1000)

      // Take screenshot
      const binary = await page.screenshot({
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })
      console.log('Binary:', binary)
      await page.close()

      resolve(binary)
    } catch (error) {
      resolve(null)
    }
  })
}
// #endregion
