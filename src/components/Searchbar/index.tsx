import React, { FC, useState } from 'react'
import { Box, TextInput, Keyboard } from 'grommet'

// Atoms
import Icon from '../../atoms/icons'

// ==========================================================
interface Props {
  addReport: (url: string) => void
  filterReports: (options: string) => void
}

// ==========================================================
const Searchbar: FC<Props> = ({ addReport, filterReports }) => {
  const [options, setOptions] = useState<string>('')

  return (
    <Box width="100%" height="50px" margin={{ top: '1rem' }} direction="row">
      {/* Bar */}
      <Box
        background="white"
        flex="grow"
        direction="row"
        align="center"
        margin={{ left: '1rem' }}
        style={{ borderRadius: 15, boxShadow: '0px 0px 20px 1px rgba(200 ,214 ,216, .25)' }}
      >
        <Icon
          type="search"
          color="lightblue"
          size="1.25rem"
          margin="0 .5rem 0 1.5rem"
          onClick={filterReports}
        />
        <Box flex="grow" margin={{ right: '1rem' }}>
          <Keyboard onEnter={() => filterReports(options)}>
            <TextInput
              placeholder="gingco.net"
              plain
              value={options}
              onChange={(event: any) => setOptions(event.target.value)}
            />
          </Keyboard>
        </Box>
      </Box>

      {/* Add */}
      <Box
        height="100%"
        width="50px"
        justify="center"
        align="center"
        margin="0 1rem 0 2rem"
        background="white"
        style={{
          borderRadius: 15,
          boxShadow: '0px 0px 20px 1px rgba(200 ,214 ,216, .25)',
          cursor: 'pointer'
        }}
        onClick={() => addReport(options)}
      >
        <Icon type="plus" color="lightblue" size="1rem" />
      </Box>
    </Box>
  )
}

export default Searchbar
