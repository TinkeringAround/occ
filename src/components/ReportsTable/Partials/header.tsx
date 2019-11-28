import React, { FC } from 'react'
import { Text, Box } from 'grommet'

// Styles
import { colors } from '../../../styles'

// Consts
const columns = ['Project', 'Url', 'Date', 'Suites']
const sizes = ['30%', '30%', '30%', '10%']

// ==========================================================
const ReportsTableHeader: FC = () => (
  <Box direction="row" style={{ position: 'absolute', top: 0, width: '100%' }}>
    {columns.map((columnName: string, index: number) => (
      <Box
        key={'Table-Header-' + index}
        style={{ height: '1.5rem', width: sizes[index], textAlign: 'start' }}
      >
        <Text
          size="0.8rem"
          weight="bold"
          color={colors['grey']}
          style={{
            paddingLeft: index === 0 ? 'calc(.5rem + 6px)' : 0
          }}
        >
          {columnName}
        </Text>
      </Box>
    ))}
  </Box>
)

export default ReportsTableHeader
