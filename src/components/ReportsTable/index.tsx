import React, { FC, Fragment, useContext } from 'react'
import { Table, TableBody, Box } from 'grommet'

// Types
import { TReport } from '../../types/configuration'

// Context
import reportContext from '../../context/report-context'

// Partials
import ReportsTableHeader from './Partials/header'
import ReportsTableRow from './Partials/row'
import TableSpacer from './Partials/spacer'

// ==========================================================
const ReportsTable: FC = () => {
  const { reports } = useContext(reportContext)

  return (
    <Box width="100%" pad="0 2rem">
      <Table>
        {/* Header */}
        <ReportsTableHeader />

        {/* Body */}
        <TableBody style={{ position: 'relative' }}>
          <TableSpacer />

          {reports.map((report: TReport, index: number) => (
            <Fragment key={'ReportsTable-Row-' + index}>
              <ReportsTableRow report={report} />
              <TableSpacer height="1rem" />
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default ReportsTable
