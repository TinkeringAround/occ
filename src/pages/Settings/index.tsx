import React, { FC, useContext } from 'react'
import { Box, Heading, Text } from 'grommet'

// Types
import { TExportOptions, TTimeoutOptions } from '../../types'

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

  // Worker
  const updateShowWorker = () => {
    if (settings)
      updateSettings({
        ...settings,
        showWorker: !settings.showWorker
      })
  }
  const getValueOfTimeout: (timeout: TTimeoutOptions) => string = (timeout: TTimeoutOptions) => {
    switch (timeout) {
      case '60000':
        return '1 Minute'
      case '180000':
        return '3 Minutes'
      case '300000':
        return '5 Minutes'
      case '600000':
        return '10 Minutes'
    }
  }
  const updateTimeout: (timeout: string) => void = (timeout: string) => {
    if (settings) {
      let newTimeout: TTimeoutOptions = settings.timeout

      switch (timeout) {
        case '1 Minute':
          newTimeout = '60000'
          break
        case '3 Minutes':
          newTimeout = '180000'
          break
        case '5 Minutes':
          newTimeout = '300000'
          break
        case '10 Minutes':
          newTimeout = '600000'
      }

      console.log('NewTimeout', timeout)

      updateSettings({
        ...settings,
        timeout: newTimeout
      })
    }
  }

  // Export
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
        <Box width="100%" direction="row" justify="between" margin={{ top: '3rem' }}>
          <Box width="45%">
            {/* Report Settings */}
            <Box background="white" pad="1rem" style={{ borderRadius: 15 }}>
              <Heading level="2" size="2.5rem" color={colors['darkGrey']} margin="0 0 1rem 0">
                Report
              </Heading>
              {/* Timeout */}
              <Dropdown
                options={['1 Minute', '3 Minutes', '5 Minutes', '10 Minutes']}
                value={getValueOfTimeout(settings.timeout)}
                select={updateTimeout}
                label="Timeout"
              />

              {/* Worker */}
              <Text
                size="1rem"
                weight="bold"
                color={colors['grey']}
                margin="1.5rem 0 .25rem .25rem"
              >
                Worker
              </Text>
              <Checkbox
                label="Show Worker Window"
                checked={settings.showWorker}
                onChange={updateShowWorker}
                size="1.25rem"
                fontSize="1rem"
                margin="0 0 0 .25rem"
              />
            </Box>
          </Box>

          <Box width="45%">
            {/* Export Settings */}
            <Box background="white" pad="1rem" style={{ borderRadius: 15 }}>
              <Heading level="2" size="2.5rem" color={colors['darkGrey']} margin="0 0 1rem 0">
                Export
              </Heading>
              <Dropdown
                options={['Images', 'PDF', 'Images and PDF']}
                value={getValueofExport(settings.export)}
                select={updateExport}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Settings
