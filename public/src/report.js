const { app, BrowserWindow, Notification } = require('electron')
const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')
const uuid = require('uuid/v1')
require('hazardous')

// Utility & Packages
const { logError, logInfo } = require('./logger')
const { checkURL, contains, getSiteUrls } = require('./utility')

// Consts
const ROOT_PATH = app.getPath('documents') + '/OCC'
const TIMEOUT = 300000 // 5 Minutes
const RESOLUTION = { width: 1280, height: 960 }
const WAIT_DURATION = 2000 // 2 Seconds

// ==========================================================
// #region Variables
var browser, mainWindow, puppeteerWindow

var processedReport = null
var processedSuites = []
var processedURLS = []
var processedResults = []
var processedProgress = 0
var processedCanceled = false
// #endregion

// ==========================================================
// #region Setup
const initializeReport = async () => {
  try {
    browser = await pie.connect(app, puppeteer, 8315)
  } catch (error) {
    logError('Initializing Report:  ' + error)
  }
}

const createPuppeteerWindow = showWorker => {
  puppeteerWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: showWorker,
    closable: false,
    resizable: false
  })
}

const setWindow = window => (mainWindow = window)
const showWorker = showWorker => {
  if (showWorker == null) puppeteerWindow.destroy()
  else showWorker ? puppeteerWindow.showInactive() : puppeteerWindow.hide()
}
// #endregion

// ==========================================================
// #region REPORT HANDLER
const createReport = async (report, suites) => {
  if (report && suites && browser && puppeteerWindow) {
    try {
      processedReport = report
      const { url } = processedReport
      processedSuites = suites

      const urlIsValid = await checkURL(url)
      logInfo(`Report Job received for ${url}. URL is ${urlIsValid ? 'VALID' : 'INVALID'}.`)

      // #region Suite Creation
      if (urlIsValid) {
        // #region Crawl Subsites & Setup Progressing Variables
        processedURLS = contains(suites, ['w3', 'achecker', 'w3-css']) ? await getSiteUrls(url) : []
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
            selector: () => {
              const progress = document.getElementById('analysis_progress')
              return progress ? progress.style.display == 'none' : true
            }
          })
        }

        // W-Three HTML Validator
        if (!processedCanceled && contains(suites, ['w3'])) {
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

        // Varvy
        if (!processedCanceled && contains(suites, ['varvy'])) {
          __result = await createSimpleSuiteResult('input', {
            suite: 'varvy',
            testURL: 'https://varvy.com',
            input: 'input[name=url]',
            click: 'input[type=submit]',
            selector: () => !document.querySelector('.timer-loader')
          })
        }

        // KeyDCN
        if (!processedCanceled && contains(suites, ['keycdn'])) {
          __result = await createSimpleSuiteResult('input', {
            suite: 'keycdn',
            testURL: 'https://tools.keycdn.com/speed',
            urlPrefix: 'https://',
            input: '#url',
            click: '#speedBtn',
            selector: () => document.getElementById('speedResult').childNodes.length > 0
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

        // W3 CSS
        if (!processedCanceled && contains(suites, ['w3-css'])) {
          __result = await createChainedSuiteResult('input', {
            suite: 'w3-css',
            testURL: 'https://jigsaw.w3.org/css-validator/',
            input: 'input[name=uri]',
            click: '.submit',
            selector: '#results_container'
          })
        }
        // #endregion

        // #region Special Reports
        // Lighthouse
        if (!processedCanceled && contains(suites, ['lighthouse'])) {
          __result = await createLighthouseReport()
        }
        // #endregion

        // #region Finish Report & Send Notification
        // Send Notification
        if (Notification.isSupported() && !processedCanceled) {
          const not = new Notification({
            title: 'One Click Checker',
            subtitle: `Report for ${processedReport.url} has finished.`,
            silent: false
          })

          not.show()
        }

        logInfo('Final Update, Report was ' + (processedCanceled ? 'cancelled.' : 'finished.'))
        updateReportProgress(processedReport, !processedCanceled, processedResults)
        processedReport = null
        processedCanceled = false
        // #endregion
      } else {
        updateReportProgress(processedReport, false, processedResults)
        logError('URL ' + processedReport.url + ' is invalid.', mainWindow)

        processedReport = null
        processedCanceled = false
      }
      // #endregion
    } catch (error) {
      logError('An error occured during creating the Report, ' + error, mainWindow)
      updateReportProgress(processedReport, false, processedResults)
    }
  }
}

async function updateReportProgress(report, progress, results) {
  try {
    if (mainWindow) {
      logInfo(`Sending Report Update to Renderer.`)
      mainWindow.webContents.send('updateReport', {
        report: {
          ...report,
          progress: progress
        },
        results: results
      })
    }
  } catch (error) {
    logError(error)
  }
}

const cancelReport = report => {
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
  try {
    const { suite, testURL, selector, input, click, urlPrefix = '' } = data
    const { url } = processedReport
    let imagePath = null

    // Create Report
    if (type == 'normal') imagePath = await createDefaultReport(suite, testURL, selector)
    else if ('input')
      imagePath = await createInputReport(suite, url, testURL, input, click, selector, urlPrefix)

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
  } catch (error) {
    logError(error)
    return false
  }
}

async function createChainedSuiteResult(type = 'normal', data) {
  try {
    const { suite, testURL, selector, input, click, urlPrefix = '' } = data
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
          urlPrefix,
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
  } catch (error) {
    logError(error)
    return false
  }
}

// Default, Input, Lighthouse
async function createDefaultReport(suite, url, selector, chain = false) {
  return new Promise(async resolve => {
    logInfo('Creating ' + suite + ' report.')
    try {
      // Load URL
      await puppeteerWindow.loadURL(url, { waitUntil: 'networkidel0', timeout: TIMEOUT })

      // Get Page Object
      const page = await pie.getPage(browser, puppeteerWindow)
      await page.setViewport(RESOLUTION)

      // Wait for Selector
      await page.waitFor(WAIT_DURATION)
      if (typeof selector == 'string') await page.waitForSelector(selector, { timeout: TIMEOUT })
      else if (typeof selector == 'function')
        await page.waitForFunction(selector, { timeout: TIMEOUT })
      await page.waitFor(WAIT_DURATION)

      // Take screenshot
      const path = ROOT_PATH + '/images/' + uuid() + '.jpeg'
      await page.screenshot({
        path: path,
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })

      // Wait
      await page.waitFor(WAIT_DURATION)
      if (chain) await page.waitFor(2 * WAIT_DURATION)

      logInfo(`Saved to file ${path}`)
      resolve(path)
    } catch (error) {
      logError('An Error occured creating ' + suite + ' report, ' + error)
      resolve(null)
    }
  })
}

async function createInputReport(
  suite,
  url,
  testURL,
  input,
  click,
  selector,
  urlPrefix,
  chain = false
) {
  return new Promise(async resolve => {
    logInfo('Creating ' + suite + ' input report.')
    try {
      // Load URL
      await puppeteerWindow.loadURL(testURL, { waitUntil: 'networkidel0', timeout: TIMEOUT })

      // Get Page Object
      const page = await pie.getPage(browser, puppeteerWindow)
      await page.setViewport(RESOLUTION)

      // Enter URL and Press Button
      await page.waitFor(WAIT_DURATION)
      await page.type(input, urlPrefix + url, { delay: 100 })
      await page.click(click)

      // Wait for Selector
      await page.waitFor(WAIT_DURATION)
      if (typeof selector == 'string') await page.waitForSelector(selector, { timeout: TIMEOUT })
      else if (typeof selector == 'function')
        await page.waitForFunction(selector, { timeout: TIMEOUT })
      await page.waitFor(WAIT_DURATION)

      // Take screenshot
      const path = ROOT_PATH + '/images/' + uuid() + '.jpeg'
      await page.screenshot({
        path: path,
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })

      // Wait
      await page.waitFor(WAIT_DURATION)
      if (chain) await page.waitFor(2 * WAIT_DURATION)

      logInfo(`Saved to file ${path}`)
      resolve(path)
    } catch (error) {
      logError('An Error occured creating ' + suite + ' report, ' + error)
      resolve(null)
    }
  })
}

async function createLighthouseReport() {
  try {
    const { url } = processedReport
    let imagePath = null

    // Create Report
    logInfo('Creating lighthouse report.')

    // Load URL
    await puppeteerWindow.loadURL('https://web.dev/measure/', {
      waitUntil: 'networkidel0',
      timeout: TIMEOUT
    })

    // Get Page Object
    const page = await pie.getPage(browser, puppeteerWindow)
    await page.setViewport(RESOLUTION)

    // Enter URL and Press Button
    await page.waitFor(WAIT_DURATION)
    await page.type('input[type=url]', 'https://' + url, { delay: 100 })
    await page.click('#run-lh-button')

    // Wait for Selector
    await page.waitFor(WAIT_DURATION)
    await page.waitForFunction(
      () => document.getElementsByClassName('lh-metrics-table')[0].childElementCount > 0,
      { timeout: TIMEOUT }
    )
    await page.waitFor(WAIT_DURATION)

    // Get Report
    await puppeteerWindow.loadURL(
      'https://lighthouse-dot-webdotdevsite.appspot.com//lh/html?url=https://' + url,
      {
        waitUntil: 'networkidel0',
        timeout: TIMEOUT
      }
    )
    await page.waitFor(WAIT_DURATION)

    // Take screenshot
    imagePath = ROOT_PATH + '/images/' + uuid() + '.jpeg'
    await page.screenshot({
      path: imagePath,
      type: 'jpeg',
      quality: 70,
      fullPage: true
    })

    // Wait
    await page.waitFor(WAIT_DURATION)

    logInfo(`Saved to file ${imagePath}`)

    // Push Report to Results
    processedResults.push({
      url: url,
      suite: 'lighthouse',
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
  } catch (error) {
    logError('An error occured creating lighthouse report, ' + error)
    return false
  }
}
// #endregion

// ==========================================================
module.exports = {
  initializeReport,
  createPuppeteerWindow,
  setWindow,
  showWorker,
  createReport,
  cancelReport
}
