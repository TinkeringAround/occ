import posed from 'react-pose'
import { Box } from 'grommet'
import styled from 'styled-components'

// Styles
import { colors } from '../styles'

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

// ===================================================================
const SProgressIndicator = styled(Box)`
  position: absolute;
  top: 0;
  right: 2rem;

  width: 200px;
  height: 40px;

  background: ${colors['lightblue']};
  border-radius: 15px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const AProgressIndicator = posed(SProgressIndicator)({
  exit: { opactiy: 0, x: 300, transition: { duration: 750 } },
  enter: { opactiy: 1, x: 0, transition: { duration: 750 } }
})
