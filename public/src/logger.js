const { app } = require('electron')
const fs = require('fs')
const os = require('os')

// Consts
const ROOT_PATH = app.getPath('documents') + '/OCC'
const LOG_PATH = ROOT_PATH + '/log.txt'

// ==========================================================
const logError = (error, window = null) => {
  const errorMessage = getTimestamp() + '   ERROR   {  ' + error + '  }' + os.EOL
  writeToLogFile(errorMessage)

  if (window != null) window.webContents.send('errorOnMain', errorMessage)
}

const logInfo = info => {
  const infoMessage = getTimestamp() + '   INFO   {  ' + info + '  }' + os.EOL
  writeToLogFile(infoMessage)
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

// ==========================================================
module.exports = {
  logError,
  logInfo
}
