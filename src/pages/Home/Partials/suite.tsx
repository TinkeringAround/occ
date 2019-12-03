import React, { FC } from 'react'
import { Box, Heading } from 'grommet'

// Types
import { TSuites } from '../../../types'

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
import Icon from '../../../atoms/icons'
import Checkbox from '../../../atoms/checkbox'
import styled from 'styled-components'
const SSuite = styled(Box)<{ allSelected: boolean }>`
  width: 48%;

  margin-bottom: 1rem;
  padding: 1rem;

  background: ${({ allSelected }) => (allSelected ? colors['lightblue'] : 'white')};
  border-radius: 15px;

  transition: all 0.25s ease;
`

// ==========================================================
interface Props {
  type: 'server' | 'accessibility' | 'tacho' | 'zip'
  allSelected: boolean
  toggle: () => void
  selections: Array<boolean>
  select: (index: number) => void
}

// ==========================================================
const ReportSuite: FC<Props> = ({ type, allSelected, toggle, selections, select }) => (
  <SSuite allSelected={allSelected}>
    <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
      <Icon type={type} color={allSelected ? 'white' : 'darkGrey'} size="2rem" onClick={toggle} />
      <Heading
        level="6"
        size="1.5rem"
        margin="0 0 0 0.5rem"
        truncate
        color={allSelected ? 'white' : colors['darkGrey']}
        onClick={toggle}
        style={{ cursor: 'pointer' }}
      >
        {type === 'server' && ServerSuites.name}
        {type === 'accessibility' && SeoSuites.name}
        {type === 'tacho' && PerformanceSuites.name}
        {type === 'zip' && OptimizationSuites.name}
      </Heading>
    </Box>
    {/* Checkboxes */}
    {type === 'server' &&
      ServerSuites.suites.map((suite: TSuites, index: number) => (
        <Checkbox
          key={'NewReport-ServerSuites-' + index}
          label={getSuiteName(suite)}
          checked={selections[index]}
          onChange={() => select(index)}
          color={allSelected ? 'white' : 'lightblue'}
          iconColor={allSelected ? 'lightblue' : 'white'}
        />
      ))}

    {type === 'accessibility' &&
      SeoSuites.suites.map((suite: TSuites, index: number) => (
        <Checkbox
          key={'NewReport-SeoSuites-' + index}
          label={getSuiteName(suite)}
          checked={selections[index]}
          onChange={() => select(index)}
          color={allSelected ? 'white' : 'lightblue'}
          iconColor={allSelected ? 'lightblue' : 'white'}
        />
      ))}

    {type === 'tacho' &&
      PerformanceSuites.suites.map((suite: TSuites, index: number) => (
        <Checkbox
          key={'NewReport-PerformanceSuites-' + index}
          label={getSuiteName(suite)}
          checked={selections[index]}
          onChange={() => select(index)}
          color={allSelected ? 'white' : 'lightblue'}
          iconColor={allSelected ? 'lightblue' : 'white'}
        />
      ))}

    {type === 'zip' &&
      OptimizationSuites.suites.map((suite: TSuites, index: number) => (
        <Checkbox
          key={'NewReport-OptimizationSuites-' + index}
          label={getSuiteName(suite)}
          checked={selections[index]}
          onChange={() => select(index)}
          color={allSelected ? 'white' : 'lightblue'}
          iconColor={allSelected ? 'lightblue' : 'white'}
        />
      ))}
  </SSuite>
)
export default ReportSuite
