import React, { FC, useState, useContext, useEffect } from 'react'
import { Box, Heading } from 'grommet'
import { PoseGroup } from 'react-pose'

// Types
import { TReport } from '../../types'

// Context
import reportContext from '../../context/report-context'

// Atoms
import { ASubPage } from '../../atoms/animations'

// Components
import Searchbar from '../../components/Searchbar'
import ReportsTable from '../../components/ReportsTable'

// Partials
import Report from './Partials/report'

// Styles
import { colors } from '../../styles'

// Consts
const FILTER_DURATION = 850

// ==========================================================
const Home: FC = () => {
  const { reports } = useContext(reportContext)
  const [mode, setMode] = useState<'normal' | 'newReport'>('normal')
  const [filteredReports, setFilteredReports] = useState<Array<TReport> | null>(null)
  const [searchOptions, setSearchOptions] = useState<string>('')
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const toggleMode = () => (mode === 'normal' ? setMode('newReport') : setMode('normal'))
  const filterReports = (query: string) => {
    if (query === '' && filteredReports == null) {
    } else {
      setIsFiltering(true)
      setSearchOptions(query)
      if (query === '') setFilteredReports(null)
      else {
        const filterResult: Array<TReport> = reports.filter(
          (x: TReport) =>
            x.url.toLowerCase().includes(query.toLowerCase()) ||
            x.project.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredReports(filterResult)
      }

      setTimeout(() => setIsFiltering(false), FILTER_DURATION)
    }
  }

  useEffect(() => {
    if (filteredReports != null) {
      setIsFiltering(true)
      filterReports(searchOptions)
      setTimeout(() => setIsFiltering(false), FILTER_DURATION)
    }
  }, [reports])

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
              {filteredReports != null ? 'Search Results' : 'My Reports'}
            </Heading>
            <ReportsTable
              isChanging={isFiltering}
              reports={filteredReports != null ? filteredReports : reports}
            />
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
