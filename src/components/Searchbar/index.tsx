import React, { FC, useState, useContext } from 'react'
import { Box, TextInput, Keyboard } from 'grommet'
import styled from 'styled-components'

// Styles
import { colors } from '../../styles'

// Atoms
import Icon from '../../atoms/icons'
import SButton from '../../atoms/sbutton'
import reportContext from '../../context/report-context'
const SBar = styled(Box)<{ mode: 'normal' | 'newReport' }>`
  height: 50px;
  border-radius: 15px;
  box-shadow: 0px 0px 20px 1px rgba(200, 214, 216, 0.25);
  transition: all 0.25s ease;

  :hover {
    box-shadow: 0px 0px 20px 1px
      rgba(200, 214, 216, ${(props: any) => (props.mode === 'normal' ? '0.5' : '0.25')});
  }
`

// ==========================================================
interface Props {
  mode: 'normal' | 'newReport'
  toggleMode: () => void
  filterReports: (options: string) => void
}

// ==========================================================
const Searchbar: FC<Props> = ({ mode, toggleMode, filterReports }) => {
  const { reportInProgress } = useContext(reportContext)
  const [options, setOptions] = useState<string>('')

  return (
    <Box
      width="100%"
      height="50px"
      margin={{ top: '1rem' }}
      direction="row"
      style={{ minHeight: '50px' }}
    >
      {/* Bar */}
      <SBar
        mode={mode}
        background={mode === 'normal' ? 'white' : colors['lightGrey']}
        flex="grow"
        direction="row"
        align="center"
        margin={{ left: '1rem' }}
      >
        <Icon
          type="search"
          color={mode === 'normal' ? 'lightblue' : 'darkGrey'}
          size="1.25rem"
          margin="0 .5rem 0 1.5rem"
          onClick={mode === 'normal' ? filterReports : null}
        />
        <Box flex="grow" margin={{ right: '1rem' }}>
          <Keyboard
            onEnter={() => {
              if (mode === 'normal') filterReports(options)
            }}
          >
            <TextInput
              disabled={mode === 'newReport'}
              placeholder={mode === 'normal' ? 'gingco.net' : ''}
              plain
              value={options}
              onChange={(event: any) => setOptions(event.target.value)}
            />
          </Keyboard>
        </Box>
      </SBar>

      {/* Add */}
      <SButton
        height="50px"
        width="50px"
        justify="center"
        align="center"
        margin="0 1rem 0 2rem"
        background={!reportInProgress ? 'white' : colors['lightGrey']}
        onClick={() => {
          if (!reportInProgress) toggleMode()
        }}
      >
        <Icon
          type="plus"
          color={!reportInProgress ? 'lightblue' : 'darkGrey'}
          size="1rem"
          style={{
            transform: `rotate(${mode === 'newReport' ? '45' : '0'}deg)`,
            transition: 'all 0.5s ease'
          }}
        />
      </SButton>
    </Box>
  )
}

export default Searchbar
