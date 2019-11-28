import React, { FC, useState } from 'react'
import { Box, Heading } from 'grommet'
import { PoseGroup } from 'react-pose'

// Atoms
import { ASubPage } from '../../atoms/animations'

// Components
import Searchbar from '../../components/Searchbar'
import ReportsTable from '../../components/ReportsTable'

// Partials
import Report from './Partials/report'

// Styles
import { colors } from '../../styles'

// ==========================================================
const Home: FC = () => {
  const [mode, setMode] = useState<'normal' | 'newReport'>('normal')

  const toggleMode = () => (mode === 'normal' ? setMode('newReport') : setMode('normal'))
  const filterReports = (searchOptions: string) => {
    console.log('Filter Reports')
  }

  const minHeight = `calc(${window.innerHeight - 50}px - 5rem)`

  return (
    <Box style={{ position: 'relative' }}>
      {/* Searchbar */}
      <Searchbar mode={mode} toggleMode={toggleMode} filterReports={filterReports} />

      {/* Content */}
      <PoseGroup flipMove={false} preEnterPose="exit">
        {mode === 'normal' && (
          <ASubPage key="Home-normal" minHeight={minHeight}>
            <Heading
              level="1"
              color={colors['darkGrey']}
              size="3rem"
              alignSelf="start"
              margin={{ left: 'calc(2rem + 6px)' }}
            >
              My Reports
            </Heading>
            <ReportsTable />
          </ASubPage>
        )}

        {mode === 'newReport' && (
          <ASubPage key="Home-newReport" minHeight={minHeight}>
            <Heading
              level="1"
              color={colors['darkGrey']}
              size="3rem"
              alignSelf="start"
              margin={{ left: 'calc(2rem + 6px)' }}
            >
              New Report
            </Heading>
            <Report toggleModus={toggleMode} />
          </ASubPage>
        )}
      </PoseGroup>
    </Box>
  )
}

export default Home
