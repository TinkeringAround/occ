import React, { FC, useContext, Fragment } from 'react'
import { Box, Heading, Text, Image } from 'grommet'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// ==========================================================
const Report: FC = () => {
  const { report } = useContext(reportContext)

  let image = null
  if (report != null) {
    // @ts-ignore
    image = window.electron.fs.readFileSync(report.results[0].images[0].path)
    console.log('Image', image)
  }

  return (
    <Box pad="1rem" style={{ position: 'relative' }}>
      {report != null && (
        <Fragment>
          <Heading level="1" margin="0" color={colors['darkGrey']} size="4rem">
            {report.project}
          </Heading>
          <Text margin={{ left: '0.25rem' }} color={colors['grey']} size="1.5rem">
            {report.url}
          </Text>
          <Box
            width="100%"
            margin="3rem 0 .75rem"
            style={{
              minHeight: `calc(${window.innerHeight}px -  13rem)`,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {/* <Image src={'data:image/jpeg;base64,' + image.toString('base64')} /> */}
            <Box
              width="100%"
              height="200px"
              margin={{ bottom: '1rem' }}
              direction="row"
              justify="between"
              style={{ minHeight: 200 }}
            >
              <Box width="65%" height="100%" background="green" style={{ borderRadius: 15 }}>
                {/* <Image
                  width="90%"
                  height="90%"
                  fit="cover"
                  src={'data:image/jpeg;base64,' + image.toString('base64')}
                  style={{ borderRadius: 15 }}
                /> */}
              </Box>
              <Box width="30%" height="100%" background="red" style={{ borderRadius: 15 }}>
                Right
              </Box>
            </Box>
            <Box
              width="100%"
              height="200px"
              margin={{ bottom: '1rem' }}
              direction="row"
              justify="between"
              style={{ minHeight: 200 }}
            >
              <Box width="30%" height="100%" background="red" style={{ borderRadius: 15 }}>
                Left
              </Box>
              <Box width="65%" height="100%" background="green" style={{ borderRadius: 15 }}>
                Right
              </Box>
            </Box>
            <Box
              width="100%"
              height="200px"
              margin={{ bottom: '1rem' }}
              direction="row"
              justify="between"
              style={{ minHeight: 200 }}
            >
              <Box width="65%" height="100%" background="green" style={{ borderRadius: 15 }}>
                Left
              </Box>
              <Box width="30%" height="100%" background="red" style={{ borderRadius: 15 }}>
                Right
              </Box>
            </Box>
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Report
