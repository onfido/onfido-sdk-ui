// @flow
import * as React from 'react'
import { h } from 'preact'
import Visibility from 'visibilityjs'

import { asyncFunc } from '../utils/func'
import { cloneCanvas } from '../utils/canvas.js'
import type { CameraType } from './CameraTypes'
import { CameraPure } from './index.js'

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
      this.interval = Visibility.every(1000, this.screenshot)
    },
    stop: () => Visibility.stop(this.interval),
    once: () => this.screenshot()
  }

  screenshot = () => {
    const { onScreenshot } = this.props
    const canvas = this.webcam && this.webcam.getCanvas()
    if (!canvas){
      console.error('webcam canvas is null')
      return
    }
    asyncFunc(cloneCanvas, [canvas], onScreenshot)
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
