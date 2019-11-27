import React, { FC, Fragment } from 'react'
import { Text, Heading } from 'grommet'

// Types
import { TReport } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Atoms
import SButton from '../../../atoms/sbutton'
import Icon from '../../../atoms/icons'

// ==========================================================
interface Props {
  report?: TReport | null
  deleteReport: (report: TReport) => void
}

// ==========================================================
const TableDetails: FC<Props> = ({ report = null, deleteReport }) => {
  return (
    <Fragment>
      {report != null ? (
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
      ) : (
        <Fragment>
          <Heading level="4" margin="0" color={colors['grey']} size="2rem">
            Guidance
          </Heading>
          <Text size="0.75rem" color={colors['grey']}>
            Click on Report for Details
          </Text>
        </Fragment>
      )}
    </Fragment>
  )
}

export default TableDetails
