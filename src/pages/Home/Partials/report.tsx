import React, { FC, useState, useContext } from 'react'
import { Box, TextInput, Keyboard, Form, Text, Heading } from 'grommet'

// Types
import { TReport, TSuites } from '../../../types'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import { SButton } from '../../../atoms/styled'
import Icon from '../../../atoms/icons'
import Checkbox from '../../../atoms/checkbox'

// Utility
import {
  ServerSuites,
  SeoSuites,
  PerformanceSuites,
  OptimizationSuites,
  getSuiteName
} from '../../../utility/suites'

// ==========================================================
interface Props {
  toggleModus: (modus: 'normal') => void
}

// ==========================================================
const Report: FC<Props> = ({ toggleModus }) => {
  const { addReport } = useContext(reportContext)
  const [project, setProject] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  const [serverSuites, setServerSuites] = useState<Array<boolean>>([false, false])
  const [seoSuites, setSeoSuites] = useState<Array<boolean>>([false, false])
  const [performanceSuites, setPerformanceSuites] = useState<Array<boolean>>([false, false])
  const [optimizationSuites, setOptimizationSuites] = useState<Array<boolean>>([false, false])

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
      <Box
        width="60%"
        direction="row"
        justify="between"
        background="white"
        pad="1rem"
        style={{ borderRadius: 15 }}
      >
        <Box justify="between" pad="1rem">
          {/* Server Suites */}
          <Box margin="0 0 2.5rem">
            <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
              <Icon
                type="server"
                color={allTrue(serverSuites) ? 'lightblue' : 'darkGrey'}
                size="2rem"
                onClick={toggleServer}
              />
              <Heading
                level="6"
                size="1.5rem"
                margin="0 0 0 0.5rem"
                truncate
                color={allTrue(serverSuites) ? colors['lightblue'] : colors['darkGrey']}
                onClick={toggleServer}
                style={{ cursor: 'pointer' }}
              >
                {ServerSuites.name}
              </Heading>
            </Box>
            {ServerSuites.suites.map((suite: TSuites, index: number) => (
              <Checkbox
                key={'NewReport-ServerSuites-' + index}
                label={getSuiteName(suite)}
                checked={serverSuites[index]}
                onChange={() => {
                  let newServerSuites = Array.from(serverSuites)
                  newServerSuites[index] = !newServerSuites[index]
                  setServerSuites(newServerSuites)
                }}
              />
            ))}
          </Box>

          {/* Seo Suites */}
          <Box>
            <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
              <Icon
                type="accessibility"
                color={allTrue(seoSuites) ? 'lightblue' : 'darkGrey'}
                size="2rem"
                onClick={toggleSeo}
              />
              <Heading
                level="6"
                size="1.5rem"
                margin="0 0 0 0.5rem"
                truncate
                color={allTrue(seoSuites) ? colors['lightblue'] : colors['darkGrey']}
                onClick={toggleSeo}
                style={{ cursor: 'pointer' }}
              >
                {SeoSuites.name}
              </Heading>
            </Box>
            {SeoSuites.suites.map((suite: TSuites, index: number) => (
              <Checkbox
                key={'NewReport-SeoSuites-' + index}
                label={getSuiteName(suite)}
                checked={seoSuites[index]}
                onChange={() => {
                  let newSeoSuites = Array.from(seoSuites)
                  newSeoSuites[index] = !newSeoSuites[index]
                  setSeoSuites(newSeoSuites)
                }}
              />
            ))}
          </Box>
        </Box>

        <Box justify="between" pad="1rem">
          {/* Performance Suites */}
          <Box margin="0 0 1.5rem">
            <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
              <Icon
                type="tacho"
                color={allTrue(performanceSuites) ? 'lightblue' : 'darkGrey'}
                size="2rem"
                onClick={togglePerformance}
              />
              <Heading
                level="6"
                size="1.5rem"
                margin="0 0 0 0.5rem"
                truncate
                color={allTrue(performanceSuites) ? colors['lightblue'] : colors['darkGrey']}
                onClick={togglePerformance}
                style={{ cursor: 'pointer' }}
              >
                {PerformanceSuites.name}
              </Heading>
            </Box>
            {PerformanceSuites.suites.map((suite: TSuites, index: number) => (
              <Checkbox
                key={'NewReport-PerfomraneSuites-' + index}
                label={getSuiteName(suite)}
                checked={performanceSuites[index]}
                onChange={() => {
                  let newPerformanceSuites = Array.from(performanceSuites)
                  newPerformanceSuites[index] = !newPerformanceSuites[index]
                  setPerformanceSuites(newPerformanceSuites)
                }}
              />
            ))}
          </Box>

          {/* Optimization Suites */}
          <Box>
            <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
              <Icon
                type="zip"
                color={allTrue(optimizationSuites) ? 'lightblue' : 'darkGrey'}
                size="2rem"
                onClick={toggleOptimization}
              />
              <Heading
                level="6"
                size="1.5rem"
                margin="0 0 0 0.5rem"
                truncate
                color={allTrue(optimizationSuites) ? colors['lightblue'] : colors['darkGrey']}
                onClick={toggleOptimization}
                style={{ cursor: 'pointer' }}
              >
                {OptimizationSuites.name}
              </Heading>
            </Box>
            {OptimizationSuites.suites.map((suite: TSuites, index: number) => (
              <Checkbox
                key={'NewReport-OptimizationSuites-' + index}
                label={getSuiteName(suite)}
                checked={optimizationSuites[index]}
                onChange={() => {
                  let newOptimizationSuites = Array.from(optimizationSuites)
                  newOptimizationSuites[index] = !newOptimizationSuites[index]
                  setOptimizationSuites(newOptimizationSuites)
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Report
