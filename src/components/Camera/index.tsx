import { h, FunctionComponent, Fragment } from 'preact'
import Webcam, { WebcamProps } from '~webcam/react-webcam'
import classNames from 'classnames'

import { localised } from '~locales'
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
import { useState } from 'preact/hooks'

const isWebmFormatSupported = () => {
  const webmMimeTypes: string[] = [
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm;codecs=vp9',
    'video/webm',
  ]
  return webmMimeTypes.some((mimeType) =>
    window.MediaRecorder?.isTypeSupported(mimeType)
  )
}

type Props = {
  pageId?: string
} & CameraProps &
  WebcamProps &
  WithLocalisedProps &
  WithFailureHandlingProps &
  WithPermissionsFlowProps &
  WithTrackingProps

const debugMessage = (
  settings: MediaTrackSettings | null,
  capa: MediaTrackCapabilities | null
) => {
  if (!settings || !capa) return ''
  console.log(settings)
  console.log(capa)
  const debug = {
    result: {
      width: settings.width,
      height: settings.height,
      aspectRatio: settings.aspectRatio,
      deviceId: settings.deviceId,
      // @ts-ignore
      resizeMode: settings.resizeMode,
    },
    capabilities: {
      width: capa.width,
      height: capa.height,
    },
  }

  return debug
}

const Camera: FunctionComponent<Props> = ({
  audio,
  buttonType,
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
  pageId,
}) => {
  const [settings, setSettings] = useState<MediaTrackSettings | null>(null)
  const [capa, setCapa] = useState<MediaTrackCapabilities | null>(null)
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

  const webcamProps = {
    audio,
    onFailure,
    onUserMedia,
    className: style.video,
    facingMode: facing,
    ref: webcamRef,
    width: idealCameraWidth || defaultCameraWidthInPx,
    fallbackWidth: fallbackToDefaultWidth
      ? defaultCameraWidthInPx
      : fallbackHeight,
  }

  return (
    <Fragment>
      <div style={{ zIndex: 999999, color: 'white', overflowWrap: 'anywhere' }}>
        {JSON.stringify(debugMessage(settings, capa))}
      </div>
      <div
        className={classNames(style.camera, {
          [style.docLiveCaptureFrame]: docLiveCaptureFrame,
          [style.docAutoCaptureFrame]: docAutoCaptureFrame,
        })}
        data-page-id={pageId}
      >
        {renderTitle}
        <div className={classNames(style.container, containerClassName)}>
          <div
            className={style.webcamContainer}
            role="group"
            aria-describedby="cameraViewAriaLabel"
          >
            <Webcam
              {...webcamProps}
              onUserMedia={(media) => {
                setSettings(media.getVideoTracks()[0].getSettings())
                setCapa(media.getVideoTracks()[0].getCapabilities())
                webcamProps.onUserMedia && webcamProps.onUserMedia(media)
              }}
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
            renderVideoOverlay &&
            renderVideoOverlay({ hasGrantedPermission })}
          {children}
          {renderError}
        </div>
      </div>
    </Fragment>
  )
}

export default localised(withFailureHandling(withPermissionsFlow(Camera)))
