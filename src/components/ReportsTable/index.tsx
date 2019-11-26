import React, { FC, Fragment, useContext, useState } from 'react'
import { Table, TableBody, Box } from 'grommet'
import { PoseGroup } from 'react-pose'

// Types
import { TReport } from '../../types/configuration'

// Context
import reportContext from '../../context/report-context'

// Atoms
import { ASideBar } from '../../atoms/animations'

// Partials
import ReportsTableHeader from './Partials/header'
import ReportsTableRow from './Partials/row'
import TableSpacer from './Partials/spacer'
import TableDetails from './Partials/details'

// ==========================================================
const ReportsTable: FC = () => {
  const { reports } = useContext(reportContext)
  const [selected, setSelected] = useState<number>(-1)

  return (
    <Box width="100%" direction="row" pad="0 2rem">
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

      <PoseGroup flipMove={false} preEnterPose="exit">
        {selected >= 0 && (
          <ASideBar key="Table-Details" height={(2 * window.innerHeight) / 3}>
            <Box width="100%" height="100%" align="end">
              <TableDetails report={selected >= 0 ? reports[selected] : null} />
            </Box>
          </ASideBar>
        )}
      </PoseGroup>
    </Box>
  )
}

export default ReportsTable
