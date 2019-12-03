import React, { FC, useState, useContext } from 'react'
import { Box, TextInput, Keyboard, Form, Text } from 'grommet'

// Types
import { TReport, TSuites } from '../../../types'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import { SButton } from '../../../atoms/styled'
import Icon from '../../../atoms/icons'

// Utility
import {
  ServerSuites,
  SeoSuites,
  PerformanceSuites,
  OptimizationSuites
} from '../../../utility/suites'
import ReportSuite from './suite'

// ==========================================================
interface Props {
  toggleModus: (modus: 'normal') => void
}

// ==========================================================
const Report: FC<Props> = ({ toggleModus }) => {
  const { addReport } = useContext(reportContext)
  const [project, setProject] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  const [serverSuites, setServerSuites] = useState<Array<boolean>>([false, false, false])
  const [seoSuites, setSeoSuites] = useState<Array<boolean>>([false, false, false])
  const [performanceSuites, setPerformanceSuites] = useState<Array<boolean>>([false, false, false])
  const [optimizationSuites, setOptimizationSuites] = useState<Array<boolean>>([
    false,
    false,
    false
  ])

  // ==========================================================
  const allTrue: (array: Array<boolean>) => boolean = (array: Array<boolean>) => {
    var allTrue = true
    array.forEach(element => {
      if (!element) allTrue = false
    })
    return allTrue
  }

  const checkInputAndCreateReport = () => {
    const newReport: TReport = {
      progress: 0,
      project: project,
      url: url,
      date: Date.now().toString(),
      results: []
    }

    const suites: Array<TSuites> = []
    serverSuites.forEach((suite: boolean, index: number) => {
      if (suite) suites.push(ServerSuites.suites[index])
    })
    seoSuites.forEach((suite: boolean, index: number) => {
      if (suite) suites.push(SeoSuites.suites[index])
    })
    performanceSuites.forEach((suite: boolean, index: number) => {
      if (suite) suites.push(PerformanceSuites.suites[index])
    })
    optimizationSuites.forEach((suite: boolean, index: number) => {
      if (suite) suites.push(OptimizationSuites.suites[index])
    })

    // Reset
    setProject('')
    setUrl('')
    toggleModus('normal')
    addReport(newReport, suites)
    resetSuites()
  }

  const resetSuites: () => void = () => {
    setServerSuites([false, false])
    setSeoSuites([false, false])
    setPerformanceSuites([false, false])
    setOptimizationSuites([false, false])
  }

  // ==========================================================
  const toggleServer = () => {
    const allAreTrue = allTrue(serverSuites)
    let newServerSuites = Array.from(serverSuites)
    for (let index = 0; index < newServerSuites.length; index++) {
      newServerSuites[index] = !allAreTrue
    }
    setServerSuites(newServerSuites)
  }
  const toggleSeo = () => {
    const allAreTrue = allTrue(seoSuites)
    let newSeoSuites = Array.from(seoSuites)
    for (let index = 0; index < newSeoSuites.length; index++) {
      newSeoSuites[index] = !allAreTrue
    }
    setSeoSuites(newSeoSuites)
  }
  const togglePerformance = () => {
    const allAreTrue = allTrue(performanceSuites)
    let newPerformanceSuites = Array.from(performanceSuites)
    for (let index = 0; index < newPerformanceSuites.length; index++) {
      newPerformanceSuites[index] = !allAreTrue
    }
    setPerformanceSuites(newPerformanceSuites)
  }
  const toggleOptimization = () => {
    const allAreTrue = allTrue(optimizationSuites)
    let newOptimizationSuites = Array.from(optimizationSuites)
    for (let index = 0; index < newOptimizationSuites.length; index++) {
      newOptimizationSuites[index] = !allAreTrue
    }
    setOptimizationSuites(newOptimizationSuites)
  }

  return (
    <Box width="100%" pad="0 2rem" direction="row" justify="between">
      {/* Formular */}
      <Box width="35%" height="100%">
        <Keyboard onEnter={checkInputAndCreateReport}>
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
      <Box width="60%" direction="row" justify="between" wrap>
        {/* Server Suites */}
        <ReportSuite
          type="server"
          allSelected={allTrue(serverSuites)}
          toggle={toggleServer}
          selections={serverSuites}
          select={(index: number) => {
            let newServerSuites = Array.from(serverSuites)
            newServerSuites[index] = !newServerSuites[index]
            setServerSuites(newServerSuites)
          }}
        />

        {/* Performance Suites */}
        <ReportSuite
          type="tacho"
          allSelected={allTrue(performanceSuites)}
          toggle={togglePerformance}
          selections={performanceSuites}
          select={(index: number) => {
            let newPerformanceSuites = Array.from(performanceSuites)
            newPerformanceSuites[index] = !newPerformanceSuites[index]
            setPerformanceSuites(newPerformanceSuites)
          }}
        />

        {/* Seo Suites */}
        <ReportSuite
          type="accessibility"
          allSelected={allTrue(seoSuites)}
          toggle={toggleSeo}
          selections={seoSuites}
          select={(index: number) => {
            let newSeoSuites = Array.from(seoSuites)
            newSeoSuites[index] = !newSeoSuites[index]
            setSeoSuites(newSeoSuites)
          }}
        />

        {/* Optimization Suites */}
        <ReportSuite
          type="zip"
          allSelected={allTrue(optimizationSuites)}
          toggle={toggleOptimization}
          selections={optimizationSuites}
          select={(index: number) => {
            let newOptimizationSuites = Array.from(optimizationSuites)
            newOptimizationSuites[index] = !newOptimizationSuites[index]
            setOptimizationSuites(newOptimizationSuites)
          }}
        />
      </Box>
    </Box>
  )
}

export default Report
