import React, { FC, useState } from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'

// Styles
import { colors, TColors } from '../../styles'

// Utility
import { minimizeWindowInMain, fullscreenWindowInMain } from '../../utility/ipc'

// Atoms
import Icon from '../../atoms/icons'
const SBar = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 120;

  width: 100vw;
  height: 2rem;

  background: transparent;

  -webkit-app-region: drag;
`

const SBarButton = styled.div<{ color: TColors }>`
  width: 13px;
  height: 13px;

  background: ${({ color }) => colors[color]};

  border-radius: 15px;
`

// ==========================================================
const WindowBar: FC = () => {
  const [hover, setHover] = useState<boolean>(false)

  return (
    <SBar>
      <Box
        width="75px"
        height="100%"
        align="center"
        justify="center"
        direction="row"
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <SBarButton color="red" onClick={() => window.close()}>
          {hover && (
            <Icon
              type="plus"
              color="black"
              size="7px"
              margin="0 0 7px 3px"
              style={{ transform: 'rotate(45deg)' }}
            />
          )}
        </SBarButton>
        <SBarButton color="yellow" style={{ margin: '0 .5rem' }} onClick={minimizeWindowInMain}>
          {hover && <Icon type="minus" color="black" size="7px" margin="0 0 7px 3px" />}
        </SBarButton>
        <SBarButton color="green" onClick={fullscreenWindowInMain}>
          {hover && <Icon type="expand" color="black" size="7px" margin="0 0 7px 3px" />}
        </SBarButton>
      </Box>
    </SBar>
  )
}

export default WindowBar
