const { app, ipcMain, dialog } = require('electron')
require('hazardous')

// Initialize Consts
require('./src/const')

// Initializing Packages
const { logError } = require('./src/logger')
require('./src/menu')
const { saveConfig } = require('./src/configuration')
const { createWindow } = require('./src/window')
require('./src/report')

// ==========================================================
// #region Functions
async function exportReport(report, suites) {
  try {
    const path = dialog.showSaveDialogSync(mainWindow)
    if (path) {
      // Required Packages
      const fs = require('fs')
      const JSZip = require('jszip')

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

      // Create PDF and Add to ZIP
      if (config.settings.export.includes('pdf')) {
        const { createPDF } = require('./src/pdf')
        const pdfPath = await createPDF(pdfResults)
        zip.file('results.pdf', fs.createReadStream(pdfPath))
        fs.unlinkSync(pdfPath)
      }

      // Save Zip to path
      const finishedZip = await zip.generateAsync({ type: 'uint8array' })
      fs.writeFileSync(path + '.zip', finishedZip)
    }
  } catch (error) {
    logError(error, mainWindow)
  }
}

// #endregion

// ==========================================================
// #region Setup
process.on('uncaughtException', error => logError(`Main process: Uncaught Exception: ${error}`))

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
app.on('quit', saveConfig)
app.on('activate', createWindow)

ipcMain.on('exportReport', (event, report, suites) => exportReport(report, suites))
// #endregion
