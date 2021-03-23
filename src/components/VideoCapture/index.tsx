import { h, Component, Ref } from 'preact'
import Webcam from 'react-webcam-onfido'

import { getRecordedVideo } from '~utils/camera'

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

const INACTIVE_TIMEOUT = 12
const FACE_VIDEO_TIMEOUT = 20
const DOC_VIDEO_TIMEOUT = 30

type OverlayProps = {
  hasCameraError: boolean
  isRecording: boolean
}

export type VideoLayerProps = {
  disableInteraction: boolean
  isRecording: boolean
  onStart: () => void
  onStop: () => void
} & WithPermissionsFlowProps

export type Props = {
  audio?: boolean
  cameraClassName?: string
  facing?: VideoFacingModeEnum
  inactiveError: ErrorProp
  method: CaptureMethods
  onRecordingStart?: () => void
  onRedo: () => void
  onVideoCapture: HandleCaptureProp
  renderFallback: RenderFallbackProp
  renderOverlay?: (props: OverlayProps) => h.JSX.Element
  renderVideoLayer?: (props: VideoLayerProps) => h.JSX.Element
  title?: string
  webcamRef?: Ref<Webcam>
} & WithTrackingProps

type State = {
  hasBecomeInactive: boolean
  hasMediaStream: boolean
  hasRecordingTakenTooLong: boolean
} & OverlayProps

const initialStateWithoutMediaStream: Omit<State, 'hasMediaStream'> = {
  hasBecomeInactive: false,
  hasCameraError: false,
  hasRecordingTakenTooLong: false,
  isRecording: false,
}

const RECORDING_TIMEOUT_ERRORS_MAP: Record<CaptureMethods, ErrorProp> = {
  face: {
    name: 'FACE_VIDEO_TIMEOUT',
    type: 'warning',
  },
  document: {
    name: 'DOC_VIDEO_TIMEOUT',
    type: 'warning',
  },
}

export default class VideoCapture extends Component<Props, State> {
  private webcam?: Webcam

  state = { ...initialStateWithoutMediaStream, hasMediaStream: false }

  startRecording = (): void => {
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

  renderRedoActionsFallback: RenderFallbackProp = (text, callback) => (
    <FallbackButton
      text={text}
      onClick={() => this.handleFallbackClick(callback)}
    />
  )

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
      method === 'document' ? DOC_VIDEO_TIMEOUT : FACE_VIDEO_TIMEOUT

    const passedProps = {
      key: isRecording ? 'recording' : 'notRecording',
      seconds: isRecording ? recordingTimeout : INACTIVE_TIMEOUT,
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
      renderOverlay,
      renderVideoLayer,
      title,
      trackScreen,
      webcamRef,
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
        audio={audio}
        buttonType="video"
        containerClassName={cameraClassName}
        facing={facing}
        fallbackToDefaultWidth
        isButtonDisabled={disableRecording}
        onButtonClick={this.handleRecordingStart}
        onError={this.handleCameraError}
        onUserMedia={this.handleMediaStream}
        renderError={hasTimeoutError ? this.renderError() : null}
        renderFallback={renderFallback}
        renderVideoLayer={({ hasGrantedPermission }) =>
          renderVideoLayer
            ? renderVideoLayer({
                disableInteraction: isRecording
                  ? hasTimeoutError || hasCameraError
                  : !hasGrantedPermission || disableRecording,
                isRecording,
                onStart: this.handleRecordingStart,
                onStop: this.handleRecordingStop,
              })
            : null
        }
        renderTitle={!isRecording && title ? <PageTitle title={title} /> : null}
        trackScreen={trackScreen}
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
        {renderOverlay && renderOverlay({ hasCameraError, isRecording })}
        {this.renderInactivityTimeoutMessage()}
      </Camera>
    )
  }
}
