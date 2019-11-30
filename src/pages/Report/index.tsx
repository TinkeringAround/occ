import React, { FC, useContext, Fragment } from 'react'
import { Box, Heading, Text } from 'grommet'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// Partials
import ReportAside from './Partials/aside'

// ==========================================================
const Report: FC = () => {
  const { report } = useContext(reportContext)

  return (
    <Box pad="2rem" style={{ position: 'relative' }}>
      {report != null && (
        <Fragment>
          {/* Heading */}
          <Box width="70%">
            <Heading level="1" margin="0" color={colors['darkGrey']} size="4rem" truncate>
              {report.project}
            </Heading>
            <Text margin={{ left: '0.25rem' }} color={colors['grey']} size="1.5rem" truncate>
              {report.url}
            </Text>
          </Box>

          {/* Suites & Aside */}
          <Box
            width="100%"
            margin="3rem 0 .75rem"
            justify="between"
            direction="row"
            style={{
              minHeight: `calc(${window.innerHeight}px -  16rem)`
            }}
          >
            {/* Suites */}
            <Box
              width="70%"
              height={`calc(${window.innerHeight}px -  16rem)`}
              background="grey"
              direction="row"
              justify="around"
              align="end"
              wrap
              style={{
                minHeight: `calc(${window.innerHeight}px -  16rem)`,
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
              <Box width="48%" height="48%" background="red" style={{ borderRadius: 15 }} />
              <Box width="48%" height="48%" background="red" style={{ borderRadius: 15 }} />
              <Box width="48%" height="48%" background="red" style={{ borderRadius: 15 }} />
              <Box width="48%" height="48%" background="red" style={{ borderRadius: 15 }} />
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
