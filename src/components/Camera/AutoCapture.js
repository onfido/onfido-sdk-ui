// @flow
import * as React from 'react'
import { h } from 'preact'
import Visibility from 'visibilityjs'

import { asyncFunc } from '../utils/func'
import { cloneCanvas } from '../utils/canvas.js'
import type { CameraType } from './CameraTypes'
import { CameraPure } from './index.js'
import { screenshot } from '../utils/camera.js'

export default class AutoCapture extends React.Component<CameraType> {
  webcam = null
  interval: ?Visibility

  componentDidMount () {
    this.webcamMounted()
  }

  componentWillUnmount () {
    this.webcamUnmounted()
  }

  webcamMounted () {
    const { autoCapture } = this.props
    if (autoCapture) this.capture.start()
  }

  webcamUnmounted () {
    this.capture.stop()
  }

  capture = {
    start: () => {
      this.capture.stop()
      this.interval = Visibility.every(1000,() => screenshot(this.webcam, this.props.onScreenshot))
    },
    stop: () => Visibility.stop(this.interval)
  }

  render() {
    return (
      <div>
        <CameraPure {...{
          ...this.props,
          webcamRef: (c) => { this.webcam = c },
          onFallbackClick: () => { this.capture.stop }
        }}/>
      </div>
    )
  }
}
