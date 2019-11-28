import React, { FC, useContext, useState } from 'react'
import { Box } from 'grommet'

// Types
import { TReport } from '../../types/configuration'

// Context
import reportContext from '../../context/report-context'

// Partials
import TableHeader from './Partials/header'
import TableRow from './Partials/row'
import TableDetails from './Partials/details'

// ==========================================================
const ReportsTable: FC = () => {
  const { reports, deleteReport, openReport } = useContext(reportContext)
  const [selected, setSelected] = useState<number>(-1)

  const deleteReportAndReset = (report: TReport) => {
    setSelected(-1)
    deleteReport(report)
  }

  const openReportAndReset = (report: TReport) => {
    setSelected(-1)
    openReport(report)
  }

  return (
    <Box height="100%" width="100%" direction="row" justify="between" pad="0 2rem">
      <Box height="100%" width="70%" style={{ position: 'relative', overflowX: 'visible' }}>
        {/* Header */}
        <TableHeader />

        <Box
          margin="2rem 0 0"
          pad={{ left: '6px' }}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
            overflowX: 'visible'
          }}
        >
          {reports.map((report: TReport, index: number) => (
            <TableRow
              key={'ReportsTable-Row-' + index}
              report={report}
              selected={selected === index}
              setSelected={(rowReport: TReport) => {
                const rowIndex = reports.indexOf(rowReport)
                if (rowIndex === selected) setSelected(-1)
                else setSelected(rowIndex)
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Details */}
      <Box
        height="100%"
        width="25%"
        pad="1rem"
        background="white"
        justify="between"
        margin={{ left: '2rem' }}
        style={{
          minHeight: '100%',
          minWidth: '200px',
          borderRadius: 15
        }}
      >
        <TableDetails
          report={selected >= 0 ? reports[selected] : null}
          deleteReport={deleteReportAndReset}
          openReport={openReportAndReset}
        />
      </Box>
    </Box>
  )
}

export default ReportsTable
