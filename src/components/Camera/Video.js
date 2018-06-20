// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'

import { CameraPure, CaptureActions } from './index.js'
import Title from '../Title'

type VideoState = {
  recording: boolean
}

export default class Video extends React.Component<CameraType, VideoState> {
  static defaultProps = {
    title: 'Video',
    subTitle: 'Something else'
  }

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

  render() {
    const isFullScreen = this.props.isFullScreen
    const title = this.props.title
    const subTitle = this.props.subTitle
    return (
      <div>
        <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
        <CameraPure {...{...this.props, webcamRef: (c) => { this.webcam = c }}}/>
        <CaptureActions {...this.props}
          btnText={this.buttonText()}
          recording={this.state.recording}
          handleClick={this.handleVideoClick} />
      </div>
    )
  }
}
