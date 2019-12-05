import React, { FC, useState, useContext } from 'react'
import { Box, TextInput, Keyboard } from 'grommet'
import styled from 'styled-components'
import { HeartSpinner } from 'react-spinners-kit'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// Atoms
import Icon from '../../atoms/icons'
import { SButton } from '../../atoms/styled'
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
      pad="0 2rem"
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
        margin="0 0 0 2rem"
        background={reportInProgress == null ? 'white' : colors['lightGrey']}
        disabled={reportInProgress != null}
        onClick={() => {
          if (reportInProgress == null) toggleMode()
        }}
      >
        {reportInProgress == null && (
          <Icon
            type="plus"
            color={reportInProgress == null ? 'lightblue' : 'darkGrey'}
            size="1rem"
            style={{
              transform: `rotate(${mode === 'newReport' ? '45' : '0'}deg)`,
              transition: 'all 0.5s ease'
            }}
          />
        )}

        {reportInProgress != null && (
          <HeartSpinner size={1} sizeUnit="rem" color={colors['darkGrey']} loading />
        )}
      </SButton>
    </Box>
  )
}

export default Searchbar
