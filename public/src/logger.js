const { app } = require('electron')
const fs = require('fs')
const os = require('os')

// Consts
const ROOT_PATH = app.getPath('documents') + '/OCC'
const LOG_PATH = ROOT_PATH + '/log.txt'

// ==========================================================
const logError = error => {
  const errorMessage = 'Error:\n' + error + '\n' + os.EOL
  writeToLogFile(errorMessage)
}

const logInfo = info => {
  const infoMessage = 'Info:\n' + info + '\n' + os.EOL
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

// ==========================================================
module.exports = {
  logError,
  logInfo
}
