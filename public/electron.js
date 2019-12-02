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
var processedReport = null
var processedSuites = []
var processedURLS = []
var processedResults = []
var processedProgress = 0
var processedCanceled = false

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
  mainWindow.on('closed', () => {
    mainWindow = null
    if (processedReport != null) processedCanceled = true
  })
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
    show: true
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
ipcMain.on('cancelReport', (event, report) => cancelReport(report))
ipcMain.on('closeWindow', () => {
  if (mainWindow) mainWindow.destroy()
})
// #endregion

// ==========================================================
// #region REPORT HANDLER
async function createReport(report, suites) {
  if (report && suites && browser && puppeteerWindow) {
    try {
      processedReport = report
      const { url } = processedReport
      processedSuites = suites

      const urlIsValid = await checkURL(url)
      console.log('URL Validation Result: ', urlIsValid ? 'VALID' : 'INVALID')

      if (urlIsValid) {
        // #region Crawl Subsites & Setup Progressing Variables
        processedURLS = contains(suites, ['w-three', 'achecker', 'w-three-css'])
          ? await getSiteUrls(url)
          : []
        processedResults = []
        processedProgress = 0
        // #endregion

        // #region Default Reports
        // SSL Labs
        if (!processedCanceled && contains(suites, ['ssllabs'])) {
          __result = await createSimpleSuiteResult('normal', {
            suite: 'ssllabs',
            testURL: 'https://www.ssllabs.com/ssltest/analyze.html?d=' + url + '&hideResults=on',
            selector: '#rating'
          })
        }

        // Security Headers
        if (!processedCanceled && contains(suites, ['securityheaders'])) {
          __result = await createSimpleSuiteResult('normal', {
            suite: 'securityheaders',
            testURL: 'https://securityheaders.com/?q=' + url + '&hide=on&followRedirects=on',
            selector: '.reportBody'
          })
        }

        // Seobility
        if (!processedCanceled && contains(suites, ['seobility'])) {
          __result = await createSimpleSuiteResult('normal', {
            suite: 'seobility',
            testURL: 'https://freetools.seobility.net/de/seocheck/' + url,
            selector: '#quickform'
          })
        }

        // Favicon-Checker
        if (!processedCanceled && contains(suites, ['favicon-checker'])) {
          __result = await createSimpleSuiteResult('normal', {
            suite: 'favicon-checker',
            testURL:
              'https://realfavicongenerator.net/favicon_checker?protocol=https&site=' +
              url +
              '#.XWju45MzZhE',
            selector: '.alert'
          })
        }

        // W-Three HTML Validator
        if (!processedCanceled && contains(suites, ['w-three'])) {
          __result = await createChainedSuiteResult('normal', {
            suite: 'w-three',
            testURL: 'https://validator.w3.org/nu/?doc=https%3A%2F%2FSUBURL',
            selector: '#results'
          })
        }
        // #endregion

        // #region Input Reports
        // GTMetrix
        if (!processedCanceled && contains(suites, ['gtmetrix'])) {
          __result = await createSimpleSuiteResult('input', {
            suite: 'gtmetrix',
            testURL: 'https://gtmetrix.com',
            input: 'input[name=url]',
            click: 'button[type=submit]',
            selector: '.page-report'
          })
        }

        // Hardenize
        if (!processedCanceled && contains(suites, ['hardenize'])) {
          __result = await createSimpleSuiteResult('input', {
            suite: 'hardenize',
            testURL: 'https://www.hardenize.com',
            input: 'input[name=host]',
            click: '#run',
            selector: '.report'
          })
        }

        // AChecker
        if (!processedCanceled && contains(suites, ['achecker'])) {
          __result = await createChainedSuiteResult('input', {
            suite: 'achecker',
            testURL: 'https://achecker.ca/checker/index.php',
            input: 'input[name=uri]',
            click: '.validation_button',
            selector: '#AC_errors'
          })
        }
        // #endregion

        // Send Final Update Event to Renderer
        console.log('Final Update, Report was ' + (processedCanceled ? 'cancelled.' : 'finished.'))
        updateReportProgress(processedReport, !processedCanceled, processedResults)
        processedReport = null
        processedCanceled = false
      }
    } catch (error) {
      // Evtl. close page
      console.log('An error occured during creating the Report:', error)
      updateReportProgress(processedReport, false, processedResults)
    }
  }
}

function updateReportProgress(report, progress, results) {
  if (mainWindow) {
    console.log('Sending Report Update to Renderer')
    mainWindow.webContents.send('updateReport', {
      report: {
        ...report,
        progress: progress
      },
      results: results
    })
  }
}

function exportReport(report) {}

function cancelReport(report) {
  if (
    processedReport != null &&
    processedReport.url == report.url &&
    processedReport.date == report.date
  )
    processedCanceled = true
}
// #endregion

// ==========================================================
// #region SUITES
async function createSimpleSuiteResult(type = 'normal', data) {
  const { suite, testURL, selector, input, click } = data
  const { url } = processedReport
  let imagePath = null

  // Create Report
  if (type == 'normal') imagePath = await createDefaultReport(suite, testURL, selector)
  else if ('input') imagePath = await createInputReport(suite, url, testURL, input, click, selector)

  // Push Report to Results
  processedResults.push({
    url: url,
    suite: suite,
    images: [{ url: url, path: imagePath }]
  })

  // Update
  processedProgress += 1
  updateReportProgress(
    processedReport,
    ~~((processedProgress / processedSuites.length) * 100),
    processedResults
  )

  // Return
  return true
}

async function createChainedSuiteResult(type = 'normal', data) {
  const { suite, testURL, selector, input, click } = data
  const { url } = processedReport
  let images = []

  // Create Report
  if (type == 'normal') {
    for (const sub of processedURLS) {
      const subImagePath = await createDefaultReport(
        suite,
        testURL.replace('SUBURL', sub),
        selector,
        true
      )
      images.push({
        url: sub,
        path: subImagePath
      })
    }
  } else if (type == 'input') {
    for (const sub of processedURLS) {
      const subImagePath = await createInputReport(
        suite,
        sub,
        testURL,
        input,
        click,
        selector,
        true
      )
      images.push({
        url: sub,
        path: subImagePath
      })
    }
  }

  // Push Report to Results
  processedResults.push({
    url: url,
    suite: suite,
    images: images
  })

  // Update
  processedProgress += 1
  updateReportProgress(
    processedReport,
    ~~((processedProgress / processedSuites.length) * 100),
    processedResults
  )

  // Return
  return true
}

async function createDefaultReport(suite, url, selector, chain = false) {
  return new Promise(async resolve => {
    console.log('Creating ' + suite + ' report.')
    try {
      // Load URL
      await puppeteerWindow.loadURL(url, { waitUntil: 'networkidel0', timeout: TIMEOUT })

      // Get Page Object
      const page = await pie.getPage(browser, puppeteerWindow)
      await page.setViewport({ width: 1080, height: 1920 })

      // Wait for Selector
      await page.waitFor(1000)
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

      // Wait
      await page.waitFor(1000)
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
      await page.setViewport({ width: 1080, height: 1920 })

      // Enter URL and Press Button
      await page.waitFor(1000)
      await page.type(input, url, { delay: 100 })
      await page.click(click)

      // Wait for Selector
      await page.waitFor(1000)
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

      // Wait
      await page.waitFor(1000)
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
