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

// ==========================================================
const Report: FC = () => {
  const { report, updateReportProject } = useContext(reportContext)
  const [project, setProject] = useState<string>('')
  const [selectedSuites, setSelectedSuites] = useState<number>(0)

  useEffect(() => {
    if (report != null && project === '') setProject(report.project)
  }, [report])

  return (
    <Box pad="2rem" style={{ position: 'relative' }}>
      {report != null && (
        <Fragment>
          {/* Running Icon */}
          <PoseGroup flipMove={false} preEnterPose="exit">
            {report.progress !== true && (
              <AProgressIndicator key="Report-ProgressIndicator">
                <FillSpinner size={1.25} sizeUnit="rem" color="white" />
                <Text size="0.85rem" margin="0.5rem" weight="bold" color="white">
                  In Progress...
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
            <ReportAside selectedSuites={selectedSuites} />
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Report
