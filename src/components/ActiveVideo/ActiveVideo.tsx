import {
  ActiveVideoCapture,
  LivenessError,
  TrackingEvent,
} from '@onfido/active-video-capture'
import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { localised } from '~locales'
import type {
  WithLocalisedProps,
  WithPermissionsFlowProps,
  WithTrackingProps,
  WithFailureHandlingProps,
} from '~types/hocs'
import {
  CombinedActions,
  ActiveVideoCapture as ActiveVideoCapturePayload,
} from '~types/redux'
import type { StepComponentBaseProps } from '~types/routers'
import { CameraProps } from '~types/camera'
import { WebcamProps } from '~webcam/react-webcam'
import { addDeviceRelatedProperties } from '~utils'
import { randomId } from '~utils/string'
import withPermissionsFlow from 'components/CameraPermissions/withPermissionsFlow'
import withFailureHandling from 'components/Camera/withFailureHandling'
import FaceNotDetected from './FaceNotDetected'
import withCrossDeviceWhenNoCamera from 'components/Capture/withCrossDeviceWhenNoCamera'
import NavigationBar from 'components/NavigationBar'

type Props = StepComponentBaseProps & {
  onUserMedia: () => void
} & CameraProps &
  WebcamProps &
  WithLocalisedProps &
  WithFailureHandlingProps &
  WithPermissionsFlowProps &
  WithTrackingProps

const ActiveVideo: FunctionComponent<Props> = (props) => {
  const {
    nextStep,
    back,
    translate,
    trackScreen,
    actions,
    mobileFlow,
    hasGrantedPermission,
    onUserMedia,
    onFailure,
  } = props
  const [error, setError] = useState<LivenessError | Error | null>()
  const dispatch = useDispatch<Dispatch<CombinedActions>>()

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

  const onError = (error: LivenessError | Error) => {
    if (error instanceof Error && onFailure) {
      // Under the hood, Motion depends on `react-webcam 7+` which emits DOMException
      // errors. They'll bubble up to `withFailureHandling` or `withPermissionFlow` to
      // show the appropriate error screen.
      onFailure(error)
    } else {
      // Other errors are business-logic errors, like `FACE_DETECTION_TIMEOUT`. In
      // such case, a specific error screen is displayed in place of the capture
      // component.
      setError(error)
    }
  }

  const track = (event: TrackingEvent): void => {
    trackScreen(event)
  }

  if (error === LivenessError.FACE_DETECTION_TIMEOUT) {
    return (
      <FaceNotDetected
        restart={() => setError(null)}
        translate={translate}
        trackScreen={trackScreen}
      />
    )
  } else if (error) {
    console.error(`Unsupported error: ${error}`)
  }

  // See: https://github.com/preactjs/preact/issues/2748
  return (
    <ActiveVideoCapture
      debug={false}
      translate={translate}
      track={track}
      onError={onError}
      onSuccess={onSuccess}
      onUserMedia={onUserMedia}
      hasGrantedPermission={!!hasGrantedPermission}
      navigationBar={<NavigationBar back={back} transparent={true} />}
    />
  )
}

export default localised(
  withCrossDeviceWhenNoCamera(
    withFailureHandling(withPermissionsFlow(ActiveVideo))
  )
)
