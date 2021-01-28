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

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const DEFAULT_CAMERA_HEIGHT_IN_PX = 720

type Props = CameraProps &
  WebcamProps &
  WithLocalisedProps &
  WithFailureHandlingProps &
  WithPermissionsFlowProps &
  WithTrackingProps

const Camera: FunctionComponent<Props> = ({
  buttonType = 'photo',
  children,
  className,
  containerClassName,
  facing = 'user',
  fallbackHeight,
  hasGrantedPermission,
  idealCameraHeight,
  isButtonDisabled,
  onButtonClick,
  onFailure,
  onUserMedia,
  renderError,
  renderTitle,
  renderVideoLayer,
  translate,
  video,
  webcamRef,
}) => (
  <div className={classNames(style.camera, className)}>
    {renderTitle}
    <div className={classNames(style.container, containerClassName)}>
      <div
        className={style.webcamContainer}
        role="group"
        aria-describedby="cameraViewAriaLabel"
      >
        <Webcam
          audio={!!video}
          className={style.video}
          facingMode={facing}
          height={idealCameraHeight || DEFAULT_CAMERA_HEIGHT_IN_PX}
          {...{ fallbackHeight, onFailure, onUserMedia, ref: webcamRef }}
        />
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
        renderVideoLayer &&
        renderVideoLayer({ hasGrantedPermission })}
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

export default localised(withFailureHandling(withPermissionsFlow(Camera)))
