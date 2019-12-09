const { ipcMain, dialog } = require('electron')
const fs = require('fs')
const PdfPrinter = require('pdfmake')

// Utility
const { logError, logInfo } = require('./logger')
const { MARGIN, PDF_PATH } = require('./const')
const { getSuiteName } = require('./utility')

// Consts
const FONTS = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
}
const PRINTER = new PdfPrinter(FONTS)

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
                } catch (imageError) {
                  logError(imageError)
                }
              })
            }

            if (config.settings.export.includes('pdf')) pdfResults.push(result)
          }
        })
      }

      // Create PDF and Add to ZIP
      if (config.settings.export.includes('pdf')) {
        try {
          const pdfPath = await createPDF(pdfResults)
          if (pdfPath) {
            zip.file('results.pdf', fs.createReadStream(pdfPath))
            fs.unlinkSync(pdfPath)
          }
        } catch (pdfError) {
          logError(pdfError)
        }
      }

      // Save Zip to path
      const finishedZip = await zip.generateAsync({ type: 'uint8array' })
      fs.writeFileSync(path + '.zip', finishedZip)
      logInfo(`Export ZIP to ${path} was successful.`)
    }
  } catch (error) {
    logError(error, mainWindow)
  }
}

function getDD(content) {
  return {
    pageSize: {
      width: 1280,
      height: 'auto'
    },
    pageMargins: [MARGIN / 2, MARGIN, MARGIN / 2, MARGIN],
    content: content,
    styles: {
      header: {
        fontSize: 80,
        bold: true,
        color: 'grey',
        margin: [MARGIN / 2, 0, 0, 10]
      },
      subtitle: {
        fontSize: 30,
        color: 'grey',
        margin: [MARGIN / 2, 0, 0, MARGIN]
      }
    },
    defaultStyle: {
      font: 'Helvetica'
    }
  }
}

async function createPDF(results) {
  try {
    const content = []

    // Create Contents
    for (const result of results) {
      result.images.forEach(image => {
        try {
          if (image.path != null) {
            const sizeOf = require('image-size')
            const imageSize = sizeOf(image.path)

            content.push({ text: getSuiteName(result.suite), style: 'header' })
            content.push({ text: image.url, style: 'subtitle' })
            content.push({
              image: image.path,
              width: 1280 - 2 * MARGIN,
              height: imageSize.height,
              margin: [MARGIN / 2, 0, 0, 6 * MARGIN]
            })
          }
        } catch (imageError) {
          logError(imageError)
        }
      })
    }

    // Create and Save PDF
    var pdfDoc = PRINTER.createPdfKitDocument(getDD(content), {})
    pdfDoc.pipe(fs.createWriteStream(PDF_PATH))
    pdfDoc.end()

    logInfo('   Created PDF successfully.')
    return PDF_PATH
  } catch (error) {
    logError(error)
    return null
  }
}
// #endregion
// ==========================================================

ipcMain.on('exportReport', (event, report, suites) => exportReport(report, suites))
