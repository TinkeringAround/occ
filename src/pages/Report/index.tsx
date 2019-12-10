import React, { FC, useContext, Fragment, useState, useEffect } from 'react'
import { Box, Text, TextInput } from 'grommet'
import { FillSpinner } from 'react-spinners-kit'
import { PoseGroup } from 'react-pose'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// Partials
import ReportAside from './Partials/aside'

// Atoms
import { AProgressIndicator } from '../../atoms/animations'

// Utility
import ReportSuites from './Partials/suites'
import { getSuiteName } from '../../utility/suites'

// ==========================================================
const Report: FC = () => {
  const { report, updateReportProject, reportInProgress, cancelProcessedReport } = useContext(
    reportContext
  )
  const [project, setProject] = useState<string>('')
  const [selectedSuites, setSelectedSuites] = useState<number>(0)
  const [cancelled, setCancelled] = useState<boolean>(false)

  const cancelReport = () => {
    if (report) {
      cancelProcessedReport(report)
      setCancelled(true)
    }
  }

  useEffect(() => {
    if (report != null && project === '') setProject(report.project)
    if (cancelled) setCancelled(false)
  }, [report])

  const reportIsRunning =
    report != null &&
    reportInProgress != null &&
    reportInProgress.report.date === report.date &&
    reportInProgress.report.url === report.url &&
    typeof report.progress === 'number'

  return (
    <Box pad="2rem" style={{ position: 'relative' }}>
      {report != null && (
        <Fragment>
          {/* Running Icon */}
          <PoseGroup flipMove={false} preEnterPose="exit">
            {reportIsRunning === true && reportInProgress != null && (
              <AProgressIndicator key="Report-ProgressIndicator">
                <FillSpinner size={1} sizeUnit="rem" color="white" />
                <Text size="0.85rem" margin="0.5rem" weight="bold" color="white">
                  {cancelled
                    ? 'Cancelling...'
                    : report.progress +
                      '% ' +
                      (getSuiteName(reportInProgress.suite) !== ''
                        ? getSuiteName(reportInProgress.suite)
                        : reportInProgress.suite)}
                </Text>
              </AProgressIndicator>
            )}
          </PoseGroup>

          {/* Heading */}
          <Box width="70%">
            <Box width="100%" style={{ position: 'relative' }}>
              <TextInput
                value={project}
                onChange={(event: any) => setProject(event.target.value)}
                plain
                style={{
                  fontSize: '4rem',
                  color: report.project !== project ? colors['lightblue'] : colors['darkGrey'],
                  margin: 0,
                  padding: 0,
                  transition: 'all 0.25s ease'
                }}
                onBlur={() => updateReportProject(report, project)}
              />
            </Box>

            <Text margin={{ left: '0.25rem' }} color={colors['grey']} size="1.5rem" truncate>
              {report.url}
            </Text>
          </Box>

          {/* Suites & Aside */}
          <Box
            height={`calc(${window.innerHeight}px -  17rem)`}
            width="100%"
            margin="3rem 0 .75rem"
            justify="between"
            direction="row"
          >
            {/* Suites */}
            <ReportSuites selectedSuites={selectedSuites} setSelectedSuites={setSelectedSuites} />

            {/* Aside */}
            <ReportAside
              selectedSuites={selectedSuites}
              cancelReport={cancelReport}
              cancelled={cancelled}
              reportIsRunning={reportIsRunning}
            />
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Report
