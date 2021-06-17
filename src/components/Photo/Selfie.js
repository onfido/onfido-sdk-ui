import { h, Component } from 'preact'
import { screenshot } from '~utils/camera'
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
  snapshotInterval: number,
} */

export default class SelfieCapture extends Component {
  webcam = null
  snapshotIntervalId = null
  initialSnapshotTimeoutId = null

  state = {
    hasBecomeInactive: false,
    hasCameraError: false,
    snapshotBuffer: [],
    isCaptureButtonDisabled: true,
    isProcessingSelfie: false,
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
    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    const snapshot =
      this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]
    const captureData = this.props.useMultipleSelfieCapture
      ? { snapshot, ...selfie }
      : selfie
    this.props.onCapture(captureData)
    this.setState({ isCaptureButtonDisabled: false, isProcessingSelfie: false })
  }

  handleSnapshot = (blob) => {
    // Always try to get the older snapshot to ensure
    // it's different enough from the user initiated selfie
    this.setState(({ snapshotBuffer: [, newestSnapshot] }) => ({
      snapshotBuffer: [
        newestSnapshot,
        { blob, filename: `applicant_snapshot.${mimeType(blob)}` },
      ],
    }))
  }

  takeSnapshot = () => {
    const snapshot =
      this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]

    if (
      snapshot?.blob &&
      this.state.isCaptureButtonDisabled &&
      !this.state.isProcessingSelfie
    ) {
      this.setState({ isCaptureButtonDisabled: false })
    }
    this.webcam && screenshot(this.webcam, this.handleSnapshot)
  }

  takeSelfie = () => {
    this.setState({ isProcessingSelfie: true, isCaptureButtonDisabled: true })
    screenshot(this.webcam, this.handleSelfie)
  }

  onUserMedia = () => {
    if (this.props.useMultipleSelfieCapture) {
      // A timeout is required for this.webcam to load, else 'webcam is null' console error is displayed
      const initialSnapshotTimeout = 0
      this.initialSnapshotTimeoutId = setTimeout(() => {
        this.takeSnapshot()
      }, initialSnapshotTimeout)
      this.snapshotIntervalId = setInterval(
        this.takeSnapshot,
        this.props.snapshotInterval
      )
    } else {
      this.setState({ isCaptureButtonDisabled: false })
    }
  }

  componentWillUnmount() {
    if (this.snapshotIntervalId) {
      clearInterval(this.snapshotIntervalId)
    }
    if (this.initialSnapshotTimeoutId) {
      clearTimeout(this.initialSnapshotTimeoutId)
    }
  }

  render() {
    const { trackScreen, renderFallback, inactiveError } = this.props
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
