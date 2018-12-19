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
}

type Props = {
  onCapture: Function,
  renderFallback: Function,
  trackScreen: Function,
  inactiveError: Object
}

export default class Selfie extends Component<Props, State> {
  webcam = null

  state: State = {
    hasBecomeInactive: false,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  onScreenshotCapture = (blob: Blob, base64: string, sdkMetadata: Object) => {
    this.props.onCapture({ blob, base64, sdkMetadata })
  }

  handleClick = () => screenshot(this.webcam, this.onScreenshotCapture)

  render() {
    const { trackScreen, renderFallback, inactiveError} = this.props
    const { hasBecomeInactive } = this.state

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
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
              onClick={this.handleClick}
            />
          </div>
        </Camera>
      </div>
    )
  }
}
