import React, { FC } from 'react'
import { Box, Text } from 'grommet'

// Styles
import { colors, TColors } from '../styles'

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

  color?: TColors
  iconColor?: TColors

  disabled?: boolean
}

// ==========================================================
const Checkbox: FC<Props> = ({
  label,
  checked,
  onChange,
  margin = '0 0 0.5rem 0',
  size = '1.25rem',
  fontSize = '1rem',
  color = 'lightblue',
  iconColor = 'white',
  disabled = false
}) => (
  <Box
    margin={margin}
    pad="0.25rem"
    direction="row"
    align="center"
    onClick={() => {
      if (!disabled) onChange(!checked)
    }}
    style={{ cursor: disabled ? 'default' : 'pointer' }}
  >
    <Box
      width={size}
      height={size}
      background={disabled ? colors['lightGrey'] : checked ? colors[color] : colors['grey']}
      justify="center"
      align="center"
      style={{ borderRadius: 15, transition: 'all 0.25s ease' }}
    >
      <Icon size="40%" type={checked ? 'check' : 'plus'} color={iconColor} />
    </Box>

    <Text
      margin="0 0 0 .5rem"
      size={fontSize}
      color={disabled ? colors['lightGrey'] : checked ? colors[color] : colors['grey']}
      weight="bold"
    >
      {label}
    </Text>
  </Box>
)

export default Checkbox
