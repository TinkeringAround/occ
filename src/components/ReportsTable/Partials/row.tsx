import React, { FC, useContext } from 'react'
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
const Row = styled.tr`
  height: 60px;

  background: white;
  box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.25);
  border-radius: ${BORDER_RADIUS}px;

  cursor: pointer;
  transition: all 0.25s ease;

  :hover {
    background: ${colors['lightblueHover']};
  }
`

// ==========================================================
interface Props {
  report: TReport
}

// ==========================================================
const ReportsTableRow: FC<Props> = ({ report }) => {
  const { openReport } = useContext(reportContext)

  return (
    <Row onDoubleClick={() => openReport(report)}>
      <td style={{ borderTopLeftRadius: BORDER_RADIUS, borderBottomLeftRadius: BORDER_RADIUS }}>
        <Text size="0.85rem" weight="bold" color={colors['darkGrey']} margin={{ left: '1rem' }}>
          {report.project}
        </Text>
      </td>
      <td>
        <Text size="0.7rem" weight="bold" color={colors['darkGrey']}>
          {report.url}
        </Text>
      </td>
      <td>
        <Text size="0.7rem" weight="bold" color={colors['darkGrey']}>
          {report.date}
        </Text>
      </td>
      <td style={{ borderTopRightRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS }}>
        <Text size="0.7rem" weight="bold" color={colors['darkGrey']}>
          {report.results.length + ' Suites'}
        </Text>
      </td>
    </Row>
  )
}

export default ReportsTableRow
