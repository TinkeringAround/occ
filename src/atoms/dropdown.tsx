import React, { FC } from 'react'
import styled from 'styled-components'

// Styles
import { colors } from '../styles'
import { Box, Text } from 'grommet'

// Atoms
const SSelect = styled.select`
  height: 50px;
  width: 100%;

  padding: 1rem;

  background: ${colors['white']};

  border: none;
  border-radius: 15px;

  appearance: none;
  outline: none;

  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  color: ${colors['darkGrey']};

  ::-ms-expand {
    display: none;
  }
`

// ==========================================================
interface Props {
  options: Array<string>
  value: string
  select: (selection: string) => void
  label?: string
}

// ==========================================================
const Dropdown: FC<Props> = ({ options, value, select, label = null }) => (
  <Box>
    {label && (
      <Text size="1rem" weight="bold" color={colors['grey']} margin="0 0 .25rem .25rem">
        {label}
      </Text>
    )}
    <SSelect
      id={'Selection-' + value}
      value={value}
      onChange={(event: any) => select(event.target.value)}
    >
      {options.map((option: string, index: number) => (
        <option key={'Option-' + index}>{option}</option>
      ))}
    </SSelect>
  </Box>
)

export default Dropdown
