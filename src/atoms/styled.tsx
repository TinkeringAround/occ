import styled from 'styled-components'
import { Box } from 'grommet'

// ==========================================================
export const SButton = styled(Box)<{ disabled?: boolean }>`
  border-radius: 15px;
  box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.25);

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: all 0.25s ease;

  flex-direction: row;
  justify-content: center;
  align-items: center;

  :hover {
    box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.35);
  }
`
