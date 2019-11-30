import React, { FC, useContext, Fragment, useState, useEffect } from 'react'
import { Box, Text, TextInput } from 'grommet'

// Types
import { TSuiteCategory } from '../../types/configuration'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// Partials
import ReportAside from './Partials/aside'

// Utility
import ReportSuites from './Partials/suites'

// ==========================================================
const Report: FC = () => {
  const { report, updateReportProject } = useContext(reportContext)
  const [project, setProject] = useState<string>('')
  const [suites, setSuites] = useState<Array<TSuiteCategory> | null>(null)

  useEffect(() => {
    if (report != null && project === '') setProject(report.project)
  }, [report])

  return (
    <Box pad="2rem" style={{ position: 'relative' }}>
      {report != null && (
        <Fragment>
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
              />
              <Box
                height="2rem"
                background={colors['lightblue']}
                justify="center"
                align="center"
                pad="1rem"
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: '-2rem',
                  right: '-4rem',
                  borderRadius: 15,
                  transition: 'all 0.25s ease',
                  opacity: report.project !== project ? 1 : 0
                }}
                onClick={() => updateReportProject(report, project)}
              >
                <Text size=".8rem" weight="bold" color="white">
                  Save Changes
                </Text>
              </Box>
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
            <ReportSuites />

            {/* Aside */}
            <ReportAside />
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Report
