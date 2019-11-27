import React, { FC, Fragment, useContext, useState } from 'react'
import { Table, TableBody, Box } from 'grommet'

// Types
import { TReport } from '../../types/configuration'

// Context
import reportContext from '../../context/report-context'

// Partials
import ReportsTableHeader from './Partials/header'
import ReportsTableRow from './Partials/row'
import TableSpacer from './Partials/spacer'
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
    <Box width="100%" direction="row" pad="0 2rem" style={{ position: 'relative' }}>
      <Table>
        {/* Header */}
        <ReportsTableHeader />

        {/* Body */}
        <TableBody style={{ position: 'relative' }}>
          <TableSpacer />

          {reports.map((report: TReport, index: number) => (
            <Fragment key={'ReportsTable-Row-' + index}>
              <ReportsTableRow
                report={report}
                selected={selected === index}
                setSelected={(rowReport: TReport) => {
                  const rowIndex = reports.indexOf(rowReport)
                  if (rowIndex === selected) setSelected(-1)
                  else setSelected(rowIndex)
                }}
              />
              <TableSpacer height="1rem" />
            </Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Details */}
      <Box
        height={window.innerHeight / 2 + 'px'}
        width="30%"
        pad="1rem"
        background="white"
        justify="between"
        margin={{ left: '2rem' }}
        style={{
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
