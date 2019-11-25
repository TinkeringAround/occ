import React, { FC, useState } from 'react'
import { Box } from 'grommet'
import { PoseGroup } from 'react-pose'

// Atoms
import { ASubPage } from '../../atoms/animations'

// Components
import Searchbar from '../../components/Searchbar'
import ReportsTable from '../../components/ReportsTable'
import SPNewReport from '../../components/SPNewReport'

// ==========================================================
const Home: FC = () => {
  const [mode, setMode] = useState<'normal' | 'newReport'>('normal')
  //const [newReport, setNewReport] = useState<TReport | null>(null)

  const toggleMode = () => (mode === 'normal' ? setMode('newReport') : setMode('normal'))
  const filterReports = (searchOptions: string) => {
    console.log('Filter Reports')
  }

  return (
    <Box align="center">
      {/* Searchbar */}
      <Searchbar mode={mode} toggleMode={toggleMode} filterReports={filterReports} />

      {/* Content */}
      <PoseGroup flipMove={false} preEnterPose="exit">
        {mode === 'normal' && (
          <ASubPage key="Home-normal">
            {/* Table */}
            <Box width="100%" align="center" justify="center" margin={{ top: '3rem' }}>
              <ReportsTable />
            </Box>
          </ASubPage>
        )}

        {mode === 'newReport' && (
          <ASubPage key="Home-newReport">
            <SPNewReport />
          </ASubPage>
        )}
      </PoseGroup>
    </Box>
  )
}

export default Home
