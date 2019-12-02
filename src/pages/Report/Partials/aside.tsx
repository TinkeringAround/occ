import React, { FC, useContext } from 'react'
import { Box, Text } from 'grommet'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import { SButton } from '../../../atoms/styled'
import Icon from '../../../atoms/icons'

// ==========================================================
interface Props {
  selectedSuites: number
  cancelled: boolean
  reportIsRunning: boolean
  cancelReport: () => void
}

// ==========================================================
const ReportAside: FC<Props> = ({ selectedSuites, cancelled, reportIsRunning, cancelReport }) => {
  const { report, deleteReport } = useContext(reportContext)

  const exportReport = () => {
    console.log('Selected Suites:', selectedSuites)
  }

  return (
    <Box height="inherit" width="25%" justify="end">
      {report != null && (
        <Box>
          <SButton background={colors['lightblue']} pad="1rem" onClick={exportReport}>
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
