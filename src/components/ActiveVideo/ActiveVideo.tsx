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
} from '~types/hocs'
import {
  CombinedActions,
  ActiveVideoCapture as ActiveVideoCapturePayload,
} from '~types/redux'
import type { RenderFallbackProp, StepComponentBaseProps } from '~types/routers'
import { addDeviceRelatedProperties } from '~utils'
import { randomId } from '~utils/string'
import withPermissionsFlow from 'components/CameraPermissions/withPermissionsFlow'
import FaceNotDetected from './FaceNotDetected'
import { trackComponent } from 'Tracker'
import CameraError from 'components/CameraError'
import FallbackButton from 'components/Button/FallbackButton'
import withCrossDeviceWhenNoCamera from 'components/Capture/withCrossDeviceWhenNoCamera'
import NavigationBar from 'components/NavigationBar'

type Props = StepComponentBaseProps & {
  onUserMedia: () => void
} & WithLocalisedProps &
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
    onError,
    changeFlowTo,
  } = props
  const [error, setError] = useState<LivenessError | null>()
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

  const track = (event: TrackingEvent): void => {
    trackScreen(event)
  }

  const renderCrossDeviceFallback: RenderFallbackProp = ({ text }) => {
    return (
      <FallbackButton
        text={text}
        onClick={() => changeFlowTo('crossDeviceSteps')}
      />
    )
  }

  if (error === LivenessError.FACE_DETECTION_TIMEOUT) {
    return (
      <FaceNotDetected
        restart={() => setError(null)}
        translate={translate}
        trackScreen={trackScreen}
      />
    )
  } else if (error === LivenessError.CAMERA_NOT_AVAILABLE) {
    return (
      <CameraError
        error={{ name: 'CAMERA_NOT_WORKING', type: 'error' }}
        trackScreen={trackScreen}
        renderFallback={renderCrossDeviceFallback}
      />
    )
  } else if (error) {
    console.error(`Unsupported error: ${error}`)
    onError && onError({ type: 'exception', message: error })
  }

  // See: https://github.com/preactjs/preact/issues/2748
  return (
    <ActiveVideoCapture
      debug={false}
      translate={translate}
      track={track}
      onError={setError}
      onSuccess={onSuccess}
      onUserMedia={onUserMedia}
      hasGrantedPermission={!!hasGrantedPermission}
      navigationBar={<NavigationBar back={back} transparent={true} />}
    />
  )
}

export default trackComponent(
  localised(withCrossDeviceWhenNoCamera(withPermissionsFlow(ActiveVideo))),
  'face_liveness'
)
