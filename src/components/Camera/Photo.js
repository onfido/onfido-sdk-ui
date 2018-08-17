// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import style from './style.css'
import { screenshot } from '../utils/camera.js'
import withInactivityCheck from './withInactivityCheck'
import { CameraPure, CameraActions } from './index.js'

class Photo extends React.Component<CameraType> {
  webcam = null

  screenshot = () => screenshot(this.webcam, this.props.onScreenshot)

  render() {
    return (
      <div>
        <CameraPure {...{
          ...this.props,
          webcamRef: (c) => { this.webcam = c }
        }} />
        <CameraActions >
          <button
            className={`${style.btn} ${style.fullScreenBtn}`}
            onClick={this.screenshot}
            disabled={!!this.props.hasError}
          />
        </CameraActions>
      </div>
    )
  }
}

export default withInactivityCheck(Photo)