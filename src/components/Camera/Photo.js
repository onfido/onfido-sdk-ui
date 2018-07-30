// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import classNames from 'classnames'
import style from './style.css'
import { screenshot } from '../utils/camera.js'

import { CameraPure, CaptureActions } from './index.js'

type PhotoStateType = {
  hasCameraTimedout: boolean
}

export default class Photo extends React.Component<CameraType, PhotoStateType> {
  webcam = null
  selfieTimeoutId = null

  state: PhotoStateType = {
    hasCameraTimedout: false,
  }

  componentWillUpdate() {
    // only start the timeout if permissions have been granted
    if (this.props.hasGrantedPermission && !this.selfieTimeoutId) {
      this.clearSelfieTimeout()
      this.selfieTimeoutId = setTimeout(() => {
        this.setState({hasCameraTimedout: true})
      }, 8000)
    }
  }

  componentWillUnmount() {
    this.clearSelfieTimeout()
  }

  clearSelfieTimeout = () =>
    this.selfieTimeoutId && clearTimeout(this.selfieTimeoutId)

  screenshot = () => screenshot(this.webcam, this.props.onScreenshot)
  buttonText = () => {if (this.props.i18n) return this.props.i18n.t('capture.face.button')}
  buttonClass = () => classNames({ [style.fullScreenBtn]: this.props.isFullScreen })
  cameraErrorOrWarning = () => {
    if (this.props.hasError) return this.props.cameraError
    return this.state.hasCameraTimedout ? { name: 'CAMERA_INACTIVE', type: 'warning' } : {}
  }

  render() {
    return (
      <div>
        <CameraPure {...{
            ...this.props,
            hasError: this.props.hasError || this.state.hasCameraTimedout,
            cameraError: this.cameraErrorOrWarning(),
            webcamRef: (c) => { this.webcam = c }
          }}
        />
        <CaptureActions {...this.props}
          btnText={this.buttonText()}
          handleClick={this.screenshot}
          btnClass={this.buttonClass()}
          btnDisabled={!!this.props.hasError}
           />
      </div>
    )
  }
}
