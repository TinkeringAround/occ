const { remote } = require('electron')
const fs = require('fs')

// ==========================================================
// Attributes
window.electron = {}
window.electron.fs = fs
window.electron.remote = remote

// ==========================================================
window.electron.saveFile = (file, path) => {
  try {
    if (!window.electron.fs.existsSync(path)) window.electron.fs.appendFileSync(path, file)
    else window.electron.fs.writeFileSync(path, file)

    return true
  } catch (error) {
    return error
  }
}

window.electron.loadFile = path => {
  if (window.electron.fs.existsSync(path)) {
    const file = window.electron.fs.readFileSync(path)
    return file
  } else return null
}

//const file = await window.electron.dialog.showSaveDialog()
