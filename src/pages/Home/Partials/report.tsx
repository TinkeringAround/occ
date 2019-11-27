import React, { FC, useState, useContext } from 'react'
import { Box, TextInput, Keyboard, Form, Text, CheckBox } from 'grommet'

// Types
import { TReport, TSuites } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import SButton from '../../../atoms/sbutton'
import Icon from '../../../atoms/icons'

// Utility
import { createReportInMain } from '../../../utility/fs'

// Consts
const availableSuites: Array<TSuites> = ['securityheaders']

// ==========================================================
interface Props {
  toggleModus: (modus: 'normal') => void
}

// ==========================================================
const Report: FC<Props> = ({ toggleModus }) => {
  const { addReport } = useContext(reportContext)
  const [project, setProject] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [suites, setSuites] = useState<Array<boolean>>([false])

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
    <Box width="100%" pad="0 2rem" direction="row" justify="between">
      {/* Formular */}
      <Box width="35%" height="100%">
        <Keyboard
          onEnter={() => {
            // TODO
          }}
        >
          <Form>
            <TextInput
              placeholder="Project"
              plain
              value={project}
              onChange={(event: any) => setProject(event.target.value)}
              style={{
                marginBottom: '1rem',
                borderRadius: 15,
                padding: '1rem',
                background: 'white'
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
                background: 'white'
              }}
            />

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

      {/* Suites Checkboxes */}
      <Box width="60%" height="100%" background="white" style={{ borderRadius: 15 }}>
        {availableSuites.map((suite: TSuites, index: number) => (
          <CheckBox
            key={'NewReport-Suite-' + index}
            label={suite.toUpperCase()}
            checked={suites[index]}
            onChange={() => {
              let newSuites = Array.from(suites)
              newSuites[index] = !newSuites[index]
              setSuites(newSuites)
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Report
