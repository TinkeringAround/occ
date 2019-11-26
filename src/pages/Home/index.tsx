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
  //const [newReport, setNewReport] = useState<TReport | null>(null)

  const toggleMode = () => (mode === 'normal' ? setMode('newReport') : setMode('normal'))
  const filterReports = (searchOptions: string) => {
    console.log('Filter Reports')
  }

  return (
    <Box>
      {/* Searchbar */}
      <Searchbar mode={mode} toggleMode={toggleMode} filterReports={filterReports} />

      {/* Content */}
      <PoseGroup flipMove={false} preEnterPose="exit">
        {mode === 'normal' && (
          <ASubPage key="Home-normal">
            <Heading
              level="1"
              color={colors['darkGrey']}
              size="3rem"
              alignSelf="start"
              margin={{ left: '2rem' }}
            >
              My Reports
            </Heading>
            <ReportsTable />
          </ASubPage>
        )}

        {mode === 'newReport' && (
          <ASubPage key="Home-newReport">
            <Heading
              level="1"
              color={colors['darkGrey']}
              size="3rem"
              alignSelf="start"
              margin={{ left: '2rem' }}
            >
              New Report
            </Heading>
            <Report />
          </ASubPage>
        )}
      </PoseGroup>
    </Box>
  )
}

export default Home
