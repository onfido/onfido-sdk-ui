// @flow
// import * as React from 'react'
import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import Dropzone from 'react-dropzone'

import classNames from 'classnames'
import { Overlay } from '../Overlay'
import Title from '../Title'

import theme from '../Theme/style.css'
import style from './style.css'
import type { CameraPureType } from './CameraTypes'

const UploadFallback = ({onUploadFallback, onFallbackClick, method, i18n}) =>
  <Dropzone
    onDrop={([file]) => onUploadFallback(file)}
    className={style.uploadFallback}
    multiple={false}>
    <button onClick={onFallbackClick()}>{i18n.t(`capture.${method}.help`)}</button>
  </Dropzone>

const CaptureActions = ({handleClick, btnText, isFullScreen, recording, liveness}) =>
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

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
export const CameraPure = ({method, title, subTitle, onUploadFallback, onFallbackClick,
  onUserMedia, handleClick, btnText, webcamRef, isFullScreen, onWebcamError, i18n, liveness, recording}: CameraPureType) => {
  return (
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
        <UploadFallback {...{onUploadFallback, onFallbackClick, method, i18n}}/>
      </div>
      { btnText && <CaptureActions {...{isFullScreen, handleClick, btnText, liveness, recording}}/> }
    </div>
  )
}
