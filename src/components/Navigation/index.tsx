import React, { FC, useContext } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'

// Types & Atoms
import Icon, { IconType } from '../../atoms/icons'

// Styles
import { sizes, colors } from '../../styles'

// Context
import pageContext from '../../context/page-context'
import reportContext from '../../context/report-context'

// Components
import Item from './Partials/Item'
import AppVersion from '../AppVersion'

// Atoms
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
        width="75x"
        height="75px"
        margin="1rem 0 0"
        align="center"
        justify="center"
        style={{ minWidth: '75px' }}
      >
        <Icon type="logo" size="45px" color="white" />
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

      {/* App Version */}
      <AppVersion />
    </Aside>
  )
}

export default Navigation
