// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import classNames from 'classnames'
import style from './style.css'
import { screenshot } from '../utils/camera.js'

import { CameraPure, CaptureActions } from './index.js'

type PhotoStateType = {
  hasError?: boolean,
  cameraError?: Object,
}

export default class Photo extends React.Component<CameraType, PhotoStateType> {
  webcam = null
  selfieTimeoutId = null

  state: PhotoStateType = {
    hasError: !!this.props.hasError,
    cameraError: this.props.cameraError,
  }

  componentDidMount () {
    this.clearSelfieTimeout()
    this.selfieTimeoutId = setTimeout(() => {
      // Only show camera_inactive warning if camera hasn't errored
      if (!this.props.hasError) {
        this.setState({hasError: true, cameraError: { name: 'CAMERA_INACTIVE', type: 'warning' }})
      }
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

  render() {
    return (
      <div>
        <CameraPure {...{
            ...this.props,
            hasError: this.props.hasError || this.state.hasError,
            cameraError: this.props.cameraError || this.state.cameraError,
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
