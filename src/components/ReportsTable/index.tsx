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
import { PoseGroup } from 'react-pose'

// Atoms
import { ASideBar } from '../../atoms/animations'

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

      <PoseGroup flipMove={false}>
        {selected > -1 && (
          <ASideBar key="Home-Details" height={(2 * window.innerHeight) / 3}>
            <Box
              width="90%"
              height="90%"
              pad="1rem"
              background="white"
              style={{ borderRadius: 15, boxShadow: '0px 0px 20px 1px rgba(200, 214, 216, 0.25)' }}
            >
              Test
            </Box>
          </ASideBar>
        )}
      </PoseGroup>
    </Box>
  )
}

export default ReportsTable
