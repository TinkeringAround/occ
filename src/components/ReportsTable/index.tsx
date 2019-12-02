import React, { FC, useContext, useState, useEffect } from 'react'
import { Box, Text } from 'grommet'
import { PoseGroup } from 'react-pose'

// Types
import { TReport } from '../../types/configuration'

// Context
import reportContext from '../../context/report-context'

// Atoms
import { ASubPage } from '../../atoms/animations'

// Components
import LoadingSpinner from '../LoadingSpinner'

// Partials
import TableHeader from './Partials/header'
import TableRow from './Partials/row'

// Styles
import { colors } from '../../styles'

// ==========================================================
export interface Props {
  reports: Array<TReport>
  isChanging: boolean
}

// ==========================================================
const ReportsTable: FC<Props> = ({ reports, isChanging }) => {
  const { deleteReport, openReport, cancelProcessedReport } = useContext(reportContext)
  const [selected, setSelected] = useState<number>(-1)

  const deleteReportAndReset = (report: TReport) => {
    setSelected(-1)
    deleteReport(report)
  }

  const openReportAndReset = (report: TReport) => {
    setSelected(-1)
    openReport(report)
  }

  const cancelReport = (report: TReport) => {
    setSelected(-1)
    cancelProcessedReport(report)
  }

  useEffect(() => {
    if (isChanging && selected >= 0) setSelected(-1)
  }, [isChanging])

  return (
    <Box height="100%" width="100%" direction="row" justify="between" pad="0 3rem 0 2rem">
      <Box height="100%" width="100%" style={{ position: 'relative', overflowX: 'visible' }}>
        {/* Header */}
        <TableHeader />

        <PoseGroup flipMove={false}>
          {!isChanging && (
            <ASubPage
              key="ReportsTable"
              minHeight="95%"
              delay={0}
              style={{
                margin: '2rem 0 0',
                paddingLeft: '6px',
                position: 'relative',
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                overflowX: 'visible',
                alignItems: reports.length === 0 ? 'center' : 'unset'
              }}
            >
              {reports.length === 0 && (
                <Text size="1rem" color={colors['grey']} margin={{ top: '2rem' }}>
                  No Results found.
                </Text>
              )}
              {reports.map((report: TReport, index: number) => (
                <TableRow
                  key={'ReportsTable-Row-' + index}
                  report={report}
                  openReport={openReportAndReset}
                  deleteReport={deleteReportAndReset}
                  cancelReport={cancelReport}
                  selected={selected === index}
                  setSelected={(rowReport: TReport) => {
                    const rowIndex = reports.indexOf(rowReport)
                    if (rowIndex === selected) setSelected(-1)
                    else setSelected(rowIndex)
                  }}
                />
              ))}
            </ASubPage>
          )}

          {isChanging && (
            <ASubPage
              key="ReportsTable-LoadingSpinner"
              minHeight="95%"
              delay={0}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <LoadingSpinner size={3} />
            </ASubPage>
          )}
        </PoseGroup>
      </Box>
    </Box>
  )
}

export default ReportsTable
