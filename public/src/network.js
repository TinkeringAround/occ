const { app, ipcMain } = require('electron')

// Utility
const { logError, logInfo } = require('./logger')

// ==========================================================
// #region Functions
function restartApplication() {
  try {
    logInfo(`Restart Application after Network Connection lost.`)
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit()
  } catch (error) {
    logError('An error occured restarting the application after Network Connection lost.')
    logError('   ' + error)
  }
}
// #endregion
// ==========================================================

ipcMain.on('restart', () => restartApplication())
