const fs = require('fs')
const os = require('os')
const { ipcMain } = require('electron')

// Utility
const { MAX_FILE_SIZE, LOG_PATH } = require('./const')

// ==========================================================
// #region Functions
const logError = (error, window = null) => {
  try {
    const errorMessage = getTimestamp() + '   ERROR   {  ' + error + '  }'
    console.error(errorMessage)
    writeToLogFile(errorMessage + os.EOL)

    if (window != null) window.webContents.send('errorOnMain', error)
  } catch (err) {}
}

const logInfo = info => {
  try {
    const infoMessage = getTimestamp() + '   INFO    {  ' + info + '  }'
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
    } else writeToLogFile('==========================================================\n')
  } catch (error) {}
}

function getTimestamp() {
  var a = new Date(Date.now())
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate()

  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours()
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes()
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds()

  var time = hour + ':' + min + ':' + sec + ', ' + date + '. ' + month + ' ' + year
  return time
}
// #endregion
// ==========================================================
// #region Setup
try {
  ipcMain.on('version', event => {
    event.returnValue = {
      data: process.env.npm_package_version,
      error: null
    }
  })

  cleanLogFile()
} catch (error) {
  logError(error)
}
// #endregion
// ==========================================================

module.exports = {
  logError,
  logInfo
}
