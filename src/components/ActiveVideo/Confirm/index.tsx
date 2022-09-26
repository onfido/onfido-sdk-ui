import { h, FunctionComponent } from 'preact'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { useState } from 'preact/hooks'
import RecordingComplete from '../RecordingComplete'
import Uploading from '../Uploading'
import ConnectionError from '../ConnectionError'
import { StepComponentProps } from '~types/routers'
import { localised } from '~locales'

type Props = StepComponentProps & WithLocalisedProps & WithTrackingProps

enum ConfirmationStep {
  RECORDING_COMPLETE,
  UPLOADING,
  UPLOAD_ERROR,
}

const Confirm: FunctionComponent<Props> = (props: Props) => {
  const { previousStep } = props

  const [confirmationStep, setConfirmationStep] = useState<ConfirmationStep>(
    ConfirmationStep.RECORDING_COMPLETE
  )

  switch (confirmationStep) {
    case ConfirmationStep.RECORDING_COMPLETE:
      return (
        <RecordingComplete
          {...props}
          nextStep={() => setConfirmationStep(ConfirmationStep.UPLOADING)}
        />
      )
    case ConfirmationStep.UPLOADING:
      return (
        <Uploading
          {...props}
          triggerOnError={() =>
            setConfirmationStep(ConfirmationStep.UPLOAD_ERROR)
          }
        />
      )
    case ConfirmationStep.UPLOAD_ERROR:
      return (
        <ConnectionError
          {...props}
          retry={() => setConfirmationStep(ConfirmationStep.UPLOADING)}
          restart={() => previousStep()}
        />
      )
    default:
      return <RecordingComplete {...props} />
  }
}

export default localised(Confirm)
