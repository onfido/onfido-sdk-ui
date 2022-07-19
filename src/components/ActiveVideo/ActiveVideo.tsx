import { ActiveVideoCapture, LivenessError } from '@onfido/active-video-capture'
import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { localised } from '~locales'
import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'
import FaceNotDetected from './FaceNotDetected'

type Props = StepComponentBaseProps & WithLocalisedProps

const ActiveVideo: FunctionComponent<Props> = (props) => {
  const { nextStep, translate, back } = props
  const [error, setError] = useState<LivenessError | null>()

  const onError = (error: LivenessError) => {
    setError(error)
  }

  const onSuccess = (event: { videoPayload: Blob }) => {
    console.log(event.videoPayload)
    nextStep()
  }

  if (error === LivenessError.FACE_DETECTION_TIMEOUT) {
    return (
      <FaceNotDetected
        restart={() => {
          setError(null)
          back()
        }}
        translate={translate}
      />
    )
  } else if (error) {
    console.error(`Unsupported error: ${error}`)
  }

  // See: https://github.com/preactjs/preact/issues/2748
  return (
    <ActiveVideoCapture
      debug={true}
      translate={translate}
      onError={onError}
      onSuccess={onSuccess}
    />
  )
}

export default localised(ActiveVideo)
