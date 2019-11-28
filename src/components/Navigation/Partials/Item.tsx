import React, { FC } from 'react'
import styled from 'styled-components'

// Styles
import { colors } from '../../../styles'

// Types
import Icon, { IconType } from '../../../atoms/icons'

// Components
const ItemWrapper = styled.div<{ enabled: boolean; selected: boolean }>`
  width: 55px;
  height: 55px;

  margin: 0 auto 1rem;
  border-radius: 10px;

  display: flex
  flex-direction: row;
  align-items: center;

  background: ${({ selected }) => (selected ? colors['whiteTransparent'] : '')};

  cursor: pointer;
  transition: all 0.25s ease;

  :hover {
    background: ${({ enabled }) => (enabled ? colors['whiteHover'] : 'inherit')};
  }
`

// ==========================================================
interface Props {
  type: IconType
  index: number
  setPage: (newNumber: number) => void
  selected: boolean
  enabled: boolean
}

// ==========================================================
const Item: FC<Props> = ({ type, selected = false, setPage, index, enabled }) => (
  <ItemWrapper enabled={enabled} selected={selected} onClick={() => setPage(index)}>
    <Icon type={type} margin="0 1rem" size="100%" color={enabled ? 'white' : 'grey'} />
  </ItemWrapper>
)

export default Item
