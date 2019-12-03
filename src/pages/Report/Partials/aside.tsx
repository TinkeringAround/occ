import React, { FC, useContext } from 'react'
import { Box, Text } from 'grommet'

// Types
import { TSuites } from '../../../types'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import { SButton } from '../../../atoms/styled'
import Icon from '../../../atoms/icons'

// Utility
import {
  getServerSuites,
  joinSuitesFromResults,
  getSeoSuites,
  getPerformanceSuites,
  getOptimizationSuites
} from '../../../utility/suites'

// ==========================================================
interface Props {
  selectedSuites: number
  cancelled: boolean
  reportIsRunning: boolean
  cancelReport: () => void
}

// ==========================================================
const ReportAside: FC<Props> = ({ selectedSuites, cancelled, reportIsRunning, cancelReport }) => {
  const { report, deleteReport, exportReport } = useContext(reportContext)

  const exportSelectedSuitesOfReport = () => {
    if (report && !disableExport) {
      const reportSuites = joinSuitesFromResults(report.results)
      var exportSuites: Array<TSuites> = []

      if ((selectedSuites & 0x0001) === 0x0001)
        exportSuites = [...exportSuites, ...getServerSuites(reportSuites)]

      if ((selectedSuites & 0x0010) === 0x0010)
        exportSuites = [...exportSuites, ...getSeoSuites(reportSuites)]

      if ((selectedSuites & 0x0100) === 0x0100)
        exportSuites = [...exportSuites, ...getPerformanceSuites(reportSuites)]

      if ((selectedSuites & 0x1000) === 0x1000)
        exportSuites = [...exportSuites, ...getOptimizationSuites(reportSuites)]

      exportReport(report, exportSuites)
    }
  }

  const disableExport = selectedSuites === 0

  return (
    <Box height="inherit" width="25%" justify="end">
      {report != null && (
        <Box>
          <SButton
            background={disableExport ? colors['grey'] : colors['lightblue']}
            pad="1rem"
            onClick={exportSelectedSuitesOfReport}
          >
            <Icon type="download" size="1rem" color="white" margin="0 0.5rem 0 0" />
            <Text size="0.8rem" weight="bold" color="white">
              Export to Disk
            </Text>
          </SButton>
          <SButton
            background={colors['lightblue']}
            pad="1rem"
            margin={{ top: '0.5rem' }}
            onClick={() => {
              if (!cancelled && reportIsRunning) cancelReport()
              else if (cancelled || !reportIsRunning) deleteReport(report)
            }}
          >
            <Icon
              type={reportIsRunning && !cancelled ? 'cancel' : 'trash'}
              size="1rem"
              color="white"
              margin="0 0.5rem 0 0"
            />
            <Text size="0.8rem" weight="bold" color="white">
              {reportIsRunning && !cancelled ? 'Cancel Report' : 'Delete Report'}
            </Text>
          </SButton>
        </Box>
      )}
    </Box>
  )
}

export default ReportAside
