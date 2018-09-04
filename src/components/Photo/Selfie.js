// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { shoot } from '../utils/camera.js'
import { FaceOverlay } from '../Overlay'
import ToggleFullScreen from '../ToggleFullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import style from './style.css'

type State = {
  hasBecomeInactive: boolean,
}

type Props = {
  onCameraShot: Function,

  // @todo, remove
  i18n: Object,
  onUploadFallback: Function,
  changeFlowTo: Function,
  method: string,
  trackScreen: Function,
  useFullScreen: Function,
}

const inactiveError = { name: 'CAMERA_INACTIVE', type: 'warning' }

export default class Photo extends Component<Props, State> {
  webcam = null

  state: State = {
    hasBecomeInactive: false,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleClick = () => shoot(this.webcam, this.props.onCameraShot)

  render() {
    const { i18n, trackScreen, changeFlowTo, onUploadFallback, method, useFullScreen } = this.props
    const { hasBecomeInactive } = this.state

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderError={ hasBecomeInactive ?
            <CameraError
              error={ inactiveError }
              {...{i18n, trackScreen, changeFlowTo, onUploadFallback, method}}
            /> : null
          }
        >
          <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } />
          <ToggleFullScreen {...{useFullScreen}} />
          <FaceOverlay />
          <div className={style.actions}>
            <button
              className={style.btn}
              onClick={this.handleClick}
              disabled={!!hasBecomeInactive}
            />
          </div>
        </Camera>
      </div>
    )
  }
}
