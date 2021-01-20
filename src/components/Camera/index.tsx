import { h, FunctionComponent, VNode, Ref } from 'preact'
import Webcam, { WebcamProps } from 'react-webcam-onfido'
import classNames from 'classnames'
import withFailureHandling from './withFailureHandling'
import withPermissionsFlow from '../CameraPermissions/withPermissionsFlow'
import CameraButton from '../Button/CameraButton'
import StartRecording from '../FaceVideo/StartRecording'
import { compose } from '~utils/func'
import { localised, LocalisedType } from '../../locales'
import style from './style.scss'

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const DEFAULT_CAMERA_HEIGHT_IN_PX = 720

type OwnProps = {
  buttonType?: 'photo' | 'video'
  children?: VNode
  className?: string
  containerClassName?: string
  facing?: VideoFacingModeEnum
  hasGrantedPermission?: boolean
  idealCameraHeight?: number
  isButtonDisabled?: boolean
  isRecording?: boolean
  onButtonClick: () => void
  renderError?: VNode
  renderTitle?: VNode
  video?: boolean
  webcamRef?: Ref<Webcam>
} & WebcamProps

type Props = OwnProps & LocalisedType

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
  isRecording,
  onButtonClick,
  onFailure,
  onUserMedia,
  renderError,
  renderTitle,
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
)(Camera)
