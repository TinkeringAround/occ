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
    overflow="visible"
  >
    <Navigation />

    {/* Content */}
    <Box
      height="100%"
      flex="grow"
      background={colors['white']}
      style={{
        position: 'relative',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        padding: '1rem',
        boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, 0.25)'
      }}
    >
      {children}
    </Box>
  </Box>
)

export default Layout
