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

// ==========================================================
exports.createPDF = async results => {
  // Remove DUMMY DATA
  const first = sizeOf(
    '/Users/tmaier/Documents/Repos/occ/images/d37633c0-15e3-11ea-aa1f-cb26e519f89d.jpeg'
  )
  console.log('First:', first)
  const second = sizeOf(
    '/Users/tmaier/Documents/Repos/occ/images/d7d213d0-15e3-11ea-aa1f-cb26e519f89d.jpeg'
  )
  console.log('Second:', second)

  const content = [
    { text: 'SecurityHeaders - wuyou.de', style: 'header' },
    {
      image: '/Users/tmaier/Documents/Repos/occ/images/d37633c0-15e3-11ea-aa1f-cb26e519f89d.jpeg',
      width: 1280 - 2 * MARGIN,
      height: first.height,
      pageBreak: 'after',
      margin: [MARGIN / 2, 0, 0, 0]
    },
    {
      text: 'Varvy - wuyou.de',
      style: 'header'
    },
    {
      image: '/Users/tmaier/Documents/Repos/occ/images/d7d213d0-15e3-11ea-aa1f-cb26e519f89d.jpeg',
      width: 1280 - 2 * MARGIN,
      height: second.height,
      margin: [MARGIN / 2, 0, 0, 0]
    }
  ]

  // TODO: Create Contents

  var docDefinition = {
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

  var pdfDoc = PRINTER.createPdfKitDocument(docDefinition, {})
  pdfDoc.pipe(fs.createWriteStream(ROOT_PATH + '/results.pdf'))
  pdfDoc.end()

  console.log(' Created to ' + ROOT_PATH + '/results.pdf')
  return ROOT_PATH + '/results.pdf'
}
