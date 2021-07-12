// @flow
import * as React from 'react'

import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import classNames from 'classnames'
import withFailureHandling from './withFailureHandling'
import withPermissionsFlow from '../CameraPermissions/withPermissionsFlow'
import CameraButton from '../Button/CameraButton'
import StartRecording from '../Video/StartRecording'

import style from './style.css'
import { compose } from '~utils/func'
import { localised } from '../../locales'

const isWebmFormatSupported = () => {
  const webmMimeTypes: string[] = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  return webmMimeTypes.some((mimeType) =>
    window.MediaRecorder?.isTypeSupported(mimeType)
  )
}

export type Props = {
  translate: (string, ?{}) => string,
  className?: string,
  containerClassName?: string,
  children?: React.Node,
  renderError?: React.Node,
  renderTitle?: React.Node,
  onFailure?: (Error) => void,
  onUserMedia?: Function,
  webcamRef: React.Ref<typeof Webcam>,
  video?: boolean,
  isRecording?: boolean,
  facing?: 'user' | 'environment',
  idealCameraWidth?: number,
  buttonType?: string,
  onButtonClick: Function,
  isButtonDisabled: boolean,
  hasGrantedPermission: boolean,
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
  isRecording,
  translate,
  facing = 'user',
  idealCameraWidth,
  buttonType,
  onButtonClick,
  isButtonDisabled,
  hasGrantedPermission,
}: Props) => {
  // Specify just a camera width (no height) because on safari if you specify both
  // height and width you will hit an OverconstrainedError if the camera does not
  // support the precise resolution.
  // Using width here because on some special devices (e.g. Samsung Galaxy),
  // setting 720px in height results to 720x960 resolution instead of the desired 720x1280.
  //
  // Resolution needs to be set to a lower value if WebM format is not supported
  // as video formats like MP4 (Safari) result in larger video file sizes
  // * Resolutions: 1280px = 720p, 480px = VGA (VGA is minimum we can go for automation + iOS SDK is using VGA resolution)
  const defaultCameraWidthInPx = isWebmFormatSupported() ? 1280 : 480
  return (
    <div className={classNames(style.camera, className)}>
      {renderTitle}
      <div className={classNames(style.container, containerClassName)}>
        <div
          className={classNames(style.webcamContainer, {
            [style.adjustForReducedResolution]: !isWebmFormatSupported(),
          })}
          role="group"
          aria-describedby="cameraViewAriaLabel"
        >
          <Webcam
            className={style.video}
            audio={!!video}
            width={idealCameraWidth || defaultCameraWidthInPx}
            facingMode={facing}
            {...{ onUserMedia, ref: webcamRef, onFailure }}
          />
        </div>
        <div className={style.actions}>
          {buttonType === 'photo' && (
            <CameraButton
              ariaLabel={translate('accessibility.shutter')}
              disableInteraction={!hasGrantedPermission || isButtonDisabled}
              onClick={onButtonClick}
              className={classNames(style.btn, {
                [style.disabled]: !hasGrantedPermission || isButtonDisabled,
              })}
            />
          )}
        </div>
        {buttonType === 'video' && !isRecording && (
          <StartRecording
            disableInteraction={!hasGrantedPermission || isButtonDisabled}
            onStart={onButtonClick}
          />
        )}
        <div
          id="cameraViewAriaLabel"
          aria-label={translate('accessibility.camera_view')}
        ></div>
        {children}
        {renderError}
      </div>
    </div>
  )
}

export default compose(
  localised,
  withFailureHandling,
  withPermissionsFlow
)(CameraPure)
