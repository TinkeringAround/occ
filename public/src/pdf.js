const { app } = require('electron')
const fs = require('fs')
const PdfPrinter = require('pdfmake')
const sizeOf = require('image-size')

// Utility
const { logError } = require('./logger')

// Consts
const FONTS = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
}
const MARGIN = 40
const PRINTER = new PdfPrinter(FONTS)
const ROOT_PATH = app.getPath('documents') + '/OCC'
const PDF_PATH = ROOT_PATH + '/reports.pdf'

// ==========================================================
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

// ==========================================================
function getSuiteName(suite) {
  switch (suite) {
    case 'ssllabs':
      return 'SSL Labs'
    case 'securityheaders':
      return 'Security Headers'
    case 'seobility':
      return 'Seobility'
    case 'gtmetrix':
      return 'GTMetrix'
    case 'hardenize':
      return 'Hardenize'
    case 'favicon-checker':
      return 'Favicon-Checker'
    case 'w3':
      return 'W3 HTML Validation'
    case 'achecker':
      return 'AChecker'
    case 'varvy':
      return 'Varvy'
    case 'keycdn':
      return 'KeyCDN'
    case 'lighthouse':
      return 'Lighthouse'
    case 'w3-css':
      return 'W3 CSS Validation'
    default:
      return 'Unknown'
  }
}

// ==========================================================
exports.createPDF = async results => {
  try {
    const content = []

    // Create Contents
    for (const result of results) {
      result.images.forEach(image => {
        if (image.path != null) {
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

    // Create PDF
    var pdfDoc = PRINTER.createPdfKitDocument(getDD(content), {})
    pdfDoc.pipe(fs.createWriteStream(PDF_PATH))
    pdfDoc.end()

    console.log(' Created PDF to ' + PDF_PATH)
    return PDF_PATH
  } catch (error) {
    logError(error)
  }
}
