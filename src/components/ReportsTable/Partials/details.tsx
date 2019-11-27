import React, { FC, Fragment } from 'react'
import { Text, Heading, Box } from 'grommet'

// Types
import { TReport, TResult } from '../../../types/configuration'

// Styles
import { colors } from '../../../styles'

// Atoms
import SButton from '../../../atoms/sbutton'
import Icon from '../../../atoms/icons'

// ==========================================================
interface Props {
  report?: TReport | null
  deleteReport: (report: TReport) => void
  openReport: (report: TReport) => void
}

// ==========================================================
const TableDetails: FC<Props> = ({ report = null, deleteReport, openReport }) => {
  return (
    <Fragment>
      {report != null ? (
        <Fragment>
          <Box>
            <Heading level="4" margin="0" color={colors['darkGrey']} size="2rem">
              {report.project}
            </Heading>
            <Text size=".75rem" color={colors['grey']}>
              {report.url}
            </Text>

            {report.results.length > 0 && (
              <Box margin="1rem 0">
                <Heading level="5" margin="0" color={colors['darkGrey']} size="1.25rem">
                  Suites
                </Heading>
                {report.results.length > 0 &&
                  report.results.map((result: TResult, index) => (
                    <Fragment key={'Report-Result-' + index}>
                      <Text weight="bold" size="0.65rem" color={colors['grey']}>
                        {result.suite.toLocaleUpperCase()}
                      </Text>
                    </Fragment>
                  ))}
              </Box>
            )}
          </Box>

          <Box>
            <SButton
              background={colors['lightblue']}
              pad="1rem"
              direction="row"
              justify="center"
              align="center"
              style={{ maxWidth: 250 }}
              onClick={() => {
                if (report) openReport(report)
              }}
            >
              <Icon type="open" size="1rem" color="white" margin="0 0.5rem 0 0" />
              <Text size="0.8rem" weight="bold" color="white">
                Open Report
              </Text>
            </SButton>
            <SButton
              background={colors['lightblue']}
              pad="1rem"
              direction="row"
              justify="center"
              align="center"
              margin={{ top: '0.5rem' }}
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
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Box>
            <Heading level="4" margin="0" color={colors['darkGrey']} size="2rem">
              Guidance
            </Heading>
            <Text size="0.75rem" color={colors['grey']}>
              Click on Report for Details
            </Text>
          </Box>
        </Fragment>
      )}
    </Fragment>
  )
}

export default TableDetails
