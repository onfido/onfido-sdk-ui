// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import classNames from 'classnames'
import withFailureHandling from './withFailureHandling'
import withPermissionsFlow from '../CameraPermissions/withPermissionsFlow'
import CameraButton from '../Button/CameraButton'
import style from './style.css'
import { compose } from '~utils/func'
import { localised } from '../../locales'

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const cameraHeight = 720

export type Props = {
  translate: (string, ?{}) => string,
  className?: string,
  containerClassName?: string,
  children?: React.Node,
  renderError?: React.Node,
  renderTitle?: React.Node,
  onFailure?: Error => void,
  onUserMedia?: Function,
  webcamRef: React.Ref<typeof Webcam>,
  video?: boolean,
  facing?: 'user' | 'environment',
  idealCameraHeight?: number,
  hideCaptureButton: boolean,
  onCaptureClick: Function,
  isCaptureDisabled: boolean,
  hasGrantedPermission: boolean
}

const CameraPure = ({
  className,
  containerClassName,
  renderTitle,
  renderError,
  children,
  webcamRef,
  onUserMedia,
  onFailure,
  video,
  translate,
  facing = 'user',
  idealCameraHeight,
  hideCaptureButton = false,
  onCaptureClick,
  isCaptureDisabled,
  hasGrantedPermission
}: Props) => (
  <div className={classNames(style.camera, className)}>
    {renderTitle}
    <div className={classNames(style.container, containerClassName)}>
      <div
        className={style.webcamContainer}
        role="group"
        aria-describedby="cameraViewAriaLabel"
      >
        <Webcam
          className={style.video}
          audio={!!video}
          height={idealCameraHeight || cameraHeight}
          facingMode={facing}
          {...{ onUserMedia, ref: webcamRef, onFailure }}
        />
      </div>
      <div
        className={classNames(style.actions, {
          [style.disabled]: !hasGrantedPermission
        })}
      >
        {!hideCaptureButton &&
          <CameraButton
            ariaLabel={translate('accessibility.shutter')}
            disabled={!hasGrantedPermission || isCaptureDisabled}
            onClick={onCaptureClick}
            className={style.btn}
          />}
      </div>
      <div
        id="cameraViewAriaLabel"
        aria-label={translate('accessibility.camera_view')}
      ></div>
      {children}
      {renderError}
    </div>
  </div>
)

export default compose(
  localised,
  withFailureHandling,
  withPermissionsFlow
)(CameraPure)