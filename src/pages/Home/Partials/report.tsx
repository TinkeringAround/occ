import React, { FC, useState, useContext } from 'react'
import { Box, TextInput, Keyboard, Form, Text } from 'grommet'

// Types
import { TReport } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import SButton from '../../../atoms/sbutton'
import Icon from '../../../atoms/icons'

// Utility
import { createReportInMain } from '../../../utility/fs'

// ==========================================================
interface Props {
  toggleModus: (modus: 'normal') => void
}

// ==========================================================
const Report: FC<Props> = ({ toggleModus }) => {
  const { addReport } = useContext(reportContext)
  const [project, setProject] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  const checkInputAndCreateReport = () => {
    const newReport: TReport = {
      project: project,
      url: url,
      date: Date.now().toString(),
      results: []
    }
    setProject('')
    setUrl('')
    toggleModus('normal')
    addReport(newReport)
    createReportInMain(newReport, ['securityheaders'])
  }

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
              direction="row"
              justify="center"
              align="center"
              margin={{ top: '1rem' }}
              style={{ maxWidth: 250 }}
              onClick={checkInputAndCreateReport}
            >
              <Icon type="create" size="1.25rem" color="white" margin="0 0.5rem 0 0" />
              <Text size="1rem" weight="bold" color="white">
                Create Report
              </Text>
            </SButton>
          </Form>
        </Keyboard>
      </Box>
    </Box>
  )
}

export default Report
