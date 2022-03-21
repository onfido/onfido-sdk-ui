import { h, Component } from 'preact'
import { screenshot, isCameraReady } from '~utils/camera'
import { mimeType } from '~utils/blob'
import { FaceOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import { SdkMetadata } from '~types/commons'
import Webcam from 'react-webcam-onfido'
import {
  WithLocalisedProps,
  WithPageIdProps,
  WithTrackingProps,
} from '~types/hocs'
import { ErrorProp, RenderFallbackProp } from '~types/routers'
import { CapturePayload } from '~types/redux'

type State = {
  hasBecomeInactive: boolean
  hasCameraError: boolean
  isCaptureButtonDisabled: boolean
  snapshot?: { blob: Blob; filename: string }
}

type Props = {
  onCapture: (payload: CapturePayload) => void
  renderFallback: RenderFallbackProp
  inactiveError: ErrorProp
  useMultipleSelfieCapture: boolean
} & WithTrackingProps &
  WithLocalisedProps &
  WithPageIdProps

export default class SelfieCapture extends Component<Props, State> {
  webcam?: Webcam

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    isCaptureButtonDisabled: true,
    snapshot: undefined,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () =>
    this.setState({ hasCameraError: true, isCaptureButtonDisabled: true })

  handleSelfie = (blob: Blob, sdkMetadata: SdkMetadata) => {
    const selfie = {
      blob,
      sdkMetadata,
      filename: `applicant_selfie.${mimeType(blob)}`,
    }
    const snapshot = this.state.snapshot
    const captureData = snapshot ? { snapshot, ...selfie } : selfie
    this.props.onCapture(captureData)
  }

  handleSnapshot = (blob: Blob) => {
    this.setState({
      snapshot: { blob, filename: `applicant_snapshot.${mimeType(blob)}` },
    })
  }

  takeSnapshot = () => {
    if (!this.webcam) {
      return
    }

    screenshot(this.webcam, this.handleSnapshot)
  }

  takeSelfie = () => {
    if (!this.webcam) {
      return
    }

    this.setState({ isCaptureButtonDisabled: true })
    screenshot(this.webcam, this.handleSelfie)
  }

  waitCameraFeed = () => {
    if (!this.webcam) {
      return
    }

    if (isCameraReady(this.webcam)) {
      if (this.props.useMultipleSelfieCapture) {
        this.takeSnapshot()
      }
      this.setState({ isCaptureButtonDisabled: false })
    } else {
      setTimeout(() => {
        this.waitCameraFeed()
      }, 50)
    }
  }

  onUserMedia = () => {
    this.waitCameraFeed()
  }

  render() {
    const { trackScreen, renderFallback, inactiveError, pageId } = this.props
    const {
      hasBecomeInactive,
      hasCameraError,
      isCaptureButtonDisabled, // Capture Button is disabled until camera access is allowed + userMedia stream is ready
    } = this.state

    return (
      <Camera
        {...this.props}
        webcamRef={(ref) => ref && (this.webcam = ref)}
        onUserMedia={this.onUserMedia}
        onError={this.handleCameraError}
        renderError={
          hasBecomeInactive ? (
            <CameraError
              {...{ trackScreen, renderFallback }}
              error={inactiveError}
              isDismissible
            />
          ) : null
        }
        buttonType="photo"
        onButtonClick={this.takeSelfie}
        isButtonDisabled={isCaptureButtonDisabled}
        pageId={pageId}
      >
        {!isCaptureButtonDisabled && !hasCameraError && (
          <Timeout seconds={10} onTimeout={this.handleTimeout} />
        )}
        <ToggleFullScreen />
        <FaceOverlay />
      </Camera>
    )
  }
}
