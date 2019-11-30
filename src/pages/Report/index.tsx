import React, { FC, useContext, Fragment, useState, useEffect } from 'react'
import { Box, Text, TextInput, Heading } from 'grommet'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// Partials
import ReportAside from './Partials/aside'
import Icon from '../../atoms/icons'

// Utility
import { ServerSuites } from '../../utility/suites'

// ==========================================================
const Report: FC = () => {
  const { report, updateReportProject } = useContext(reportContext)
  const [project, setProject] = useState<string>('')

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
          <Box width="100%" margin="3rem 0 .75rem" justify="between" direction="row">
            {/* Suites */}
            <Box
              width="70%"
              height={`calc(${window.innerHeight}px -  17rem)`}
              direction="row"
              justify="between"
              align="end"
              wrap
            >
              <Box
                width="51%"
                height="48%"
                background="white"
                pad="1rem"
                style={{ borderRadius: 15 }}
              >
                <Box width="100%" direction="row" align="center">
                  <Icon type="server" color="darkGrey" size="2rem" />
                  <Heading level="4" size="1.5rem" margin="0 0 0 1rem" color={colors['darkGrey']}>
                    {ServerSuites.name}
                  </Heading>
                </Box>
              </Box>
              <Box width="47%" height="48%" background="red" style={{ borderRadius: 15 }} />
              <Box width="40%" height="48%" background="red" style={{ borderRadius: 15 }} />
              <Box width="58%" height="48%" background="red" style={{ borderRadius: 15 }} />
            </Box>

            {/* Aside */}
            <ReportAside />
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Report
