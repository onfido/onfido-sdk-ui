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
import Title from '../Title'

import style from './style.css'
import type { CameraPureType, CameraType, CameraActionType} from './CameraTypes'

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

export const CaptureActions = ({handleClick, btnText, isFullScreen, btnClass}: CameraActionType) => {
  return (
    <div className={style.captureActions}>
      <button
        className={classNames(style.btn, btnClass)}
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
  onUserMedia, webcamRef, title, subTitle, isFullScreen, onWebcamError, i18n, liveness}: CameraPureType) =>
  <div className={style.camera}>
    <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
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
  </div>

export default class Camera extends React.Component<CameraType> {
  componentDidMount () {
    this.props.trackScreen('camera')
  }
  render = () =>
    this.props.autoCapture ? <AutoCapture {...this.props} /> :
      this.props.liveness ? <Video {...this.props} /> : <Photo {...this.props} />
}
