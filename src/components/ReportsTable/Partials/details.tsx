import React, { FC, useContext, Fragment } from 'react'
import { Text, Heading, Box } from 'grommet'

// Types
import { TReport } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Context
import reportContext from '../../../context/report-context'

// Atoms
import SButton from '../../../atoms/sbutton'
import Icon from '../../../atoms/icons'

// ==========================================================
interface Props {
  report?: TReport | null
}

// ==========================================================
const TableDetails: FC<Props> = ({ report = null }) => {
  const { deleteReport } = useContext(reportContext)

  return (
    <Box
      width="90%"
      height="90%"
      pad="1rem"
      background="white"
      style={{ borderRadius: 15, boxShadow: '0px 0px 20px 1px rgba(200, 214, 216, 0.25)' }}
    >
      {report != null && (
        <Fragment>
          <Heading level="4" margin="0" color={colors['grey']} size="2rem">
            {report.project}
          </Heading>
          <Text size=".75rem" color={colors['grey']}>
            {report.url}
          </Text>
          <SButton
            background={colors['lightblue']}
            pad="1rem"
            direction="row"
            justify="center"
            align="center"
            margin={{ top: '1rem' }}
            style={{ maxWidth: 250 }}
            onClick={() => {
              if (report) deleteReport(report)
            }}
          >
            <Icon type="trash" size="1rem" color="white" margin="0 0.5rem 0 0" />
            <Text size="0.8rem" weight="bold" color="white">
              Delete Report
            </Text>
          </SButton>
        </Fragment>
      )}
    </Box>
  )
}

export default TableDetails
