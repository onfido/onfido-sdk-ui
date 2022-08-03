import { h, Component, Ref } from 'preact'
import type Webcam from '~webcam/react-webcam'

import { getRecordedVideo } from '~utils/camera'
import { VIDEO_CAPTURE } from '~utils/constants'

import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import FallbackButton from '../Button/FallbackButton'
import PageTitle from '../PageTitle'
import { ToggleFullScreen } from '../FullScreen'

import type { CaptureMethods } from '~types/commons'
import type { WithTrackingProps, WithPermissionsFlowProps } from '~types/hocs'
import type {
  ErrorProp,
  HandleCaptureProp,
  RenderFallbackProp,
} from '~types/routers'

type VideoCaptureMethods = Exclude<CaptureMethods, 'poa' | 'activeVideo'>

type PhotoOverlayProps = {
  hasCameraError: boolean
  isRecording: boolean
}

export type VideoOverlayProps = {
  disableInteraction: boolean
  isRecording: boolean
  onStart: () => void
  onStop: () => void
} & WithPermissionsFlowProps

export type VideoCaptureProps = {
  audio?: boolean
  cameraClassName?: string
  facing?: VideoFacingModeEnum
  inactiveError: ErrorProp
  method: VideoCaptureMethods
  onRecordingStart?: () => void
  onRedo: () => void
  onVideoCapture: HandleCaptureProp
  renderFallback: RenderFallbackProp
  renderPhotoOverlay?: (props: PhotoOverlayProps) => h.JSX.Element
  renderVideoOverlay?: (props: VideoOverlayProps) => h.JSX.Element
  title?: string
  webcamRef?: Ref<Webcam>
  pageId?: string
  isUploadFallbackDisabled?: boolean
} & WithTrackingProps

type State = {
  hasBecomeInactive: boolean
  hasMediaStream: boolean
  hasRecordingTakenTooLong: boolean
} & PhotoOverlayProps

const initialStateWithoutMediaStream: Omit<State, 'hasMediaStream'> = {
  hasBecomeInactive: false,
  hasCameraError: false,
  hasRecordingTakenTooLong: false,
  isRecording: false,
}

const IDEAL_CAMERA_WIDTH_IN_PX = 1080 // Full HD 1080p

const RECORDING_TIMEOUT_ERRORS_MAP: Record<VideoCaptureMethods, ErrorProp> = {
  face: {
    name: 'FACE_VIDEO_TIMEOUT',
    type: 'warning',
  },
  document: {
    name: 'DOC_VIDEO_TIMEOUT',
    type: 'warning',
  },
  auth: {
    name: 'FACE_VIDEO_TIMEOUT',
    type: 'warning',
  },
  data: {
    name: 'PROFILE_DATA_TIMEOUT',
    type: 'warning',
  },
}

export default class VideoCapture extends Component<VideoCaptureProps, State> {
  private webcam?: Webcam

  state = { ...initialStateWithoutMediaStream, hasMediaStream: false }

  startRecording = (): void => {
    const { trackScreen } = this.props
    trackScreen('record_button_click')

    this.webcam && this.webcam.startRecording()
    this.setState({ isRecording: true, hasBecomeInactive: false })
  }

  stopRecording = (): void => {
    this.webcam && this.webcam.stopRecording()
    this.setState({ isRecording: false })
  }

  handleRecordingStart = (): void => {
    if (this.state.hasMediaStream) {
      this.startRecording()
      this.props.onRecordingStart && this.props.onRecordingStart()
    }
  }

  handleRecordingStop = (): void => {
    const { hasRecordingTakenTooLong } = this.state
    this.stopRecording()

    if (this.webcam && !hasRecordingTakenTooLong) {
      getRecordedVideo(this.webcam, (payload) =>
        this.props.onVideoCapture(payload)
      )
    }
  }

  handleMediaStream = (): void => this.setState({ hasMediaStream: true })

  handleInactivityTimeout = (): void =>
    this.setState({ hasBecomeInactive: true })

  handleRecordingTimeout = (): void => {
    this.setState({ hasRecordingTakenTooLong: true })
    this.stopRecording()
  }

  handleCameraError = (): void => this.setState({ hasCameraError: true })

  handleFallbackClick = (callback?: () => void): void => {
    this.setState({ ...initialStateWithoutMediaStream }, () => {
      this.props.onRedo()
      typeof callback === 'function' && callback()
    })
  }

  renderRedoActionsFallback: RenderFallbackProp = (
    { text, type },
    callback
  ) => {
    if (type === 'timeout') {
      return String(VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT)
    }

    return (
      <FallbackButton
        text={text}
        onClick={() => this.handleFallbackClick(callback)}
      />
    )
  }

  renderError = (): h.JSX.Element => {
    const { inactiveError, method, renderFallback, trackScreen } = this.props
    const { [method]: recordingTimeoutError } = RECORDING_TIMEOUT_ERRORS_MAP

    const passedProps = this.state.hasRecordingTakenTooLong
      ? {
          error: recordingTimeoutError,
          hasBackdrop: true,
          renderFallback: this.renderRedoActionsFallback,
        }
      : {
          error: inactiveError,
          isDismissible: true,
          renderFallback,
        }

    return <CameraError trackScreen={trackScreen} {...passedProps} />
  }

  renderInactivityTimeoutMessage = (): h.JSX.Element | null => {
    const { method } = this.props
    const {
      hasBecomeInactive,
      hasCameraError,
      hasRecordingTakenTooLong,
      isRecording,
    } = this.state
    const hasError =
      hasRecordingTakenTooLong || hasCameraError || hasBecomeInactive

    if (hasError) {
      return null
    }

    const recordingTimeout =
      method === 'document'
        ? VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT
        : VIDEO_CAPTURE.FACE_VIDEO_TIMEOUT

    const passedProps = {
      key: isRecording ? 'recording' : 'notRecording',
      seconds: isRecording ? recordingTimeout : VIDEO_CAPTURE.INACTIVE_TIMEOUT,
      onTimeout: isRecording
        ? this.handleRecordingTimeout
        : this.handleInactivityTimeout,
    }

    return <Timeout {...passedProps} />
  }

  render(): h.JSX.Element {
    const {
      audio,
      cameraClassName,
      facing,
      renderFallback,
      renderPhotoOverlay,
      renderVideoOverlay,
      title,
      trackScreen,
      webcamRef,
      pageId,
    } = this.props

    const {
      isRecording,
      hasBecomeInactive,
      hasRecordingTakenTooLong,
      hasCameraError,
      hasMediaStream,
    } = this.state

    const hasTimeoutError = hasBecomeInactive || hasRecordingTakenTooLong

    // Recording button should not be clickable on camera error, when recording takes too long,
    // when camera stream is not ready or when camera stream is recording
    const disableRecording =
      !hasMediaStream ||
      hasRecordingTakenTooLong ||
      hasCameraError ||
      isRecording

    return (
      <Camera
        idealCameraWidth={IDEAL_CAMERA_WIDTH_IN_PX}
        audio={audio}
        buttonType="video"
        containerClassName={cameraClassName}
        facing={facing}
        fallbackToDefaultWidth
        isButtonDisabled={disableRecording}
        isUploadFallbackDisabled={this.props.isUploadFallbackDisabled}
        onButtonClick={this.handleRecordingStart}
        onError={this.handleCameraError}
        onUserMedia={this.handleMediaStream}
        renderError={hasTimeoutError ? this.renderError() : null}
        renderFallback={renderFallback}
        renderVideoOverlay={
          renderVideoOverlay
            ? ({ hasGrantedPermission }) =>
                renderVideoOverlay({
                  disableInteraction: isRecording
                    ? hasTimeoutError || hasCameraError
                    : !hasGrantedPermission || disableRecording,
                  isRecording,
                  onStart: this.handleRecordingStart,
                  onStop: this.handleRecordingStop,
                })
            : undefined
        }
        renderTitle={!isRecording && title ? <PageTitle title={title} /> : null}
        trackScreen={trackScreen}
        pageId={pageId}
        webcamRef={(webcam) => {
          if (!webcam) {
            return
          }

          this.webcam = webcam

          if (webcamRef) {
            if (typeof webcamRef === 'function') {
              webcamRef(webcam)
            } else {
              webcamRef.current = webcam
            }
          }
        }}
      >
        <ToggleFullScreen />
        {renderPhotoOverlay &&
          renderPhotoOverlay({ hasCameraError, isRecording })}
        {this.renderInactivityTimeoutMessage()}
      </Camera>
    )
  }
}
