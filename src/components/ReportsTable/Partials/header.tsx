import React, { FC } from 'react'
import { Text } from 'grommet'

// Styles
import { colors } from '../../../styles'

// Consts
const columns = ['Project', 'Url', 'Date', 'Suites']
const sizes = ['30%', '30%', '30%', '10%']

// ==========================================================
const ReportsTableHeader: FC = () => (
  <thead>
    <tr style={{ cursor: 'default' }}>
      {columns.map((columnName: string, index: number) => (
        <th
          key={'Table-Header-' + index}
          style={{ height: '1.5rem', width: sizes[index], textAlign: 'start' }}
        >
          <Text
            size="0.8rem"
            weight="bold"
            color={colors['grey']}
            style={{
              paddingLeft: index === 0 ? '.5rem' : 0
            }}
          >
            {columnName}
          </Text>
        </th>
      ))}
    </tr>
  </thead>
)

export default ReportsTableHeader
