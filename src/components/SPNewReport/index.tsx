import React, { FC, useState } from 'react'
import { Box, TextInput, Keyboard, Form } from 'grommet'
import { colors } from '../../styles'

// ==========================================================
interface Props {}

// ==========================================================
const SPNewReport: FC<Props> = () => {
  const [project, setProject] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  return (
    <Box width="100%" pad="0 0.75rem 0 1.5rem" margin="0 1rem">
      <Box width="100%" height="100%" direction="row" justify="between">
        {/* Formular */}
        <Box
          width="65%"
          height="100%"
          style={{ borderRadius: 15, boxShadow: '0px 0px 20px 1px rgba(200, 214, 216, 0.25)' }}
        >
          <Keyboard
            onEnter={() => {
              // TODO
            }}
          >
            <Form>
              Eingabe
              <TextInput
                placeholder="Project"
                plain
                value={project}
                onChange={(event: any) => setProject(event.target.value)}
              />
              <TextInput
                placeholder="URL"
                plain
                value={url}
                onChange={(event: any) => setUrl(event.target.value)}
              />
              {/* TODO: Suites */}
            </Form>
          </Keyboard>
        </Box>

        {/* Stats */}
        <Box width="30%" height="100%" style={{ borderLeft: 'solid 2px ' + colors['lightGrey'] }}>
          Stats
        </Box>
      </Box>
    </Box>
  )
}

export default SPNewReport
