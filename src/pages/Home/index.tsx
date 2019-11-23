import React, { FC } from 'react'
import { Box } from 'grommet'

// Components
import Searchbar from '../../components/Searchbar'

// ==========================================================
interface Props {}

// ==========================================================
const Home: FC<Props> = () => {
  const addReport = () => {
    console.log('Add Report')
  }
  const filterReports = (searchOptions: string) => {
    console.log('Filter Reports')
  }

  return (
    <Box>
      {/* Searchbar */}
      <Searchbar addReport={addReport} filterReports={filterReports} />

      {/* Content */}
    </Box>
  )
}

export default Home
