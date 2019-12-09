const { ipcMain } = require('electron')
const fs = require('fs')

// Packages
const { ROOT_PATH, DEFAULT_CONFIG, CONFIG_PATH, IMAGES_PATH, MIN_IMAGE_COUNT } = require('./const')
const { logError } = require('./logger')

// ==========================================================
var config = DEFAULT_CONFIG

// ==========================================================
// #region Functions
function createFolderAndConfigFile() {
  fs.mkdirSync(ROOT_PATH)
  fs.appendFileSync(CONFIG_PATH, JSON.stringify(config))
}

async function updateConfig(newConfig) {
  try {
    // Check Differences => a report has been deleted, then delete not longer user Images
    if (config.reports.length > newConfig.reports.length) {
      var deletedReport = null
      config.reports.forEach(report => {
        const index = newConfig.reports.findIndex(
          x => x.project == report.project && x.url == report.url && x.date == report.date
        )
        if (index < 0) deletedReport = report
      })

      if (deletedReport) {
        deletedReport.results.forEach(result => {
          result.images.forEach(image => {
            try {
              if (fs.existsSync(image.path)) fs.unlinkSync(image.path)
            } catch (error) {}
          })
        })
      }
    }

    // Update Config
    config = newConfig
    saveConfig()

    // Update Global Properties
    global.config = config
  } catch (error) {
    logError(error)
  }
}

function saveConfig() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config))
}

function cleanImagesFolder() {
  if (!fs.existsSync(IMAGES_PATH)) fs.mkdirSync(IMAGES_PATH)
  else {
    try {
      var images = []

      // Collect all images
      config.reports.forEach(report =>
        report.results.forEach(result => result.images.forEach(image => images.push(image.path)))
      )

      if (images.length >= MIN_IMAGE_COUNT) {
        const files = fs.readdirSync(IMAGES_PATH)

        if (files.length > images.length) {
          const unusedImages = []

          files.forEach(file => {
            if (file.includes('.jpeg')) {
              let inUse = false

              images.forEach(image => {
                if (image.includes(file)) inUse = true
              })

              if (!inUse) unusedImages.push(file)
            }
          })

          unusedImages.forEach(image => fs.unlinkSync(IMAGES_PATH + '/' + image))
        }
      }
    } catch (error) {
      logError(error)
    }
  }
}
// #endregion
// ==========================================================
// #region Setup
try {
  if (fs.existsSync(CONFIG_PATH)) config = JSON.parse(fs.readFileSync(CONFIG_PATH))
  else createFolderAndConfigFile()

  cleanImagesFolder()
} catch (error) {
  createFolderAndConfigFile()
  logError(error)
}

global.config = config

ipcMain.on('updateConfig', (event, newConfig) => updateConfig(newConfig))
// #endregion
// ==========================================================

module.exports = {
  updateConfig,
  saveConfig
}
