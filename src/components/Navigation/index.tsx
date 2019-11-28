import React, { FC, useContext } from 'react'
import styled from 'styled-components'
import { Box, Text } from 'grommet'

// Types
import { IconType } from '../../atoms/icons'

// Styles
import { sizes, colors } from '../../styles'

// Context
import pageContext from '../../context/page-context'
import reportContext from '../../context/report-context'

// Components
import Item from './Partials/Item'

const Aside = styled.aside`
  width: ${sizes['navigation']}px;

  background: ${colors['lightblue']};

  padding: 3rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  -webkit-app-region: drag;
`

// Consts
const icons: Array<IconType> = ['home', 'clipboard', 'settings']

// ==========================================================
const Navigation: FC = () => {
  const { report } = useContext(reportContext)
  const { page, setPage } = useContext(pageContext)

  return (
    <Aside>
      <Box
        width="100%"
        height="75px"
        margin="1rem 0 0"
        direction="row"
        align="center"
        justify="center"
      >
        <Text size="1rem" weight="bold">
          Logo
        </Text>
      </Box>

      {/* Items */}
      <Box width="100%" margin="4rem 0 0">
        {icons.map((icon: IconType, index: number) => (
          <Item
            key={'Page-' + index}
            type={icon}
            setPage={setPage}
            index={index}
            selected={index === page}
            enabled={index === 1 ? report != null : true}
          />
        ))}
      </Box>
    </Aside>
  )
}

export default Navigation
