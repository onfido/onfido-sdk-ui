import { h, FunctionComponent } from 'preact'
import Webcam, { WebcamProps } from 'react-webcam-onfido'
import classNames from 'classnames'

import { localised } from '../../locales'
import withPermissionsFlow from '../CameraPermissions/withPermissionsFlow'
import CameraButton from '../Button/CameraButton'

import withFailureHandling from './withFailureHandling'
import style from './style.scss'

import type { CameraProps } from '~types/camera'
import type {
  WithLocalisedProps,
  WithFailureHandlingProps,
  WithTrackingProps,
  WithPermissionsFlowProps,
} from '~types/hocs'

// Specify just a camera width (no height) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
// Using width here because on some special devices (e.g. Samsung Galaxy),
// setting 720px in height results to 720x960 resolution instead of the desired 720x1280.
const DEFAULT_CAMERA_WIDTH_IN_PX = 1280 // HD 720p

type Props = CameraProps &
  WebcamProps &
  WithLocalisedProps &
  WithFailureHandlingProps &
  WithPermissionsFlowProps &
  WithTrackingProps

const Camera: FunctionComponent<Props> = ({
  audio,
  buttonType = 'photo',
  children,
  containerClassName,
  docAutoCaptureFrame = false,
  docLiveCaptureFrame = false,
  facing = 'user',
  fallbackHeight,
  fallbackToDefaultWidth,
  hasGrantedPermission,
  idealCameraWidth,
  isButtonDisabled,
  onButtonClick,
  onFailure,
  onUserMedia,
  renderError,
  renderTitle,
  renderVideoOverlay,
  translate,
  webcamRef,
}) => {
  const webcamProps = {
    audio,
    onFailure,
    onUserMedia,
    className: style.video,
    facingMode: facing,
    ref: webcamRef,
    width: idealCameraWidth || DEFAULT_CAMERA_WIDTH_IN_PX,
    fallbackWidth: fallbackToDefaultWidth
      ? DEFAULT_CAMERA_WIDTH_IN_PX
      : fallbackHeight,
  }

  return (
    <div
      className={classNames(style.camera, {
        [style.docLiveCaptureFrame]: docLiveCaptureFrame,
        [style.docAutoCaptureFrame]: docAutoCaptureFrame,
      })}
    >
      {renderTitle}
      <div className={classNames(style.container, containerClassName)}>
        <div className={style.webcamContainer}>
          <Webcam {...webcamProps} />
        </div>
        {buttonType === 'photo' && (
          <div className={style.actions}>
            <CameraButton
              ariaLabel={translate('selfie_capture.button_accessibility')}
              disableInteraction={!hasGrantedPermission || isButtonDisabled}
              onClick={onButtonClick}
              className={classNames(style.btn, {
                [style.disabled]: !hasGrantedPermission || isButtonDisabled,
              })}
            />
          </div>
        )}
        {buttonType === 'video' &&
          renderVideoOverlay &&
          renderVideoOverlay({ hasGrantedPermission })}
        {children}
        {renderError}
      </div>
    </div>
  )
}

export default localised(withFailureHandling(withPermissionsFlow(Camera)))
