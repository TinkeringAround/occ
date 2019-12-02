import React, { FC, useContext } from 'react'
import { Box, Heading } from 'grommet'

// Styles
import { colors } from '../../styles'

// Context
import settingsContext from '../../context/settings-context'

// Atoms
import Checkbox from '../../atoms/checkbox'

// ==========================================================
const Settings: FC = () => {
  const { settings, updateSettings } = useContext(settingsContext)

  const updateShowWorker = () => {
    if (settings)
      updateSettings({
        ...settings,
        showWorker: !settings.showWorker
      })
  }

  return (
    <Box pad="2rem">
      <Heading level="1" size="4rem" color={colors['darkGrey']} margin="0">
        Settings
      </Heading>

      {settings && (
        <Box width="100%" margin={{ top: '3rem' }}>
          <Checkbox
            label="Show Worker on Start"
            checked={settings.showWorker}
            onChange={updateShowWorker}
            size="2rem"
            fontSize="1.5rem"
          />
        </Box>
      )}
    </Box>
  )
}

export default Settings

// Settings
// Width, Height
// - showWorker on Background = false
