// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import classNames from 'classnames'
import style from './style.css'
import { screenshot } from '../utils/camera.js'

import { CameraPure, CaptureActions } from './index.js'

type PhotoStateType = {
  hasCameraTimeout: boolean
}

export default class Photo extends React.Component<CameraType, PhotoStateType> {
  webcam = null
  selfieTimeoutId = null

  state: PhotoStateType = {
    hasCameraTimeout: false,
  }

  componentDidMount () {
    this.clearSelfieTimeout()
    this.selfieTimeoutId = setTimeout(() => {
      this.setState({hasCameraTimeout: true})
    }, 8000)
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
    return this.state.hasCameraTimeout ? { name: 'CAMERA_INACTIVE', type: 'warning' } : {}
  }

  render() {
    return (
      <div>
        <CameraPure {...{
            ...this.props,
            hasError: this.props.hasError || this.state.hasCameraTimeout,
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
