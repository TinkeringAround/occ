import React, { useContext, useState, useEffect } from 'react'
import { Box } from 'grommet'

// Types
import { TSuiteCategories } from '../../../types'

// Context
import reportContext from '../../../context/report-context'

// Utility
import {
  getServerSuites,
  joinSuitesFromResults,
  getSeoSuites,
  getPerformanceSuites,
  getOptimizationSuites
} from '../../../utility/suites'

// Atoms
import ReportSuite from './suite'

// ==========================================================
interface Props {
  selectedSuites: number
  setSelectedSuites: (suites: number) => void
}

// ==========================================================
const ReportSuites: React.FC<Props> = ({ selectedSuites, setSelectedSuites }) => {
  const { report } = useContext(reportContext)
  const [suites, setSuites] = useState<TSuiteCategories | null>(null)

  useEffect(() => {
    if (report) {
      const allSuites = joinSuitesFromResults(report.results)
      const server = getServerSuites(allSuites)
      const seo = getSeoSuites(allSuites)
      const performance = getPerformanceSuites(allSuites)
      const optimization = getOptimizationSuites(allSuites)
      setSuites({
        server: server,
        seo: seo,
        performance: performance,
        optimization: optimization
      })
    } else setSuites(null)
  }, [report])

  return (
    <Box width="70%" height="inherit" justify="between" wrap>
      {/* Server Suites */}
      {suites && (
        <ReportSuite
          type="server"
          iconType="server"
          selected={(selectedSuites & 0x0001) === 0x0001}
          toggle={() =>
            setSelectedSuites(
              (selectedSuites & 0x0001) === 0x0001
                ? selectedSuites & 0x1110
                : selectedSuites | 0x0001
            )
          }
          suites={suites.server}
        />
      )}

      {suites && (
        <ReportSuite
          type="seo"
          iconType="accessibility"
          selected={(selectedSuites & 0x0010) === 0x0010}
          toggle={() =>
            setSelectedSuites(
              (selectedSuites & 0x0010) === 0x0010
                ? selectedSuites & 0x1101
                : selectedSuites | 0x0010
            )
          }
          suites={suites.seo}
        />
      )}

      {suites && (
        <ReportSuite
          type="performance"
          iconType="tacho"
          selected={(selectedSuites & 0x0100) === 0x0100}
          toggle={() =>
            setSelectedSuites(
              (selectedSuites & 0x0100) === 0x0100
                ? selectedSuites & 0x1011
                : selectedSuites | 0x0100
            )
          }
          suites={suites.performance}
        />
      )}

      {suites && (
        <ReportSuite
          type="optimization"
          iconType="zip"
          selected={(selectedSuites & 0x1000) === 0x1000}
          toggle={() =>
            setSelectedSuites(
              (selectedSuites & 0x1000) === 0x1000
                ? selectedSuites & 0x0111
                : selectedSuites | 0x1000
            )
          }
          suites={suites.optimization}
        />
      )}
    </Box>
  )
}

export default ReportSuites
