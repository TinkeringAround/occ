import React, { FC, useState } from 'react'
import { Box, TextInput, Keyboard, Form, Text } from 'grommet'

// Styles
import { colors } from '../../../styles'

// Atoms
import SButton from '../../../atoms/sbutton'

// ==========================================================
interface Props {}

// ==========================================================
const Report: FC<Props> = () => {
  const [project, setProject] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  return (
    <Box width="100%" pad="0 2rem">
      {/* Formular */}
      <Box width="100%" height="100%">
        <Keyboard
          onEnter={() => {
            // TODO
          }}
        >
          <Form>
            <Box width="35%">
              {/* Inputs */}
              <TextInput
                placeholder="Project"
                plain
                value={project}
                onChange={(event: any) => setProject(event.target.value)}
                style={{
                  marginBottom: '1rem',
                  borderRadius: 15,
                  padding: '1rem',
                  background: colors['lightGrey']
                }}
              />
              <TextInput
                placeholder="URL"
                plain
                value={url}
                onChange={(event: any) => setUrl(event.target.value)}
                style={{
                  marginBottom: '1rem',
                  borderRadius: 15,
                  padding: '1rem',
                  background: colors['lightGrey']
                }}
              />
              {/* Suites Checkboxes */}
            </Box>
            {/* Button */}
            <SButton
              background={colors['lightblue']}
              pad="1rem"
              justify="center"
              align="center"
              margin={{ top: '1rem' }}
              style={{ maxWidth: 250 }}
            >
              <Text size="1rem" weight="bold" color="white">
                Create Report
              </Text>
            </SButton>
            {/* TODO: Suites */}
          </Form>
        </Keyboard>
      </Box>
    </Box>
  )
}

export default Report
