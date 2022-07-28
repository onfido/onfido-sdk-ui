import { ActiveVideoCapture, LivenessError } from '@onfido/active-video-capture'
import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { localised } from '~locales'
import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'

type Props = StepComponentBaseProps & WithLocalisedProps

const ActiveVideo: FunctionComponent<Props> = (props) => {
  const { nextStep } = props
  const [videoPayload, setVideoPayload] = useState<Blob | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  // FIXME: Move to src/locales/en_US/en_US.json
  const localisedText = {
    avc_face_alignment: {
      feedback_move_back: 'Move back',
      feedback_move_closer: 'Move closer',
      feedback_no_face_detected: 'Face not detected',
      feedback_not_centered: 'Face not centered',
      title: 'Position your face in the frame',
    },
    avc_face_capture: {
      alert: {
        timeout_body: 'You have up to 15 seconds to complete the recording',
        timeout_button_primary: 'Retry',
        timeout_title: 'Sorry, we have to restart the recording',
        too_fast_body: 'Please retry and turn your head slower',
        too_fast_button_primary: 'Retry',
        too_fast_title: 'You turned your head too fast',
      },
      title: 'Turn your head slowly to both sides',
      title_completed: 'Recording complete',
    },
  }

  // See: https://github.com/preactjs/preact/issues/2748
  return (
    <ActiveVideoCapture
      debug={true}
      options={{
        language: localisedText,
      }}
      onError={(event: LivenessError) => console.error(event)}
      onSuccess={({ videoPayload }) => {
        if (!success) {
          setVideoPayload(videoPayload)
          setSuccess(true)
        }

        nextStep()
      }}
    />
  )
}

export default localised(ActiveVideo)
