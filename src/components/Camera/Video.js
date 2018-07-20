// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import classNames from 'classnames'
import style from './style.css'

import { CameraPure, CaptureActions } from './index.js'

type VideoState = {
  recording: boolean
}

export default class Video extends React.Component<CameraType, VideoState> {
  webcam = null

  constructor(props: CameraType) {
    super(props)
    this.state = { recording: false }
  }

  startRecording = () => {
    this.webcam && this.webcam.startRecording()
    this.setState({recording: true})
  }

  stopRecording = () => {
    this.webcam && this.webcam.stopRecording()
    this.setState({recording: false})
  }

  handleVideoStop = () => {
    this.stopRecording()
    const blob = this.webcam ? this.webcam.getVideoBlob() : null
    this.props.onVideoRecorded(blob)
  }

  handleVideoClick = () => {
    this.state.recording ? this.handleVideoStop() : this.startRecording()
  }

  buttonText = () => {
    const { i18n } = this.props
    if (i18n) {
      return this.state.recording ? i18n.t('capture.liveness.stop') : i18n.t('capture.liveness.start')
    }
  }

  buttonClass = () => classNames({[style.stopRecording]: this.state.recording, [style.startRecording]: !this.state.recording })

  render() {
    return (
      <div>
        <CameraPure {...{...this.props, video: true, webcamRef: (c) => { this.webcam = c }}}/>
        <CaptureActions {...this.props}
          btnText={this.buttonText()}
          handleClick={this.handleVideoClick}
          btnClass={this.buttonClass()}
          btnDisabled={!!this.props.hasError}
        />
      </div>
    )
  }
}
