const { app, Notification, powerSaveBlocker, ipcMain } = require('electron')
const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')
const uuid = require('uuid/v1')
require('hazardous')

// Utility & Packages
const {
  WAIT_DURATION,
  DEFAULT_RESOLUTION,
  TIMEOUT,
  MAX_PAGE_HEIGHT,
  IMAGES_PATH
} = require('./const')
const { logError, logInfo } = require('./logger')
const { checkURL, contains, getSiteUrls } = require('./utility')

// ==========================================================
// #region Variables
var browser

var processID = null
var processedReport = null
var processedReports = 0
var processedURLS = []
var processedResults = []
var processedProgress = 0
var processedCanceled = false
// #endregion
// ==========================================================
// #region Functions

// Start Stop
async function createReport(report, suites) {
  if (report && suites && browser && global.workerWindow) {
    try {
      processedReport = report
      const { url } = processedReport
      processedReports = suites.length
      logInfo(`Report Job received for ${url}.`)
      updateRunningSuite('Validating URL...')

      const urlIsValid = await checkURL(url)
      logInfo(`URL is ${urlIsValid ? 'VALID' : 'INVALID'}.`)

      // #region Suite Creation
      if (urlIsValid) {
        // Setup Power Blocker
        processID = powerSaveBlocker.start('prevent-app-suspension')

        // #region Crawl Subsites & Setup Progressing Variables
        if (contains(suites, ['w3', 'achecker', 'w3-css'])) {
          updateRunningSuite('Collection Pages...')
          processedURLS = await getSiteUrls(url)

          if (contains(suites, ['w3'])) processedReports += processedURLS.length - 1
          if (contains(suites, ['achecker'])) processedReports += processedURLS.length - 1
          if (contains(suites, ['w3-css'])) processedReports += processedURLS.length - 1
        }
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
            suite: 'w3',
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

        // Stop Power Blocker
        powerSaveBlocker.stop(processID)
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

      // Stop Power Blocker
      if (powerSaveBlocker.isStarted(processID)) powerSaveBlocker.stop(processID)
    }
  }
}
function cancelReport(report) {
  if (
    processedReport != null &&
    processedReport.url == report.url &&
    processedReport.date == report.date
  )
    processedCanceled = true
}

// Updating
async function updateReportProgress(report, progress, results) {
  try {
    if (global.mainWindow) {
      global.mainWindow.webContents.send('updateReport', {
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
async function updateRunningSuite(suite) {
  try {
    if (global.mainWindow) {
      logInfo(`Starting Suite ${suite}...`)
      global.mainWindow.webContents.send('updateRunningSuite', suite)
    }
  } catch (error) {
    logError(error)
  }
}

// Suites Wrapper
async function createSimpleSuiteResult(type = 'normal', data) {
  try {
    const { suite, testURL, selector, input, click, urlPrefix = '' } = data
    const { url } = processedReport
    let imagePath = null

    // Update Running Suite
    updateRunningSuite(suite)

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
      ~~((processedProgress / processedReports) * 100),
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

    // Update Running Suite
    updateRunningSuite(suite)

    // Create Report
    if (type == 'normal') {
      for (const sub of processedURLS) {
        if (!processedCanceled) {
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

          // Update
          processedProgress += 1
          updateReportProgress(
            processedReport,
            ~~((processedProgress / processedReports) * 100),
            processedResults
          )
        }
      }
    } else if (type == 'input') {
      for (const sub of processedURLS) {
        if (!processedCanceled) {
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

          // Update
          processedProgress += 1
          updateReportProgress(
            processedReport,
            ~~((processedProgress / processedReports) * 100),
            processedResults
          )
        }
      }
    }

    // Push Report to Results
    processedResults.push({
      url: url,
      suite: suite,
      images: images
    })

    // Update
    updateReportProgress(
      processedReport,
      ~~((processedProgress / processedReports) * 100),
      processedResults
    )

    // Return
    return true
  } catch (error) {
    logError(error)
    return false
  }
}

// Suites: Default, Input, Lighthouse
async function createDefaultReport(suite, url, selector, chain = false) {
  return new Promise(async resolve => {
    logInfo('Creating ' + suite + ' report.')
    try {
      // Load URL
      await global.workerWindow.loadURL(url, {
        waitUntil: 'networkidel0',
        timeout: TIMEOUT
      })

      // Get Page Object
      const page = await pie.getPage(browser, global.workerWindow)
      await page.setViewport(DEFAULT_RESOLUTION)

      // Wait for Selector
      await page.waitFor(WAIT_DURATION)
      if (typeof selector == 'string') await page.waitForSelector(selector, { timeout: TIMEOUT })
      else if (typeof selector == 'function')
        await page.waitForFunction(selector, { timeout: TIMEOUT })

      await page.waitFor(WAIT_DURATION)

      // Take screenshot
      const path = IMAGES_PATH + '/' + uuid() + '.jpeg'
      await page.screenshot({
        path: path,
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })

      // Wait
      await page.waitFor(WAIT_DURATION)
      if (chain) await page.waitFor(2 * WAIT_DURATION)

      logInfo(`   Saved to file ${path}`)
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
      await global.workerWindow.loadURL(testURL, {
        waitUntil: 'networkidel0',
        timeout: TIMEOUT
      })

      // Get Page Object
      const page = await pie.getPage(browser, global.workerWindow)
      await page.setViewport(DEFAULT_RESOLUTION)

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

      // Update Viewport
      var height = 0
      if (suite === 'w3-css') {
        height = await page.evaluate(() => document.documentElement.offsetHeight)
        height = height >= MAX_PAGE_HEIGHT ? MAX_PAGE_HEIGHT : height
        await page.setViewport({ width: DEFAULT_RESOLUTION.width, height: height })
      }

      // Take screenshot
      const path = IMAGES_PATH + '/' + uuid() + '.jpeg'
      const vp =
        suite != 'w3-css'
          ? { fullPage: true }
          : {
              clip: {
                x: 0,
                y: 0,
                width: DEFAULT_RESOLUTION.width,
                height: height
              }
            }
      await page.screenshot({
        path: path,
        type: 'jpeg',
        quality: 70,
        ...vp
      })

      // Wait
      await page.waitFor(WAIT_DURATION)
      if (chain) await page.waitFor(2 * WAIT_DURATION)

      logInfo(`   Saved to file ${path}`)
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
    await global.workerWindow.loadURL('https://web.dev/measure/', {
      waitUntil: 'networkidel0',
      timeout: TIMEOUT
    })

    // Get Page Object
    const page = await pie.getPage(browser, global.workerWindow)
    await page.setViewport(DEFAULT_RESOLUTION)

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
    await global.workerWindow.loadURL(
      'https://lighthouse-dot-webdotdevsite.appspot.com//lh/html?url=https://' + url,
      {
        waitUntil: 'networkidel0',
        timeout: TIMEOUT
      }
    )
    await page.waitFor(WAIT_DURATION)

    // Take screenshot
    imagePath = IMAGES_PATH + '/' + uuid() + '.jpeg'
    await page.screenshot({
      path: imagePath,
      type: 'jpeg',
      quality: 70,
      fullPage: true
    })

    // Wait
    await page.waitFor(WAIT_DURATION)

    logInfo(`   Saved to file ${imagePath}`)

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
      ~~((processedProgress / processedReports) * 100),
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

;(async () => {
  try {
    // Connect to Chrome Engine
    browser = await pie.connect(app, puppeteer, 8315)
  } catch (error) {
    logError('Initializing Report:  ' + error)
  }
})()

ipcMain.on('createReport', (event, report, suites) => createReport(report, suites))
ipcMain.on('cancelReport', (event, report) => cancelReport(report))
