import { ActiveVideoCapture, LivenessError } from '@onfido/active-video-capture'
import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { localised } from '~locales'
import type { WithLocalisedProps } from '~types/hocs'
import {
  CombinedActions,
  ActiveVideoCapture as ActiveVideoCapturePayload,
} from '~types/redux'
import type { StepComponentBaseProps } from '~types/routers'
import { addDeviceRelatedProperties } from '~utils'
import { randomId } from '~utils/string'
import FaceNotDetected from './FaceNotDetected'

type Props = StepComponentBaseProps & WithLocalisedProps

const ActiveVideo: FunctionComponent<Props> = (props) => {
  const { nextStep, translate, back, actions, mobileFlow } = props
  const [error, setError] = useState<LivenessError | null>()
  const dispatch = useDispatch<Dispatch<CombinedActions>>()

  const onError = (error: LivenessError) => {
    setError(error)
  }

  const onSuccess = (event: { videoPayload: Blob }) => {
    const activeVideoCaptureData: ActiveVideoCapturePayload = {
      method: 'activeVideo',
      blob: event.videoPayload,
      id: randomId(),
      sdkMetadata: addDeviceRelatedProperties(
        { captureMethod: 'html5' },
        mobileFlow
      ),
    }

    dispatch(actions.createCapture(activeVideoCaptureData))

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
