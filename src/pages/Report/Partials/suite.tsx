import React, { FC, Fragment } from 'react'
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
  <Fragment>
    {suites.length > 0 ? (
      <Suite width="45%" height="48%" selected={selected} onClick={() => toggle(!selected)}>
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
          <Box
            key={'Report-Server-' + index}
            direction="row"
            align="center"
            margin={{ bottom: '.5rem', left: '.5rem' }}
          >
            <Box
              width="1rem"
              height="1rem"
              background={selected ? 'white' : colors['darkGrey']}
              justify="center"
              align="center"
              style={{ borderRadius: 15, transition: 'all 0.25s ease' }}
            >
              <Icon size="0.5rem" type="check" color={selected ? 'lightblue' : 'white'} />
            </Box>
            <Text
              size="0.9rem"
              weight="bold"
              margin={{ left: '.5rem' }}
              color={selected ? 'white' : colors['grey']}
            >
              {getSuiteName(suite)}
            </Text>
          </Box>
        ))}
      </Suite>
    ) : (
      <></>
    )}
  </Fragment>
)
export default ReportSuite
