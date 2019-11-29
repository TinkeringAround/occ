import React, { FC, useContext } from 'react'
import styled from 'styled-components'
import { Text, Box } from 'grommet'
import { FillSpinner } from 'react-spinners-kit'

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

  cursor: pointer;
  transition: all 0.25s ease;

  background: ${({ selected }) => (selected ? colors['lightblue'] : 'white')};
  transform: ${({ selected }) => (selected ? 'translateX(-5px)' : 'none')};

  :hover {
    background: ${({ selected }) => (selected ? colors['lightblue'] : colors['lightblueHover'])};

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

  const getProgress: () => string = () => {
    let reportProgress = '100%'
    if (report.progress !== true && report.progress >= 0 && report.progress <= 100)
      reportProgress = report.progress + '%'

    return reportProgress
  }

  return (
    <Row
      selected={selected}
      onClick={() => setSelected(report)}
      onDoubleClick={() => openReport(report)}
    >
      <Box
        width={sizes[0]}
        pad={{ left: '1rem' }}
        style={{ borderTopLeftRadius: BORDER_RADIUS, borderBottomLeftRadius: BORDER_RADIUS }}
      >
        <Text size="0.85rem" weight="bold" color={selected ? 'white' : colors['darkGrey']} truncate>
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
        pad={{ left: report.progress === true ? '1rem' : '0' }}
        direction="row"
        align="center"
        style={{ borderTopRightRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS }}
      >
        {report.progress !== true && (
          <FillSpinner size={1} sizeUnit="rem" color={colors['lightblue']} />
        )}
        <Text
          size="0.7rem"
          margin={report.progress === true ? '0' : '0.5rem'}
          weight="bold"
          color={selected ? 'white' : colors['darkGrey']}
        >
          {getProgress()}
        </Text>
      </Box>
    </Row>
  )
}

export default ReportsTableRow
