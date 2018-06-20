// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import Dropzone from 'react-dropzone'

import AutoCapture from './AutoCapture'
import Photo from './Photo'
import Video from './Video'

import classNames from 'classnames'
import { Overlay } from '../Overlay'

import theme from '../Theme/style.css'
import style from './style.css'
import type { CameraPureType, CameraType } from './CameraTypes'

const UploadFallback = ({onUploadFallback, onFallbackClick, method, i18n}) => {
  const text = i18n && method ? i18n.t(`capture.${method}.help`) : ''
  return (
    <Dropzone
      onDrop={([file]) => onUploadFallback(file)}
      className={style.uploadFallback}
      multiple={false}>
      <button onClick={onFallbackClick}>{text}</button>
    </Dropzone>
  )
}

export const CaptureActions = ({handleClick, btnText, isFullScreen, recording, liveness}) => {
  return (
    <div className={style.captureActions}>
      <button
        className={classNames(
          theme.btn, theme["btn-centered"],
          theme["btn-primary"],
          { [style.fullScreenBtn]: isFullScreen && !liveness, [style.recording]: recording, [style.liveness]: liveness }
        )}
        onClick={handleClick}>
        <div className={classNames({[style.btnText]: isFullScreen})}>{btnText}</div>
      </button>
    </div>
  )
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
export const CameraPure = ({method, onUploadFallback, onFallbackClick,
  onUserMedia, webcamRef, isFullScreen, onWebcamError, i18n, liveness}: CameraPureType) =>
  <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
    <Webcam
      className={style.video}
      audio={!!liveness}
      height={720}
      {...{onUserMedia, ref: webcamRef, onFailure: onWebcamError}}
    />
    <Overlay {...{method, isFullScreen}}/>
    { !liveness && <UploadFallback {...{onUploadFallback, onFallbackClick, method, i18n}}/> }
  </div>

export default class Camera extends React.Component<CameraType> {
  componentDidMount () {
    this.props.trackScreen('camera')
  }
  render = () =>
    <div className={style.camera}>
      {
        this.props.autoCapture ? <AutoCapture {...this.props} /> :
        this.props.liveness ? <Video {...this.props} /> : <Photo {...this.props} />
      }
    </div>
}
