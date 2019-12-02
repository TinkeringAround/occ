import React from 'react'

// Types
import { TSettings } from '../types'

// ==========================================================
type SettingsContextProps = {
  settings: TSettings | null

  updateSettings: (settings: TSettings) => void
}

const SettingsContext = React.createContext<SettingsContextProps>({
  settings: null,

  updateSettings: (settings: TSettings) => {}
})

export default SettingsContext
