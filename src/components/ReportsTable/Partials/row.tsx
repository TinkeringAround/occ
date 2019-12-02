import React, { FC, Fragment, useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Box } from 'grommet'
import { FillSpinner } from 'react-spinners-kit'

// Types
import { TReport } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Utility
import { unixTimeToSting } from '../../../utility/time'
import Icon from '../../../atoms/icons'

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
const sizes = ['30%', '30%', '15%', '10%', '15%']

// ==========================================================
interface Props {
  selected: boolean
  setSelected: (rowReport: TReport) => void
  report: TReport
  deleteReport: (report: TReport) => void
  cancelReport: (report: TReport) => void
  openReport: (report: TReport) => void
}

// ==========================================================
const ReportsTableRow: FC<Props> = ({
  selected,
  setSelected,
  report,
  deleteReport,
  cancelReport,
  openReport
}) => {
  const { reportInProgress } = useContext(reportContext)
  const [cancelled, setCancelled] = useState<boolean>(false)

  useEffect(() => {
    if (cancelled) setCancelled(false)
  }, [report])

  const reportIsRunning = reportInProgress && typeof report.progress === 'number' && !cancelled

  return (
    <Row
      selected={selected}
      onClick={() => setSelected(report)}
      onDoubleClick={() => openReport(report)}
    >
      {/* Project */}
      <Box
        width={sizes[0]}
        pad={{ left: '1rem' }}
        style={{ borderTopLeftRadius: BORDER_RADIUS, borderBottomLeftRadius: BORDER_RADIUS }}
      >
        <Text size="0.85rem" weight="bold" color={selected ? 'white' : colors['darkGrey']} truncate>
          {report.project}
        </Text>
      </Box>

      {/* URL */}
      <Box width={sizes[1]}>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']} truncate>
          {report.url}
        </Text>
      </Box>

      {/* Date */}
      <Box width={sizes[2]}>
        <Text size="0.7rem" weight="bold" color={selected ? 'white' : colors['darkGrey']}>
          {unixTimeToSting(Number(report.date))}
        </Text>
      </Box>

      {/* Progress/Status */}
      <Box
        width={sizes[3]}
        pad={{ left: !reportIsRunning ? '0.5rem' : '0' }}
        direction="row"
        align="center"
      >
        {reportIsRunning && (
          <Fragment>
            <FillSpinner size={1} sizeUnit="rem" color={selected ? 'white' : colors['lightblue']} />
            <Text
              size="0.7rem"
              margin="0.5rem"
              weight="bold"
              color={selected ? 'white' : colors['darkGrey']}
            >
              {report.progress + '%'}
            </Text>
          </Fragment>
        )}

        {!reportInProgress && (
          <Box
            width="1.5rem"
            height="1.5rem"
            background={selected ? 'white' : colors['lightblue']}
            justify="center"
            align="center"
            style={{ borderRadius: 15, transition: 'all 0.25s ease' }}
          >
            <Icon
              size="0.7rem"
              type={report.progress === true ? 'check' : 'error'}
              color={selected ? 'lightblue' : 'white'}
            />
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box
        width={sizes[4]}
        direction="row"
        justify="center"
        align="center"
        style={{ borderTopRightRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS }}
      >
        <Box
          width="1.75rem"
          height="1.75rem"
          background={selected ? 'white' : colors['lightblue']}
          justify="center"
          align="center"
          style={{ borderRadius: 15, transition: 'all 0.25s ease', cursor: 'pointer' }}
          onClick={() => openReport(report)}
        >
          <Icon size="0.7rem" type="open" color={selected ? 'lightblue' : 'white'} />
        </Box>
        <Box
          width="1.75rem"
          height="1.75rem"
          margin={{ left: '.5rem' }}
          background={selected ? 'white' : colors['lightblue']}
          justify="center"
          align="center"
          style={{ borderRadius: 15, transition: 'all 0.25s ease', cursor: 'pointer' }}
          onClick={() => {
            if (reportIsRunning) {
              cancelReport(report)
              setCancelled(true)
            } else deleteReport(report)
          }}
        >
          <Icon
            size="0.7rem"
            type={reportIsRunning ? 'cancel' : 'trash'}
            color={selected ? 'lightblue' : 'white'}
          />
        </Box>
      </Box>
    </Row>
  )
}

export default ReportsTableRow
