import { h, Component } from 'preact'
import { screenshot, isCameraReady } from '~utils/camera'
import { mimeType } from '~utils/blob'
import { FaceOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'

/* type State = {
  hasBecomeInactive: boolean,
  hasCameraError: boolean,
  snapshotBuffer: Array<{
    blob: Blob,
  }>,
  isCaptureButtonDisabled: boolean,
}

type Props = {
  translate: (string, ?{}) => string,
  onCapture: Function,
  renderFallback: Function,
  trackScreen: Function,
  inactiveError: Object,
  useMultipleSelfieCapture: boolean,
} */

export default class SelfieCapture extends Component {
  webcam = null

  state = {
    hasBecomeInactive: false,
    hasCameraError: false,
    isCaptureButtonDisabled: true,
    snapshot: null,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () =>
    this.setState({ hasCameraError: true, isCaptureButtonDisabled: true })

  handleSelfie = (blob, sdkMetadata) => {
    const selfie = {
      blob,
      sdkMetadata,
      filename: `applicant_selfie.${mimeType(blob)}`,
    }
    const snapshot = this.state.snapshot
    const captureData = snapshot ? { snapshot, ...selfie } : selfie
    this.props.onCapture(captureData)
  }

  handleSnapshot = (blob) => {
    this.setState({
      snapshot: { blob, filename: `applicant_snapshot.${mimeType(blob)}` },
    })
  }

  takeSnapshot = () => {
    screenshot(this.webcam, this.handleSnapshot)
  }

  takeSelfie = () => {
    this.setState({ isCaptureButtonDisabled: true })
    screenshot(this.webcam, this.handleSelfie)
  }

  waitCameraFeed = () => {
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
        webcamRef={(c) => (this.webcam = c)}
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
