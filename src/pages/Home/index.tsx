import React, { FC } from 'react'
import { Box } from 'grommet'

// Components
import Searchbar from '../../components/Searchbar'
import ReportsTable from '../../components/ReportsTable'

// ==========================================================
const Home: FC = () => {
  const addReport = () => {
    console.log('Add Report')
  }
  const filterReports = (searchOptions: string) => {
    console.log('Filter Reports')
  }

  return (
    <Box align="center">
      {/* Searchbar */}
      <Searchbar addReport={addReport} filterReports={filterReports} />

      {/* Table */}
      <Box width="100%" align="center" justify="center" margin={{ top: '3rem' }}>
        <ReportsTable />
      </Box>
    </Box>
  )
}

export default Home
