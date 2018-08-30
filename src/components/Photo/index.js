// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import style from './style.css'
import { shoot } from '../utils/camera.js'
import { canvasToBase64Images } from '../utils/canvas.js'
import { base64toBlob } from '../utils/file.js'

import Timeout from '../Timeout'
import { CameraPure, CameraActions } from './index.js'
import style from './style.css'

type State = {
  hasBecomeInactive: boolean,
}

class Photo extends React.Component<CameraType, State> {
  webcam = null

  state: State = {
    hasBecomeInactive: false,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleClick = () =>
    shoot(this.webcam, canvas =>
      canvasToBase64Images(canvas, (base64, lossyBase64) =>
        this.props.onCameraShot(base64toBlob(base64), lossyBase64)
      )
    )

  render() {
    const { hasError, hasGrantedPermission } = this.props
    const { hasBecomeInactive } = this.state
    return (
      <div>
        {
          hasGrantedPermission ?
            <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } /> :
            null
        }
        <CameraPure {...{
          ...this.props,
          webcamRef: (c) => { this.webcam = c },
          ...(!hasError && hasBecomeInactive ? {
            hasError: true,
            cameraError: { name: 'CAMERA_INACTIVE', type: 'warning' },
          } : {})
        }} />
        <div className={style.actions}>
          <button
            className={`${style.btn} ${style.fullScreenBtn}`}
            onClick={this.handleClick}
            disabled={!!hasError}
          />
        </div>
      </div>
    )
  }
}

export default Photo