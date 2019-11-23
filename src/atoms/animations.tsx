import posed from 'react-pose'
import { Box } from 'grommet'
import styled from 'styled-components'

// ===================================================================
const PageBox = styled(Box)`
  position: relative;
`

export const APage = posed(PageBox)({
  exit: {
    opacity: 0,
    left: '2.5%'
  },
  enter: {
    opacity: 1,
    left: 0,
    delay: 250
  }
})
