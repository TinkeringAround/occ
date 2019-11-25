import React, { FC } from 'react'
import { BarsSpinner } from 'react-spinners-kit'

// Style
import { colors } from '../../styles'

// ==========================================================
interface Props {
  size?: number
  color?: 'lightblue'
  sizeUnit?: string
}

// ==========================================================
const LoadingSpinner: FC<Props> = ({ size = 5, color = colors['lightblue'], sizeUnit = 'rem' }) => {
  return <BarsSpinner size={size} color={color} sizeUnit={sizeUnit} loading />
}

export default LoadingSpinner
