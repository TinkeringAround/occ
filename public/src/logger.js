const fs = require('fs')
const os = require('os')
const isDev = require('electron-is-dev')
require('dotenv').config()

// Utility
const { MAX_FILE_SIZE, LOG_PATH } = require('./const')

// ==========================================================
// #region Functions
const logError = (error, window = null) => {
  try {
    const errorMessage = getTimestamp() + '   ERROR   {  ' + error + '  }'
    console.error(errorMessage)
    writeToLogFile(errorMessage + os.EOL)

    if (window != null) window.webContents.send('errorOnMain', errorMessage)
  } catch (err) {}
}

const logInfo = info => {
  try {
    const infoMessage = getTimestamp() + '   INFO   {  ' + info + '  }'
    console.debug(infoMessage)
    writeToLogFile(infoMessage + os.EOL)
  } catch (err) {}
}

const writeToLogFile = message => {
  try {
    if (fs.existsSync(LOG_PATH)) {
      let fd = fs.openSync(LOG_PATH, 'a')
      fs.writeSync(fd, message, null, 'utf8')
      fs.closeSync(fd)
    } else fs.appendFileSync(LOG_PATH, message)
  } catch (error) {}
}

function cleanLogFile() {
  try {
    if (fs.existsSync(LOG_PATH)) {
      const stats = fs.statSync(LOG_PATH)
      if (stats['size'] / 1000000.0 > MAX_FILE_SIZE) fs.writeFileSync(LOG_PATH, '')
    }
  } catch (error) {}
}

function getTimestamp() {
  var a = new Date(Date.now())
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate()

  var hour = a.getHours()
  var min = a.getMinutes()
  var sec = a.getSeconds()

  var time = hour + ':' + min + ':' + sec + ', ' + date + '. ' + month + ' ' + year
  return time
}
// #endregion

// ==========================================================
// #region Setup
try {
  logInfo('DSN:' + process.env.SENTRY_DSN)

  if (!isDev && process.env.SENTRY_DSN) {
    const Sentry = require('@sentry/electron')
    Sentry.init({ dsn: process.env.SENTRY_DSN })
  }
  cleanLogFile()
} catch (error) {}

// #endregion

// ==========================================================
module.exports = {
  logError,
  logInfo
}
