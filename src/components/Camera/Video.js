// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'

import { CameraPure } from './camera.js'

type VideoState = {
  recording: boolean
}

export default class Video extends React.Component<CameraType, VideoState> {
  webcam: ?React$ElementRef<typeof Webcam> = null
  constructor() {
    super()
    this.state = { recording: false }
  }

  startRecording = () => {
    this.webcam.startRecording()
    this.setState({recording: true})
  }

  stopRecording = () => {
    this.webcam.stopRecording()
    this.setState({recording: false})
  }

  handleVideoStop = () => {
    this.stopRecording()
    const blob = this.webcam.getVideoBlob()
    this.props.onVideoRecorded(blob)
  }

  handleVideoClick = () => {
    this.state.recording ? this.handleVideoStop() : this.startRecording()
  }

  buttonText = () => {
    const { i18n } = this.props
    return this.state.recording ? i18n.t('capture.liveness.stop') : i18n.t('capture.liveness.start')
  }

  render = () =>
    <CameraPure {...{
      ...this.props,
      handleClick: this.handleVideoClick ,
      webcamRef: (c) => { this.webcam = c },
      btnText: this.buttonText(),
      recording: this.state.recording,
      onFallbackClick: () => {}
      }}
    />
}
