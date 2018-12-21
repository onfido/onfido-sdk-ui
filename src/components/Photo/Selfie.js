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
  useMultipleSelfieCapture: boolean,
  snapshotInterval: number,
}

const inactiveError = { name: 'CAMERA_INACTIVE', type: 'warning' }

export default class Selfie extends Component<Props, State> {
  webcam = null
  snapshotIntervalRef: ?IntervalID = null

  state: State = {
    hasBecomeInactive: false,
    snapshotBuffer: [],
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

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
  takeSnapshot = () => {
    screenshot(this.webcam, (blob, base64) => {
      this.setState(({ snapshotBuffer: [, newestSnapshot] }) => ({
        snapshotBuffer: [
          newestSnapshot,
          {
            blob: new File([blob], "applicant_snapshot.png", {
              type: "image/png"
            }),
            base64
          }
        ]
      }))
    })
  }

  handleClick = () => {
    screenshot(this.webcam, (blob, base64) =>
      this.props.onCapture(
        this.props.useMultipleSelfieCapture
          ? {
            selfie: true,
            /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
               to have a snapshot, even if it's not an ideal one */
            snapshot: this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1],
            capture: {
              blob: new File([blob], "applicant_selfie.png", {
                type: "image/png"
              }),
              base64
            }
          }
          : {
            blob: new File([blob], "applicant_selfie.png", {
              type: "image/png"
            }),
            base64
          }
      )
    )
  }

  setupSnapshots = () => {
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
    const { trackScreen, renderFallback } = this.props
    const { hasBecomeInactive } = this.state

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          onUserMedia={ this.setupSnapshots }
          renderError={ hasBecomeInactive ?
            <CameraError
              error={ inactiveError }
              {...{trackScreen, renderFallback}}
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
              onClick={this.handleClick}
            />
          </div>
        </Camera>
      </div>
    )
  }
}
