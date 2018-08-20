// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import style from './style.css'
import { screenshot } from '../utils/camera.js'
import Timeout from '../Timeout'
import { CameraPure, CameraActions } from './index.js'

class Photo extends React.Component<CameraType> {
  webcam = null

  state = {
    hasBecomeInactive: false,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  screenshot = () => screenshot(this.webcam, this.props.onScreenshot)

  render() {
    const { hasError, hasGrantedPermission } = this.props
    const { hasBecomeInactive } = this.state
    return (
      <div>
        {
          hasGrantedPermission &&
            <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } />
        }
        <CameraPure {...{
          ...this.props,
          webcamRef: (c) => { this.webcam = c },
          ...(!hasError && hasBecomeInactive ? {
            hasError: true,
            cameraError: { name: 'CAMERA_INACTIVE', type: 'warning' },
          } : {})
        }} />
        <CameraActions >
          <button
            className={`${style.btn} ${style.fullScreenBtn}`}
            onClick={this.screenshot}
            disabled={!!hasError}
          />
        </CameraActions>
      </div>
    )
  }
}

export default Photo