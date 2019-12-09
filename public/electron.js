const { app } = require('electron')
require('hazardous')

// Initialize Consts
require('./src/const')

// Initializing Packages
const { logError } = require('./src/logger')
require('./src/menu')
const { saveConfig } = require('./src/configuration')
const { createWindow } = require('./window')
require('./src/report')
require('./src/pdf')

// ==========================================================
process.on('uncaughtException', error => logError(`Main process: Uncaught Exception: ${error}`))

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
app.on('quit', saveConfig)
app.on('activate', createWindow)
