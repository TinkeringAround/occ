const { app } = require('electron')

// Consts
const root = app.getPath('documents') + '/OCC'

// ==========================================================
module.exports = {
  // Paths
  ROOT_PATH: root,
  CONFIG_PATH: root + '/config.json',
  IMAGES_PATH: root + '/images',
  LOG_PATH: root + '/log.txt',
  PDF_PATH: root + '/reports.pdf',

  // Configuration
  DEFAULT_CONFIG: {
    settings: {
      width: 1280,
      height: 960,
      export: 'images and pdf'
    },
    reports: []
  },

  // Renderer Window
  MIN_HEIGHT: 650,
  MIN_WIDTH: 960,
  DEFAULT_RESOLUTION: { width: 1280, height: 960 },

  // Report
  WAIT_DURATION: 2000, // 2 Seconds

  // House Cleaning
  MIN_IMAGE_COUNT: 250,

  // Logging
  MAX_FILE_SIZE: 5, // 5 MB

  // Documentation
  DOCUMENTATION_URL: 'https://github.com/TinkeringAround/occ',

  // PDF
  MARGIN: 40
}
