import { h, Component, VNode } from 'preact'
import Webcam from 'react-webcam-onfido'

import { getRecordedVideo } from '~utils/camera'

import { localised } from '../../locales'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import FallbackButton from '../Button/FallbackButton'
import PageTitle from '../PageTitle'
import { ToggleFullScreen } from '../FullScreen'

import Recording from './Recording'

import type { CaptureMethods } from '~types/commons'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
import type { ErrorProp, RenderFallbackProp } from '~types/routers'

type VideoCaptureProps = {
  cameraClassName?: string
  children?: VNode
  inactiveError: ErrorProp
  method: CaptureMethods
  onRecordingStart?: () => void
  onRedo: () => void
  onVideoCapture: (payload: CapturePayload) => void
  renderFallback: RenderFallbackProp
} & WithTrackingProps

type Props = VideoCaptureProps & WithLocalisedProps

type State = {
  hasBecomeInactive: boolean
  hasCameraError: boolean
  hasMediaStream: boolean
  hasRecordingTakenTooLong: boolean
  isRecording: boolean
}

const initialState: State = {
  hasBecomeInactive: false,
  hasCameraError: false,
  hasMediaStream: false,
  hasRecordingTakenTooLong: false,
  isRecording: false,
}

const recordingTooLongError: ErrorProp = {
  name: 'VIDEO_TIMEOUT',
  type: 'warning',
}

class VideoCapture extends Component<Props, State> {
  private webcam?: Webcam = null

  state = { ...initialState }

  startRecording = () => {
    this.webcam && this.webcam.startRecording()
    this.setState({ isRecording: true, hasBecomeInactive: false })
  }

  stopRecording = () => {
    this.webcam && this.webcam.stopRecording()
    this.setState({ isRecording: false })
  }

  handleRecordingStart = () => {
    if (this.state.hasMediaStream) {
      this.startRecording()
      this.props.onRecordingStart && this.props.onRecordingStart()
      // sendScreen(['face_video_capture_step_1'])
    }
  }

  handleRecordingStop = () => {
    const { hasRecordingTakenTooLong } = this.state
    this.stopRecording()

    if (this.webcam && !hasRecordingTakenTooLong) {
      getRecordedVideo(this.webcam, (payload) =>
        this.props.onVideoCapture(payload)
      )
    }
  }

  handleMediaStream = () => this.setState({ hasMediaStream: true })

  handleInactivityTimeout = () => this.setState({ hasBecomeInactive: true })

  handleRecordingTimeout = () => {
    this.setState({ hasRecordingTakenTooLong: true })
    this.stopRecording()
  }

  handleCameraError = () => this.setState({ hasCameraError: true })

  handleFallbackClick = (callback: () => void) => {
    this.props.onRedo()
    callback()
  }

  renderRedoActionsFallback = (text: string, callback: () => void) => (
    <FallbackButton
      text={text}
      onClick={() => this.handleFallbackClick(callback)}
    />
  )

  renderError = () => {
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

  renderRecordingTimeoutMessage = () => {
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

  renderInactivityTimeoutMessage = () => {
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

  render = () => {
    const { cameraClassName, children, trackScreen, translate } = this.props
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
      hasRecordingTakenTooLong ||
      hasCameraError ||
      !hasMediaStream ||
      isRecording

    return (
      <Camera
        buttonType="video"
        containerClassName={cameraClassName}
        isButtonDisabled={disableRecording}
        isRecording={isRecording}
        onButtonClick={this.handleRecordingStart}
        onError={this.handleCameraError}
        onUserMedia={this.handleMediaStream}
        renderTitle={
          !isRecording && <PageTitle title={translate('video_capture.body')} />
        }
        trackScreen={trackScreen}
        video
        webcamRef={(c: Webcam) => (this.webcam = c)}
        {...(hasTimeoutError ? { renderError: this.renderError() } : {})}
      >
        <ToggleFullScreen />
        {/* <FaceOverlay isWithoutHole={hasCameraError || isRecording} /> */}
        {children}
        {isRecording
          ? this.renderRecordingTimeoutMessage()
          : this.renderInactivityTimeoutMessage()}
        {isRecording && (
          <Recording
            disableInteraction={hasTimeoutError || hasCameraError}
            onStop={this.handleRecordingStop}
          />
        )}
      </Camera>
    )
  }
}

export default localised(VideoCapture)
