// Utility
const { logError, logInfo } = require('./logger')

// ==========================================================
// #region Functions
function contains(array, search) {
  var contains = false
  array.forEach(element =>
    search.forEach(item => {
      if (element == item) contains = true
    })
  )
  return contains
}

async function checkURL(url) {
  const curl = require('curl')

  return new Promise(async function(resolve) {
    curl.get('https://' + url, function(error) {
      if (error) {
        logError(error)
        resolve(false)
      } else resolve(true)
    })
  })
}

async function getSiteUrls(url) {
  var Crawler = require('simplecrawler')

  return new Promise(async function(resolve) {
    try {
      logInfo('Collecting urls for: ' + url)
      const urls = []

      var crawler = new Crawler('https://' + url)
      crawler.maxConcurrency = 3
      crawler.maxDepth = 3
      crawler.addFetchCondition(parsedURL => {
        if (parsedURL.path.match(/\.(css|jpg|pdf|docx|js|png|ico)/i)) return false
        else return true
      })
      crawler.on('fetchcomplete', (queueItem, data, res) => {
        if (queueItem.stateData.contentType && queueItem.stateData.contentType.includes('html')) {
          logInfo('   ' + queueItem.url)
          urls.push(queueItem.url)
        }
      })
      crawler.on('complete', () => {
        logInfo('Collected ' + urls.length + ' sites.')
        resolve(urls.map(urlWithHttps => urlWithHttps.replace(/^https?:\/\//, '')))
      })
      crawler.start()
    } catch (error) {
      logError(error)
      resolve([])
    }
  })
}

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
// #endregion
// ==========================================================

module.exports = {
  contains,
  checkURL,
  getSiteUrls,
  getSuiteName
}
