// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { screenshot } from '../utils/camera.js'
import { FaceOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import style from './style.css'

type State = {
  hasBecomeInactive: boolean,
  snapshotBuffer: Array<{
    blob: Blob,
    base64: string
  }>,
}

type Props = {
  onCapture: Function,
  renderFallback: Function,
  trackScreen: Function,
  inactiveError: Object,
  useMultipleSelfieCapture: boolean,
  snapshotInterval: number,
}

export default class Selfie extends Component<Props, State> {
  webcam = null
  snapshotIntervalRef: ?IntervalID = null

  state: State = {
    hasBecomeInactive: false,
    snapshotBuffer: [],
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  buildCapture = (blob: Blob, base64: string, sdkMetadata: Object, name: string) => ({
    blob: new File([blob], `${name}.png`, {
      type: "image/png"
    }),
    base64,
    sdkMetadata
  })

  snapshotData = () => ({
    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    snapshot: this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1],
  })

  handleSelfie = (blob: Blob, base64: string, sdkMetadata: Object) => {
    const selfieCaptureData = this.buildCapture(blob, base64, sdkMetadata, 'applicant_selfie')
    const snapshotData = this.snapshotData()
    const captureData = this.props.useMultipleSelfieCapture ?
      { ...snapshotData, ...selfieCaptureData } : selfieCaptureData
    this.props.onCapture(captureData)
  }

  handleSnapshot = (blob: Blob, base64: string, sdkMetadata: Object) => {
    /* When taking snapshots we want to ensure that the snapshot we provide is, where possible,
      older than the interval. As we take a snapshot every interval, that means we need to
      store the previous snapshot so that we can use that if the capture is taken too soon
      after the latest snapshot (e.g. 500ms after the last snapshot on a 1000ms interval).

      Therefore we use a simple two item collection as our buffer:

      ['ready snapshot', 'fresh snapshot']

      The first item is the older of the two snapshots, and will be used when capturing the selfie.
      The second item is the 'fresh' slot which will not be suitable until the next interval tick at which
      point it is moved to the 'ready' slot. If there are no items in the buffer, then
      the new snapshot will be placed in both positions in the buffer, so that we always provide a
      snapshot (even if that could sometimes be a suboptimal time delta) */
    // const captureData = { blob, base64, sdkMetadata }
    this.setState(({ snapshotBuffer: [, newestSnapshot] }) => ({
      snapshotBuffer: [newestSnapshot, this.buildCapture(blob, base64, sdkMetadata, 'applicant_snapshot')]
    }))
  }

  takeSnapshot = () => {
    screenshot(this.webcam, this.handleSnapshot)
  }

  takeSelfie = () => {
    screenshot(this.webcam, this.handleSelfie)
  }

  setupSnapshots = () => {
    // wait before attempting the first snapshot as the stream might not be available
    setTimeout(this.takeSnapshot, this.props.snapshotInterval / 4)
    this.snapshotIntervalRef = setInterval(
      this.takeSnapshot,
      this.props.snapshotInterval
    );
  }

  componentWillUnmount() {
    if (this.snapshotIntervalRef) {
      clearInterval(this.snapshotIntervalRef)
    }
  }

  render() {
    const { trackScreen, renderFallback, inactiveError} = this.props
    const { hasBecomeInactive } = this.state

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          onUserMedia={ this.setupSnapshots }
          renderError={ hasBecomeInactive ?
            <CameraError
              {...{trackScreen, renderFallback}}
              error={inactiveError}
              isDismissible
            /> : null
          }
        >
          <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } />
          <ToggleFullScreen />
          <FaceOverlay />
          <div className={style.actions}>
            <button
              className={style.btn}
              onClick={this.takeSelfie}
            />
          </div>
        </Camera>
      </div>
    )
  }
}
