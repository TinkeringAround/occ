const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')
const uuid = require('uuid/v1')

// Utlity
const { checkURL, contains, getSiteUrls } = require('./utility')

// Consts
const ROOT_PATH = process.cwd()
const CONFIG_PATH = ROOT_PATH + '/config.json'
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
    width: 1920,
    height: 1080,
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
        // #region Crawl Subsites
        const urls = contains(suites, ['w-three', 'achecker', 'w-three-css'])
          ? await getSiteUrls(url)
          : []
        // #endregion

        // #region Default Reports
        // SSL Labs
        if (contains(suites, ['ssllabs'])) {
          const imagePath = await createDefaultReport(
            'ssllabs',
            'https://www.ssllabs.com/ssltest/analyze.html?d=' + url + '&hideResults=on',
            '#rating'
          )
          const ssllabsResult = {
            url: url,
            suite: 'ssllabs',
            images: [
              {
                url: url,
                path: imagePath
              }
            ]
          }
          reportResults.push(ssllabsResult)
        }

        // Security Headers
        if (contains(suites, ['securityheaders'])) {
          const imagePath = await createDefaultReport(
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
                path: imagePath
              }
            ]
          }
          reportResults.push(securityHeadersResult)
        }

        // Seobility
        if (contains(suites, ['seobility'])) {
          const imagePath = await createDefaultReport(
            'seobility',
            'https://freetools.seobility.net/de/seocheck/' + url,
            '#quickform'
          )
          const seobilityResult = {
            url: url,
            suite: 'seobility',
            images: [
              {
                url: url,
                path: imagePath
              }
            ]
          }
          reportResults.push(seobilityResult)
        }

        // Favicon-Checker
        if (contains(suites, ['favicon-checker'])) {
          const imagePath = await createDefaultReport(
            'favicon-checker',
            'https://realfavicongenerator.net/favicon_checker?protocol=https&site=' +
              url +
              '#.XWju45MzZhE',
            '.alert'
          )
          const faviconResult = {
            url: url,
            suite: 'favicon-checker',
            images: [
              {
                url: url,
                path: imagePath
              }
            ]
          }
          reportResults.push(faviconResult)
        }

        // W-Three HTML Validator
        if (contains(suites, ['w-three'])) {
          if (urls != null && urls.length > 0) {
            const images = []
            for (const sub of urls) {
              const subImagePath = await createDefaultReport(
                'w-three',
                'https://validator.w3.org/nu/?doc=https%3A%2F%2F' + sub,
                '#results',
                true
              )
              images.push({
                url: sub,
                path: subImagePath
              })
            }

            wThreeResult = {
              url: url,
              suite: 'w-three',
              images: images
            }
            reportResults.push(wThreeResult)
          }
        }
        // #endregion

        // #region Input Reports
        // GTMetrix
        if (contains(suites, ['gtmetrix'])) {
          const imagePath = await createInputReport(
            'gtmetrix',
            url,
            'https://gtmetrix.com',
            'input[name=url]',
            'button[type=submit]',
            '.page-report'
          )
          const getMetrixResults = {
            url: url,
            suite: 'gtmetrix',
            images: [
              {
                url: url,
                path: imagePath
              }
            ]
          }
          reportResults.push(getMetrixResults)
        }

        // Hardenize
        if (contains(suites, ['hardenize'])) {
          const imagePath = await createInputReport(
            'hardenize',
            url,
            'https://www.hardenize.com',
            'input[name=host]',
            '#run',
            '.report'
          )
          const harenizeResults = {
            url: url,
            suite: 'hardenize',
            images: [
              {
                url: url,
                path: imagePath
              }
            ]
          }
          reportResults.push(harenizeResults)
        }
        // #endregion

        // Send Update Event to Renderer for Update
        if (mainWindow) {
          console.log('Sending finished Report to Renderer')
          mainWindow.webContents.send('updateReport', {
            report: {
              ...report,
              progress: true
            },
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
async function createDefaultReport(suite, url, selector, chain = false) {
  return new Promise(async resolve => {
    console.log('Creating ' + suite + ' report.')
    try {
      // Load URL
      await puppeteerWindow.loadURL(url, { waitUntil: 'networkidel0', timeout: TIMEOUT })

      // Get Page Object
      const page = await pie.getPage(browser, puppeteerWindow)

      // Wait for Selector
      await page.waitForSelector(selector, { timeout: TIMEOUT }) // timeout: 5 Minutes
      await page.waitFor(1000)

      // Take screenshot
      const path = ROOT_PATH + '/images/' + uuid() + '.jpeg'
      await page.screenshot({
        path: path,
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })

      // Wait if chain
      if (chain) await page.waitFor(2500)

      console.log(`Saved to file ${path}`)
      resolve(path)
    } catch (error) {
      console.log('An Error occured creating ' + suite + ' report. ' + error)
      resolve(null)
    }
  })
}

async function createInputReport(suite, url, testURL, input, click, selector, chain = false) {
  return new Promise(async resolve => {
    console.log('Creating ' + suite + ' input report.')
    try {
      // Load URL
      await puppeteerWindow.loadURL(testURL, { waitUntil: 'networkidel0', timeout: TIMEOUT })

      // Get Page Object
      const page = await pie.getPage(browser, puppeteerWindow)

      // Enter URL and Press Button
      await page.type(input, url, { delay: 100 })
      await page.click(click)

      // Wait for Selector
      await page.waitForSelector(selector, { timeout: TIMEOUT }) // timeout: 5 Minutes
      await page.waitFor(1000)

      // Take screenshot
      const path = ROOT_PATH + '/images/' + uuid() + '.jpeg'
      await page.screenshot({
        path: path,
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })

      // Wait if chain
      if (chain) await page.waitFor(2500)

      console.log(`Saved to file ${path}`)
      resolve(path)
    } catch (error) {
      console.log('An Error occured creating ' + suite + ' report. ' + error)
      resolve(null)
    }
  })
}
// #endregion
