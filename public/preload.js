const { remote } = require('electron')
const fs = require('fs')

// ==========================================================
// Attributes
window.electron = {}
window.electron.fs = fs
window.electron.remote = remote
