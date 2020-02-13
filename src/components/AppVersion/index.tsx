import React, { useState, useEffect, FC } from 'react'
import { Text } from 'grommet'

// Styles
import { colors } from '../../styles'

// Driver
import { getAppVersion } from '../../utility/ipc'

// ==========================================================
const AppVersion: FC = () => {
  const [version, setVersion] = useState<string>('')

  // ==========================================================
  useEffect(() => {
    if (version === '') {
      const loadedVersion = getAppVersion()
      setVersion(loadedVersion)
    }
  }, [version])

  // ==========================================================
  return (
    <Text
      size=".6rem"
      color={colors['white']}
      style={{ position: 'absolute', bottom: '1rem', cursor: 'default' }}
    >
      {`v${version}`}
    </Text>
  )
}

export default AppVersion
