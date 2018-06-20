// @flow
import * as React from 'react'
import { h } from 'preact'
import Visibility from 'visibilityjs'

import { asyncFunc } from '../utils/func'
import { cloneCanvas } from '../utils/canvas.js'
import type { CameraType } from './CameraTypes'

import { CameraPure, CaptureActions } from './index.js'
import Title from '../Title'

export default class Photo extends React.Component<CameraType> {
  webcam = null
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

  buttonText = () => {if (this.props.i18n) return this.props.i18n.t('capture.face.button')}

  render() {
    const isFullScreen = this.props.isFullScreen
    const title = this.props.title
    const subTitle = this.props.subTitle
    return (
      <div>
        <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
        <CameraPure {...{
            ...this.props,
            webcamRef: (c) => { this.webcam = c },
            onFallbackClick: () => { this.capture.stop },
          }}
        />
        <CaptureActions {...this.props}
          btnText={this.buttonText()}
          handleClick={this.capture.once} />
      </div>
    )
  }
}
