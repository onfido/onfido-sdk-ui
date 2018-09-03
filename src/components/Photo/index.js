// @flow
import * as React from 'react'
import { h } from 'preact'

import type { CameraType } from './CameraTypes'
import { shoot } from '../utils/camera.js'
import { canvasToBase64Images } from '../utils/canvas.js'
import { base64toBlob } from '../utils/file.js'

import ToggleFullScreen from '../ToggleFullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import withAutoShot from './withAutoShot'
import style from './style.css'
import Overlay from '../Overlay'

type State = {
  hasBecomeInactive: boolean,
}

const inactiveError = { name: 'CAMERA_INACTIVE', type: 'warning' }

class Photo extends React.Component<CameraType, State> {
  webcam = null

  state: State = {
    hasBecomeInactive: false,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  shoot = () => shoot(this.webcam, canvas =>
    canvasToBase64Images(canvas, (base64, lossyBase64) =>
      this.props.onCameraShot(base64toBlob(base64), lossyBase64)
    )
  )

  handleClick = () => this.shoot()

  render() {
    const { hasGrantedPermission, method, i18n, trackScreen, onUploadFallback,
      shouldUseFullScreenCamera, isFullScreen, useFullScreen,
    } = this.props
    const { hasBecomeInactive } = this.state

    return (
      <div>
        {
          hasGrantedPermission ?
            <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } /> :
            null
        }
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderError={ hasBecomeInactive ?
            <CameraError
              error={ inactiveError }
              {...{i18n, trackScreen, onUploadFallback}}
            /> : null
          }
        >
          <div>
            <Overlay {...{ method, isFullScreen }} />
          </div>
          {
            shouldUseFullScreenCamera &&
              <ToggleFullScreen {...{useFullScreen}} />
          }
          <div className={style.actions}>
            <button
              className={`${style.btn} ${style.fullScreenBtn}`}
              onClick={this.handleClick}
              disabled={!!hasBecomeInactive}
            />
          </div>
        </Camera>
      </div>
    )
  }
}

export default Photo

export const AutoShot = withAutoShot(Photo)