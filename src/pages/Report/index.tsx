import React, { FC, useContext, Fragment } from 'react'
import { Box, Heading, Text, Image } from 'grommet'

// Styles
import { colors } from '../../styles'

// Context
import reportContext from '../../context/report-context'

// ==========================================================
const Report: FC = () => {
  const { report } = useContext(reportContext)

  // @ts-ignore
  const image = window.electron.fs.readFileSync(report.results[0].images[0].path)
  console.log('Image', image)

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
          <Box>{/* <Image src={'data:image/jpeg;base64,' + image.toString('base64')} /> */}</Box>
        </Fragment>
      )}
    </Box>
  )
}

export default Report
