const { app } = require('electron')
const fs = require('fs')
const os = require('os')

// Consts
const ROOT_PATH = app.getPath('documents') + '/OCC'
const LOG_PATH = ROOT_PATH + '/log.txt'

// ==========================================================
exports.logError = error => {
  try {
    const errorMessage = 'Error:\n' + error

    if (fs.existsSync(LOG_PATH)) {
      let fd = fs.openSync(LOG_PATH, 'a')
      fs.writeSync(fd, errorMessage + os.EOL + os.EOL, null, 'utf8')
      fs.closeSync(fd)
    } else fs.appendFileSync(LOG_PATH, errorMessage)
  } catch (error) {}
}
