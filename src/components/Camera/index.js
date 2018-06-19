// @flow
import * as React from 'react'
import { h } from 'preact'
import AutoCapture from './AutoCapture'
import Photo from './Photo'
import Video from './Video'

import type { CameraType } from './CameraTypes'

export default class Camera extends React.Component<CameraType> {
  componentDidMount () {
    this.props.trackScreen('camera')
  }
  render = () =>
    this.props.autoCapture ? <AutoCapture {...this.props} /> :
      this.props.liveness ? <Video {...this.props} /> : <Photo {...this.props} />
}
