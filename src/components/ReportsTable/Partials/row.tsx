import React, { FC, useContext, useState } from 'react'
import styled from 'styled-components'
import { Text } from 'grommet'

// Types
import { TReport } from '../../../types/configuration'

// Context
import reportContext from '../../../context/report-context'

// Styles
import { colors } from '../../../styles'

// Atoms
const BORDER_RADIUS = 15

// ==========================================================
interface Props {
  report: TReport
}

// ==========================================================
const ReportsTableRow: FC<Props> = ({ report }) => {
  const { openReport } = useContext(reportContext)
  const [selected, setSelected] = useState<boolean>(false)

  const Row = styled.tr`
    height: 60px;

    box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.25);
    border-radius: ${BORDER_RADIUS}px;

    background: ${selected ? colors['lightblue'] : 'white'};
    cursor: pointer;
    transition: all 0.25s ease;

    :hover {
      background: ${selected ? colors['lightblue'] : colors['lightblueHover']};

      transform: translateX(-5px);
    }
  `

  return (
    <Row onClick={() => setSelected(!selected)} onDoubleClick={() => openReport(report)}>
      <td style={{ borderTopLeftRadius: BORDER_RADIUS, borderBottomLeftRadius: BORDER_RADIUS }}>
        <Text
          size="0.85rem"
          weight="bold"
          color={selected ? 'white' : colors['darkGrey']}
          margin={{ left: '1rem' }}
        >
          {report.project}
        </Text>
      </td>
      <td>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']}>
          {report.url}
        </Text>
      </td>
      <td>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']}>
          {report.date}
        </Text>
      </td>
      <td style={{ borderTopRightRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS }}>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']}>
          {report.results.length + ' Suites'}
        </Text>
      </td>
    </Row>
  )
}

export default ReportsTableRow
