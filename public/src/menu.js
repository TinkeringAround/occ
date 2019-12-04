const { app, Menu, shell } = require('electron')

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
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
  },
  // View Menu
  {
    label: 'View',
    submenu: [{ role: 'togglefullscreen' }]
  },
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
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}