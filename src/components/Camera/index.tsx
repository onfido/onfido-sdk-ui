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
const DEFAULT_CAMERA_WIDTH_IN_PX = 1280

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
  webcamRef,
}) => (
  <div
    className={classNames(style.camera, {
      [style.docLiveCaptureFrame]: docLiveCaptureFrame,
      [style.docAutoCaptureFrame]: docAutoCaptureFrame,
    })}
  >
    {renderTitle}
    <div className={classNames(style.container, containerClassName)}>
      <div
        className={style.webcamContainer}
        role="group"
        aria-describedby="cameraViewAriaLabel"
      >
        <Webcam
          audio={audio}
          className={style.video}
          facingMode={facing}
          width={idealCameraHeight || DEFAULT_CAMERA_WIDTH_IN_PX}
          fallbackWidth={fallbackHeight || DEFAULT_CAMERA_WIDTH_IN_PX}
          {...{ onFailure, onUserMedia, ref: webcamRef }}
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
          buttonType === 'video'
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
