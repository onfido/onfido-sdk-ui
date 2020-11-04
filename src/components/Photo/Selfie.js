// @flow
import { h, Component } from 'preact'
import { screenshot, getScreenshotBinaryForVideo } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { FaceOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'

type State = {
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
}

export default class SelfieCapture extends Component<Props, State> {
  webcam = null
  snapshotIntervalId: ?IntervalID = null
  initialSnapshotTimeoutId: ?TimeoutID = null
  recorder = null

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    snapshotBuffer: [],
    isCaptureButtonDisabled: true,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () =>
    this.setState({ hasCameraError: true, isCaptureButtonDisabled: true })

  handleSelfie = async (blob: Blob, sdkMetadata: Object) => {
    const selfie = {
      blob,
      sdkMetadata,
      filename: `applicant_selfie.${mimeType(blob)}`,
    }

    // if this.props.useSnapshotsVideo is true at this point  this.state.snapshotBuffer will include an array of snapshots
    // the snapshots are taken before you click on the shutter button

    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    const snapshot =
      this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]
    const captureData = this.props.useMultipleSelfieCapture
      ? { snapshot, ...selfie }
      : selfie

    this.props.onCapture(captureData)
    this.setState({ isCaptureButtonDisabled: false })
  }

  handleSnapshotForVideo = (binaryArray: BinaryType) => {
    binaryArray &&
      binaryArray.length >= 1 &&
      this.setState((prevState) => ({
        snapshotBuffer: [
          ...prevState.snapshotBuffer,
          {
            name: `applicant_snapshot_${
              //refactor this to make sure the counting is correct
              prevState.snapshotBuffer.length + 1
            }.jpeg`,
            data: binaryArray,
          },
        ],
      }))
  }

  handleSnapshot = (blob: Blob) => {
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
    if (this.props.useSnapshotsVideo) {
      return (
        this.webcam &&
        getScreenshotBinaryForVideo(this.webcam, this.handleSnapshotForVideo)
      )
    }
    this.webcam && screenshot(this.webcam, this.handleSnapshot, 'image/jpeg')
  }

  takeSelfie = () => {
    this.setState({ isCaptureButtonDisabled: true })
    screenshot(this.webcam, this.handleSelfie)
  }

  sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

  initAudioRecording = async () => {
    // implement audio recording
    // this library works https://github.com/danielstorey/WebAudioTrack
    // the code below does not work on Safari
    // return new Promise((resolve) => {
    //   const recordedBlobs = []
    //   const recorder = new window.MediaRecorder(this.webcam.stream)
    //   recorder.ondataavailable = (e) => recordedBlobs.push(e.data)
    //   const start = () => recorder.start()
    //   const stop = () =>
    //     new Promise((resolve) => {
    //       recorder.addEventListener('stop', () => {
    //         const audioBlob = new File(recordedBlobs, {
    //           name: 'audio.wav',
    //           type: ' audio/wav',
    //         })
    //         const audioUrl = URL.createObjectURL(audioBlob)
    //         resolve(audioUrl)
    //       })
    //       recorder.stop()
    //     })
    //   resolve({ start, stop })
    // })
  }

  onUserMedia = async () => {
    if (this.props.useMultipleSelfieCapture) {
      // A timeout is required for this.webcam to load, else 'webcam is null' console error is displayed
      // despite an actual camera stream snapshot being captured
      // 750ms is the minimum possible timeout without resulting in a null blob being sent to
      // the /snapshots endpoint in file payload on some browsers, e.g. macOS Firefox & Safari
      const initialSnapshotTimeout = 750
      this.initialSnapshotTimeoutId = setTimeout(() => {
        this.takeSnapshot()
        this.setState({ isCaptureButtonDisabled: false })
      }, initialSnapshotTimeout)
      this.snapshotIntervalId = setInterval(
        this.takeSnapshot,
        this.props.snapshotInterval
      )
      if (this.props.useSnapshotsVideo) {
        // initialize audio recording
        // this.recorder = await this.initAudioRecording()
        // this.recorder.start()
      }
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
        shouldUseAudio={!!this.props.useSnapshotsVideo}
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
