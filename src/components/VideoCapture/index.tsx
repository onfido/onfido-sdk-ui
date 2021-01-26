import { h, Component } from 'preact'
import Webcam from 'react-webcam-onfido'

import { getRecordedVideo } from '~utils/camera'

import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import FallbackButton from '../Button/FallbackButton'
import PageTitle from '../PageTitle'
import { ToggleFullScreen } from '../FullScreen'

import type { WithTrackingProps, WithPermissionsFlowProps } from '~types/hocs'
import type {
  ErrorProp,
  HandleCaptureProp,
  RenderFallbackProp,
} from '~types/routers'

type OverlayProps = {
  hasCameraError: boolean
  isRecording: boolean
}

type VideoLayerProps = {
  disableInteraction: boolean
  isRecording: boolean
  onStart: () => void
  onStop: () => void
} & WithPermissionsFlowProps

export type Props = {
  cameraClassName?: string
  facing?: VideoFacingModeEnum
  inactiveError: ErrorProp
  onRecordingStart?: () => void
  onRedo: () => void
  onVideoCapture: HandleCaptureProp
  renderFallback: RenderFallbackProp
  renderOverlay?: (props: OverlayProps) => h.JSX.Element
  renderVideoLayer?: (props: VideoLayerProps) => h.JSX.Element
  title?: string
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

const recordingTooLongError: ErrorProp = {
  name: 'VIDEO_TIMEOUT',
  type: 'warning',
}

export default class VideoCapture extends Component<Props, State> {
  private webcam?: Webcam = null

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

  handleFallbackClick = (callback: () => void): void => {
    this.setState({ ...initialStateWithoutMediaStream }, () => {
      this.props.onRedo()
      callback()
    })
  }

  renderRedoActionsFallback = (
    text: string,
    callback: () => void
  ): h.JSX.Element => (
    <FallbackButton
      text={text}
      onClick={() => this.handleFallbackClick(callback)}
    />
  )

  renderError = (): h.JSX.Element => {
    const { inactiveError, renderFallback, trackScreen } = this.props
    const passedProps = this.state.hasRecordingTakenTooLong
      ? {
          error: recordingTooLongError,
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

  renderRecordingTimeoutMessage = (): h.JSX.Element => {
    const { hasBecomeInactive, hasRecordingTakenTooLong } = this.state
    const hasTimeoutError = hasBecomeInactive || hasRecordingTakenTooLong
    const hasError = hasTimeoutError || this.state.hasCameraError

    if (!hasError) {
      return (
        <Timeout
          key="recording"
          seconds={20}
          onTimeout={this.handleRecordingTimeout}
        />
      )
    }
  }

  renderInactivityTimeoutMessage = (): h.JSX.Element => {
    const { hasRecordingTakenTooLong, hasCameraError } = this.state
    const hasError = hasRecordingTakenTooLong || hasCameraError

    if (!hasError) {
      return (
        <Timeout
          key="notRecording"
          seconds={12}
          onTimeout={this.handleInactivityTimeout}
        />
      )
    }
  }

  render(): h.JSX.Element {
    const {
      cameraClassName,
      facing,
      renderFallback,
      renderOverlay,
      renderVideoLayer,
      title,
      trackScreen,
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
        buttonType="video"
        containerClassName={cameraClassName}
        facing={facing}
        isButtonDisabled={disableRecording}
        onButtonClick={this.handleRecordingStart}
        onError={this.handleCameraError}
        onUserMedia={this.handleMediaStream}
        renderError={hasTimeoutError && this.renderError()}
        renderFallback={renderFallback}
        renderVideoLayer={({ hasGrantedPermission }) =>
          renderVideoLayer &&
          renderVideoLayer({
            disableInteraction: isRecording
              ? hasTimeoutError || hasCameraError
              : !hasGrantedPermission || disableRecording,
            isRecording,
            onStart: this.handleRecordingStart,
            onStop: this.handleRecordingStop,
          })
        }
        renderTitle={!isRecording && title && <PageTitle title={title} />}
        trackScreen={trackScreen}
        video
        webcamRef={(c: Webcam) => (this.webcam = c)}
      >
        <ToggleFullScreen />
        {renderOverlay && renderOverlay({ hasCameraError, isRecording })}
        {isRecording
          ? this.renderRecordingTimeoutMessage()
          : this.renderInactivityTimeoutMessage()}
      </Camera>
    )
  }
}
