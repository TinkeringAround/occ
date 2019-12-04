const fs = require('fs')
const PdfPrinter = require('pdfmake')
const sizeOf = require('image-size')

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
const ROOT_PATH = process.cwd()
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
        fontSize: 75,
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
exports.createPDF = async results => {
  const content = []

  // Create Contents
  for (const result of results) {
    result.images.forEach(image => {
      const imageSize = sizeOf(image.path)

      content.push({ text: result.suite, style: 'header' })
      content.push({ text: image.url, style: 'subtitle' })
      content.push({
        image: image.path,
        width: 1280 - 2 * MARGIN,
        height: imageSize.height,
        margin: [MARGIN / 2, 0, 0, 0],
        pageBreak: 'after'
      })
    })
  }

  var pdfDoc = PRINTER.createPdfKitDocument(getDD(content), {})
  pdfDoc.pipe(fs.createWriteStream(PDF_PATH))
  pdfDoc.end()

  console.log(' Created PDF to ' + PDF_PATH)
  return PDF_PATH
}
