import styled from 'styled-components'
import { Box } from 'grommet'

// ==========================================================
const SButton = styled(Box)`
  border-radius: 15px;
  box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.25);
  cursor: pointer;
  transition: all 0.25s ease;

  :hover {
    box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.35);
  }
`

export default SButton
