import React from 'react'
import { Box, Text } from 'grommet'

// Styles
import { colors } from '../../../styles'

// Atoms
import { SButton } from '../../../atoms/styled'
import Icon from '../../../atoms/icons'

// ==========================================================
interface Props {}

// ==========================================================
const ReportAside: React.FC<Props> = () => {
  return (
    <Box
      width="25%"
      height={`calc(${window.innerHeight}px -  16rem)`}
      justify="end"
      style={{
        minHeight: `calc(${window.innerHeight}px -  16rem)`
      }}
    >
      <Box>
        <SButton background={colors['lightblue']} pad="1rem">
          <Icon type="open" size="1rem" color="white" margin="0 0.5rem 0 0" />
          <Text size="0.8rem" weight="bold" color="white">
            Export Report
          </Text>
        </SButton>
        <SButton background={colors['lightblue']} pad="1rem" margin={{ top: '0.5rem' }}>
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
