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
      })
    }

    // Create and Save PDF
    var pdfDoc = PRINTER.createPdfKitDocument(getDD(content), {})
    pdfDoc.pipe(fs.createWriteStream(PDF_PATH))
    pdfDoc.end()

    logInfo(' Created PDF to ' + PDF_PATH)
    return PDF_PATH
  } catch (error) {
    logError(error)
  }
}
// #endregion
// ==========================================================
module.exports = {
  createPDF
}
