import React, { FC, useContext } from 'react'
import { Box, Heading } from 'grommet'

// Types
import { TExportOptions } from '../../types'

// Styles
import { colors } from '../../styles'

// Context
import settingsContext from '../../context/settings-context'

// Atoms
import Checkbox from '../../atoms/checkbox'
import Dropdown from '../../atoms/dropdown'

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

  const getValueofExport: (exportValue: TExportOptions) => string = (
    exportValue: TExportOptions
  ) => {
    switch (exportValue) {
      case 'images':
        return 'Images'
      case 'pdf':
        return 'PDF'
      case 'images and pdf':
        return 'Images and PDF'
    }
  }
  const updateExport = (selection: string) => {
    if (settings) {
      let newExport: TExportOptions = settings.export

      switch (selection.toLowerCase()) {
        case 'images':
          newExport = 'images'
          break
        case 'pdf':
          newExport = 'pdf'
          break
        case 'images and pdf':
          newExport = 'images and pdf'
      }

      console.log('NewExport', newExport)

      updateSettings({
        ...settings,
        export: newExport
      })
    }
  }

  return (
    <Box pad="2rem">
      <Heading level="1" size="4rem" color={colors['darkGrey']} margin="0">
        Settings
      </Heading>

      {settings && (
        <Box width="45%" margin={{ top: '3rem' }}>
          {/* Report Settings */}
          <Box background="white" pad="1rem" style={{ borderRadius: 15 }}>
            <Heading level="2" size="2.5rem" color={colors['grey']} margin="0 0 1rem 0">
              Report
            </Heading>
            <Checkbox
              label="Show Worker Window"
              checked={settings.showWorker}
              onChange={updateShowWorker}
              size="1.25rem"
              fontSize="1rem"
            />
          </Box>

          {/* Export Settings */}
          <Box background="white" pad="1rem" margin={{ top: '2rem' }} style={{ borderRadius: 15 }}>
            <Heading level="2" size="2.5rem" color={colors['grey']} margin="0 0 1rem 0">
              Export
            </Heading>
            <Dropdown
              options={['Images', 'PDF', 'Images and PDF']}
              value={getValueofExport(settings.export)}
              select={updateExport}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Settings
