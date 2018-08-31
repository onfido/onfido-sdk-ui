// @flow
import * as React from 'react'

import { h, Component } from 'preact'
import Webcam from 'react-webcam-onfido'

import { Overlay } from '../Overlay'
import Title from '../Title'
import CameraError from './CameraError'
import ToggleFullScreen from '../ToggleFullScreen'

import classNames from 'classnames'
import withFailureHandling from './withFailureHandling'
import withPermissionsFlow from './withPermissionsFlow'
import style from './style.css'
import { isDesktop } from '../utils'
import { compose } from '../utils/func'

const Camera = props => {
  const {
    renderTitle,
    renderError,
    error,

    method, hasError,
    onUserMedia, onFailure, webcamRef, isFullScreen, i18n,
    className, video} = props

  return (
    <div className={classNames(style.camera, className)}>
      {renderTitle}
      <div className={classNames(style.container,
        {[style.fullScreenContainer]: isFullScreen,
          [style.autoCaptureContainer]: !isFullScreen})}>
        {renderError}
        {
          // Specify just a camera height (no width) because on safari if you specify both
          // height and width you will hit an OverconstrainedError if the camera does not
          // support the precise resolution.
        }
        <div className={style.webcamContainer}><Webcam
          className={style.video}
          audio={!!video}
          height={720}
          facingMode={"user"}
          {...{onUserMedia, ref: webcamRef, onFailure}}
        /></div>
        { children }
      </div>
    </div>
  )
}

export default compose(
  withFailureHandling,
  withPermissionsFlow
)(Camera)

