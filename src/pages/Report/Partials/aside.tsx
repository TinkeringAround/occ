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
interface Props {}

// ==========================================================
const ReportAside: FC<Props> = () => {
  const { report, deleteReport } = useContext(reportContext)

  return (
    <Box height="inherit" width="25%" justify="end">
      <Box>
        <SButton background={colors['lightblue']} pad="1rem">
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
            if (report) deleteReport(report)
          }}
        >
          <Icon type="trash" size="1rem" color="white" margin="0 0.5rem 0 0" />
          <Text size="0.8rem" weight="bold" color="white">
            Delete Report
          </Text>
        </SButton>
      </Box>
    </Box>
  )
}

export default ReportAside
