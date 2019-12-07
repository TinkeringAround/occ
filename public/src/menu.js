const { app, Menu, shell } = require('electron')
const isDev = require('electron-is-dev')

// Utility
const { logError } = require('./logger')

// ==========================================================
const isMac = process.platform === 'darwin'

// ==========================================================
const template = [
  // App Menu
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ role: 'hide' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }]
        }
      ]
    : []),
  // File
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
  },
  // View Menu
  ...(isDev
    ? [
        {
          label: 'View',
          submenu: [{ role: 'toggledevtools' }, { type: 'separator' }]
        }
      ]
    : []),
  // Window Menu
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
        : [{ role: 'close' }])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Documentation',
        click: async () => {
          await shell.openExternal('https://github.com/TinkeringAround/occ')
        }
      }
    ]
  }
]

// ==========================================================
exports.initializeMenu = () => {
  try {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } catch (error) {
    logError(error)
  }
}
