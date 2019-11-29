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
export const ASimple = posed(Box)({
  exit: { opactiy: 0 },
  enter: { opacity: 1, delay: (props: any) => (props.delay ? props.delay : 500) }
})

// ===================================================================
const SSubPage = styled.div<{ minHeight?: string }>`
  height: 100%;
  width: 100%;

  min-height: ${(props: any) => (props.minHeight ? props.minHeight : '85%')};
  min-width: 100%;

  margin-top: 2rem;

  display: flex;
  flex-direction: column;
`
export const ASubPage = posed(SSubPage)({
  exit: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    delay: (props: any) => (props.delay ? props.delay : 500)
  }
})
