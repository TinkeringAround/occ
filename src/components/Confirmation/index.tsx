import React, { FC } from 'react'
import { Portal } from 'react-portal'
import { PoseGroup } from 'react-pose'

// Atoms
import { AConfirmation, ABackground } from '../../atoms/animations'
import { Heading, Text, Box } from 'grommet'
import { colors } from '../../styles'
import { SButton } from '../../atoms/styled'

// ==========================================================
interface Props {
  show: boolean
  accept: () => void
  cancel: () => void
}

// ==========================================================
const Confirmation: FC<Props> = ({ show, accept, cancel }) => {
  return (
    <Portal>
      <PoseGroup flipMove={false}>
        {show && (
          <AConfirmation key="Confirmation-Dialog">
            <Box>
              <Heading level="1" size="2.5rem" color={colors['darkGrey']} margin="0 0 .4rem">
                Warning
              </Heading>
              <Text size="0.9rem" color={colors['darkGrey']} margin={{ left: '.4rem' }}>
                Close Window and terminate running Report?
              </Text>
            </Box>
            {/* Buttons */}
            <Box width="100%" direction="row" justify="end">
              <SButton height="50px" margin="0" pad="0 1rem" onClick={accept}>
                <Text size="1rem" weight="bold" color={colors['darkGrey']}>
                  Terminate and Close
                </Text>
              </SButton>
              <SButton
                height="50px"
                margin={{ left: '1.5rem' }}
                pad="0 1rem"
                background={colors['lightblue']}
                onClick={cancel}
              >
                <Text size="1rem" weight="bold" color="white">
                  Cancel
                </Text>
              </SButton>
            </Box>
          </AConfirmation>
        )}

        {show && <ABackground key="Confirmation-Dialog-Background" onClick={cancel} />}
      </PoseGroup>
    </Portal>
  )
}

export default Confirmation
