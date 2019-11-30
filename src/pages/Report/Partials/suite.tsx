import React, { FC } from 'react'
import { Box, Heading, Text } from 'grommet'
import styled from 'styled-components'

// Types
import Icon, { IconType } from '../../../atoms/icons'
import { TSuites } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Utility
import {
  ServerSuites,
  getSuiteName,
  SeoSuites,
  PerformanceSuites,
  OptimizationSuites
} from '../../../utility/suites'

// Atoms
const Suite = styled(Box)<{ selected: boolean }>`
  padding: 1rem;

  border-radius: 15px;
  background: ${({ selected }) => (selected ? colors['lightblue'] : 'white')};

  cursor: pointer;
  transition: all 0.25s ease;

  :hover {
    background: ${({ selected }) => (selected ? colors['lightblue'] : colors['lightblueHover'])};
  }
`

// ==========================================================
interface Props {
  selected: boolean
  toggle: (state: boolean) => void
  iconType: IconType
  suites: Array<TSuites>
  type: 'server' | 'seo' | 'performance' | 'optimization'
}

// ==========================================================
const ReportSuite: FC<Props> = ({ selected, toggle, iconType, suites, type }) => (
  <Suite width="46%" height="48%" selected={selected} onClick={() => toggle(!selected)}>
    <Box width="100%" direction="row" align="center" margin={{ bottom: '1rem' }}>
      <Icon type={iconType} color={selected ? 'white' : 'darkGrey'} size="2rem" />
      <Heading
        level="4"
        size="1.5rem"
        margin="0 0 0 1rem"
        color={selected ? 'white' : colors['darkGrey']}
      >
        {type === 'server' && ServerSuites.name}
        {type === 'seo' && SeoSuites.name}
        {type === 'performance' && PerformanceSuites.name}
        {type === 'optimization' && OptimizationSuites.name}
      </Heading>
    </Box>
    {suites.map((suite: TSuites, index: number) => (
      <Text
        key={'Report-Server-' + index}
        size="0.8rem"
        color={selected ? 'white' : colors['grey']}
      >
        {getSuiteName(suite)}
      </Text>
    ))}
  </Suite>
)
export default ReportSuite
