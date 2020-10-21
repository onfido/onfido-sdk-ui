// @flow
import * as React from 'react'
import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import classNames from 'classnames'
import withFailureHandling from './withFailureHandling'
import withPermissionsFlow from '../CameraPermissions/withPermissionsFlow'
import CameraButton from '../Button/CameraButton'
import StartRecording from '../Video/StartRecording'
import { compose } from '~utils/func'
import { localised } from '../../locales'
import style from './style.scss'

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const DEFAULT_CAMERA_HEIGHT_IN_PX = 720

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
  idealCameraHeight?: number,
  buttonType?: string,
  onButtonClick: Function,
  isButtonDisabled: boolean,
  hasGrantedPermission: boolean,
  fallbackHeight?: number,
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
  idealCameraHeight,
  buttonType,
  onButtonClick,
  isButtonDisabled,
  hasGrantedPermission,
  fallbackHeight,
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
          height={idealCameraHeight || DEFAULT_CAMERA_HEIGHT_IN_PX}
          facingMode={facing}
          fallbackHeight={fallbackHeight}
          {...{ onUserMedia, ref: webcamRef, onFailure }}
        />
      </div>
      <div className={style.actions}>
        {buttonType === 'photo' && (
          <CameraButton
            ariaLabel={translate('selfie_capture.button_accessibility')}
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
        aria-label={
          video
            ? translate('video_capture.frame_accessibility')
            : translate('selfie_capture.frame_accessibility')
        }
      />
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
