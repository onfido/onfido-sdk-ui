// @flow
import * as React from 'react'
import { h } from 'preact'
import Visibility from 'visibilityjs'

import { asyncFunc } from '../utils/func'
import { cloneCanvas } from '../utils/canvas.js'
import type { CameraType } from './CameraTypes'

import { CameraPure }  from './camera.js'

export default class Photo extends React.Component<CameraType> {
  webcam: ?React$ElementRef<typeof Webcam> = null
  interval: ?Visibility

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

  render = () =>
    <CameraPure {...{
        ...this.props,
        handleClick: this.capture.once,
        webcamRef: (c) => { this.webcam = c },
        onFallbackClick: () => { this.capture.stop },
        btnText: this.props.i18n.t('capture.face.button')
      }}
    />
}
