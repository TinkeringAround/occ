import React, { FC } from 'react'
import { Portal } from 'react-portal'
import { PoseGroup } from 'react-pose'
import { Text, Box, Heading } from 'grommet'

// Styles
import { colors } from '../../styles'

// Atoms
import { ABackground, AErrorDialog } from '../../atoms/animations'
import { SButton } from '../../atoms/styled'

// ==========================================================
interface Props {
  message: string | null
  close: () => void
}

// ==========================================================
const ErrorDialog: FC<Props> = ({ message, close }) => (
  <Portal>
    <PoseGroup flipMove={false}>
      {message != null && (
        <AErrorDialog key="ErrorDialog">
          <Box>
            <Heading level="1" size="1.5rem" color={colors['darkGrey']} margin="0">
              Warning
            </Heading>
            <Text
              size="0.9rem"
              color={colors['darkGrey']}
              margin={{ left: '.1rem' }}
              wordBreak="break-all"
              style={{ maxHeight: 'calc(130px - 3.5rem)', overflow: 'hidden auto' }}
            >
              {message}
            </Text>
          </Box>
          {/* Buttons */}
          <Box width="100%" direction="row" justify="end" margin={{ top: '5px' }}>
            <SButton height="40px" pad="0 1rem" background={colors['red']} onClick={close}>
              <Text size="1rem" weight="bold" color="white">
                Dismiss
              </Text>
            </SButton>
          </Box>
        </AErrorDialog>
      )}

      {message != null && <ABackground key="ErrorDialog-Background" onClick={close} />}
    </PoseGroup>
  </Portal>
)

export default ErrorDialog
