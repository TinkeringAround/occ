import React, { FC } from 'react'
import { Text, Box } from 'grommet'

// Styles
import { colors } from '../../../styles'

// Consts
const columns = ['Project', 'Url', 'Date', 'Progress']
const sizes = ['30%', '30%', '30%', '10%']

// ==========================================================
const ReportsTableHeader: FC = () => (
  <Box direction="row" width="100%" pad={{ left: '6px' }} style={{ position: 'absolute', top: 0 }}>
    {columns.map((columnName: string, index: number) => (
      <Box key={'Table-Header-' + index} width={sizes[index]} height="1.5rem" justify="center">
        <Text
          size="0.9rem"
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
