import React, { FC } from 'react'
import { Box, Text } from 'grommet'
import styled from 'styled-components'

// Styles
import { colors } from '../../../styles'

// Types
import Icon, { IconType } from '../../../atoms/icons'

// Components
const ItemWrapper = styled(Box)`
  width: 80%;
  height: 50px;

  margin: 0 auto 1rem;
  border-radius: 10px;

  flex-direction: row;
  align-items: center;

  cursor: pointer;
  transition: all 0.25s ease;

  :hover {
    background: ${colors['whiteHover']};
  }
`

// ==========================================================
interface Props {
  type: IconType
  index: number
  setPage: (newNumber: number) => void
  content: string
  selected: boolean
}

// ==========================================================
const Item: FC<Props> = ({ type, selected = false, content, setPage, index }) => (
  <ItemWrapper
    style={{ background: selected ? colors['whiteTransparent'] : '' }}
    onClick={() => setPage(index)}
  >
    <Icon type={type} margin="0 1rem" size="1.5rem" />
    <Text size=".8rem" weight="bold">
      {content}
    </Text>
  </ItemWrapper>
)

export default Item
