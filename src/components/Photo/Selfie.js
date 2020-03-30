// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { screenshot } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { sendEvent } from '../../Tracker'
import { FaceOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'

type State = {
  hasBecomeInactive: boolean,
  hasCameraError: boolean,
  snapshotBuffer: Array<{
    blob: Blob
  }>,
  isCapturing: boolean
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
  snapshotIntervalRef: ?IntervalID = null

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    snapshotBuffer: [],
    isCapturing: false
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () => this.setState({ hasCameraError: true })

  handleSelfie = (blob: Blob, sdkMetadata: Object) => {
    const selfie = { blob, sdkMetadata, filename: `applicant_selfie.${mimeType(blob)}` }
    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    const snapshot = this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]
    const captureData = this.props.useMultipleSelfieCapture ?
      { snapshot, ...selfie } : selfie
    this.props.onCapture(captureData)
    this.setState({ isCapturing: false })
  }

  handleSnapshot = (blob: Blob) => {
    // Always try to get the older snapshot to ensure
    // it's different enough from the user initiated selfie
    this.setState(({ snapshotBuffer: [, newestSnapshot] }) => ({
      snapshotBuffer: [newestSnapshot, { blob, filename: `applicant_snapshot.${mimeType(blob)}` }]
    }))
  }

  takeSnapshot = () =>
    this.webcam && screenshot(this.webcam, this.handleSnapshot)

  takeSelfie = () => {
    this.setState({ isCapturing: true })
    screenshot(this.webcam, this.handleSelfie)
  }


  setupSnapshots = () => {
    if (this.props.useMultipleSelfieCapture) {
      sendEvent('Starting Multiple Selfie Capture')
      setTimeout(this.takeSnapshot, this.props.snapshotInterval / 4)
      this.snapshotIntervalRef = setInterval(
        this.takeSnapshot,
        this.props.snapshotInterval
      );
    }
  }

  componentWillUnmount() {
    if (this.snapshotIntervalRef) {
      clearInterval(this.snapshotIntervalRef)
    }
  }

  render() {
    const { trackScreen, renderFallback, inactiveError } = this.props
    const { hasBecomeInactive, hasCameraError, isCapturing } = this.state

    return (
      <Camera
        {...this.props}
        webcamRef={ c => this.webcam = c }
        onUserMedia={ this.setupSnapshots }
        onError={ this.handleCameraError }
        renderError={ hasBecomeInactive ?
          <CameraError
            {...{trackScreen, renderFallback}}
            error={inactiveError}
            isDismissible
          /> : null
        }
        captureButtonType="photo"
        onCaptureClick={this.takeSelfie}
        isCaptureDisabled={hasCameraError || isCapturing}
      >
        { !hasCameraError && <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } /> }
        <ToggleFullScreen />
        <FaceOverlay />
      </Camera>
    )
  }
}
