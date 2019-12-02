import React, { FC } from 'react'
import { Box, Text } from 'grommet'

// Styles
import { colors } from '../styles'

// Atoms
import Icon from './icons'

// ==========================================================
interface Props {
  label: string
  checked: boolean
  onChange: (newState: boolean) => void

  margin?: string
  size?: string
  fontSize?: string
}

// ==========================================================
const Checkbox: FC<Props> = ({
  label,
  checked,
  onChange,
  margin = '0 0 0.5rem 0',
  size = '1.25rem',
  fontSize = '1rem'
}) => (
  <Box
    margin={margin}
    pad="0.25rem"
    direction="row"
    align="center"
    onClick={() => onChange(!checked)}
    style={{ cursor: 'pointer' }}
  >
    <Box
      width={size}
      height={size}
      background={checked ? colors['lightblue'] : colors['darkGrey']}
      justify="center"
      align="center"
      style={{ borderRadius: 15, transition: 'all 0.25s ease' }}
    >
      <Icon size="40%" type={checked ? 'check' : 'plus'} color="white" />
    </Box>

    <Text
      margin="0 0 0 .5rem"
      size={fontSize}
      color={checked ? colors['lightblue'] : colors['lightGrey']}
      weight="bold"
    >
      {label}
    </Text>
  </Box>
)

export default Checkbox
