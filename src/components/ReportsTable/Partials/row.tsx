import React, { FC, useContext } from 'react'
import styled from 'styled-components'
import { Text, Box } from 'grommet'

// Types
import { TReport } from '../../../types/configuration'

// Context
import reportContext from '../../../context/report-context'

// Styles
import { colors } from '../../../styles'

// Utility
import { unixTimeToSting } from '../../../utility/time'

// Atoms
const BORDER_RADIUS = 15
const Row = styled.div<{ selected: boolean }>`
  height: 60px;
  min-height: 60px;

  border-radius: ${BORDER_RADIUS}px;

  margin: 0 0 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;

  background: ${(props: any) => (props.selected ? colors['lightblue'] : 'white')};
  cursor: pointer;
  transition: all 0.25s ease;

  transform: ${(props: any) => (props.selected ? 'translateX(-5px)' : 'none')};

  :hover {
    background: ${(props: any) =>
      props.selected ? colors['lightblue'] : colors['lightblueHover']};

    transform: translateX(-5px) !important;
  }
`

// Const
const sizes = ['30%', '30%', '30%', '10%']

// ==========================================================
interface Props {
  selected: boolean
  setSelected: (rowReport: TReport) => void
  report: TReport
}

// ==========================================================
const ReportsTableRow: FC<Props> = ({ selected, setSelected, report }) => {
  const { openReport } = useContext(reportContext)

  return (
    <Row
      selected={selected}
      onClick={() => setSelected(report)}
      onDoubleClick={() => openReport(report)}
    >
      <Box
        width={sizes[0]}
        style={{ borderTopLeftRadius: BORDER_RADIUS, borderBottomLeftRadius: BORDER_RADIUS }}
      >
        <Text
          size="0.85rem"
          weight="bold"
          color={selected ? 'white' : colors['darkGrey']}
          margin={{ left: '1rem' }}
          truncate
        >
          {report.project}
        </Text>
      </Box>
      <Box width={sizes[1]}>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']} truncate>
          {report.url}
        </Text>
      </Box>
      <Box width={sizes[2]}>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']}>
          {unixTimeToSting(Number(report.date))}
        </Text>
      </Box>
      <Box
        width={sizes[3]}
        style={{ borderTopRightRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS }}
      >
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']}>
          {report.results.length + ' Suites'}
        </Text>
      </Box>
    </Row>
  )
}

export default ReportsTableRow
