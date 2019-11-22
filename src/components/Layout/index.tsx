import React, { FC } from 'react'
import { Box } from 'grommet'

// Styles
import { colors } from '../../styles'

// Navigation
import Navigation from '../Navigation'

// ==========================================================
const Layout: FC = ({ children }) => (
  <Box
    width="100vw"
    height="100vh"
    background={colors['lightblue']}
    direction="row"
    overflow="hidden"
  >
    <Navigation />

    {/* Content */}
    <Box
      height="100%"
      flex="grow"
      background={colors['lightblue']}
      style={{ position: 'relative' }}
    >
      <Box
        width="calc(100% - 10px)"
        height="calc(100% - 20px)"
        background="white"
        style={{ position: 'absolute', top: 10, right: 10, borderRadius: 20, padding: '1rem' }}
      >
        {children}
      </Box>
    </Box>
  </Box>
)

export default Layout
