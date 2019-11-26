import posed from 'react-pose'
import { Box } from 'grommet'
import styled from 'styled-components'

// ===================================================================
const SBox = styled(Box)`
  position: relative;

  width: 100%;
  min-height: 100%;
`

export const APage = posed(SBox)({
  exit: {
    opacity: 0,
    left: '2.5%'
  },
  enter: {
    opacity: 1,
    left: 0,
    delay: 500
  }
})

// ===================================================================
const SLoadingSpinner = styled.div`
  position: relative;

  width: 100%;
  min-height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const ALoadingSpinner = posed(SLoadingSpinner)({
  exit: { opacity: 0 },
  enter: { opacity: 1, delay: 250 }
})

// ===================================================================
export const ASimple = posed(SBox)({
  exit: { opactiy: 0 },
  enter: { opacity: 1 }
})

// ===================================================================
const SSubPage = styled(Box)`
  width: 100%;

  margin-top: 2rem;
`
export const ASubPage = posed(SSubPage)({
  exit: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    delay: 500
  }
})

// ===================================================================
const SSideBar = styled(Box)<{ height?: number }>`
  height: ${(props: any) => (props.height ? props.height : 450)}px;

  align-items: flex-end;
`

export const ASideBar = posed(SSideBar)({
  exit: {
    opacity: 0,
    width: 0
  },
  enter: {
    opacity: 1,
    width: 400
  }
})
