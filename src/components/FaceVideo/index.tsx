import { h, Component } from 'preact'
import Webcam from 'react-webcam-onfido'
import Camera from '../Camera'
import CameraError from '../CameraError'
import FallbackButton from '../Button/FallbackButton'
import PageTitle from '../PageTitle'
import { ToggleFullScreen } from '../FullScreen'
import { FaceOverlay } from '../Overlay'
import { currentMilliseconds } from '~utils'
import { getRecordedVideo } from '~utils/camera'
import { sendScreen } from '../../Tracker'
import Recording from './Recording'
import Timeout from '../Timeout'
import withChallenges from './withChallenges'
import { localised, LocalisedType } from '../../locales'

import type { ChallengePayload, ChallengeData } from '~types/api'
import type {
  ErrorProp,
  RenderFallbackProp,
  StepComponentFaceProps,
} from '~types/routers'

type FaceVideoProps = {
  challenges: ChallengePayload[]
  challengesId: string
  onRedo: () => void
  onVideoCapture: (capture: {
    blob?: Blob
    challengeData?: ChallengeData
  }) => void
  onSwitchChallenge: () => void
  renderFallback: RenderFallbackProp
  inactiveError: ErrorProp
} & StepComponentFaceProps

type Props = FaceVideoProps & LocalisedType

type State = {
  currentIndex: number
  hasBecomeInactive: boolean
  hasCameraError: boolean
  hasMediaStream: boolean
  hasRecordingTakenTooLong: boolean
  isRecording: boolean
  startedAt?: number
  switchSeconds?: number
}

const initialState: State = {
  currentIndex: 0,
  hasBecomeInactive: false,
  hasCameraError: false,
  hasMediaStream: false,
  hasRecordingTakenTooLong: false,
  isRecording: false,
  startedAt: undefined,
  switchSeconds: undefined,
}

const recordingTooLongError: ErrorProp = {
  name: 'VIDEO_TIMEOUT',
  type: 'warning',
}

class FaceVideo extends Component<Props, State> {
  private webcam?: Webcam = null

  state = { ...initialState }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.challenges !== this.props.challenges) {
      this.setState({ ...initialState })
    }
  }

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
      this.setState({ startedAt: currentMilliseconds() })
      sendScreen(['face_video_capture_step_1'])
    }
  }

  handleRecordingStop = () => {
    const { switchSeconds, hasRecordingTakenTooLong } = this.state
    const { challenges, challengesId: id } = this.props
    const challengeData = { challenges, id, switchSeconds }
    this.stopRecording()
    if (this.webcam && !hasRecordingTakenTooLong) {
      getRecordedVideo(this.webcam, (data) =>
        this.props.onVideoCapture({ ...data, challengeData })
      )
    }
  }

  handleNextChallenge = () => {
    const { startedAt, currentIndex } = this.state
    this.setState({ currentIndex: currentIndex + 1 })
    if (startedAt) {
      this.setState({ switchSeconds: currentMilliseconds() - startedAt })
      sendScreen(['face_video_capture_step_2'])
    }
  }

  handleMediaStream = () => {
    this.setState({ hasMediaStream: true })
  }

  handleInactivityTimeout = () => {
    this.setState({ hasBecomeInactive: true })
  }

  handleRecordingTimeout = () => {
    this.setState({ hasRecordingTakenTooLong: true })
    this.stopRecording()
  }

  handleCameraError = () => {
    this.setState({ hasCameraError: true })
  }

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
    const { trackScreen, renderFallback, inactiveError } = this.props
    return (
      <CameraError
        {...{ trackScreen }}
        {...(this.state.hasRecordingTakenTooLong
          ? {
              error: recordingTooLongError,
              renderFallback: this.renderRedoActionsFallback,
              hasBackdrop: true,
            }
          : {
              error: inactiveError,
              isDismissible: true,
              renderFallback,
            })}
      />
    )
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
    const { translate, challenges = [] } = this.props
    const {
      isRecording,
      currentIndex,
      hasBecomeInactive,
      hasRecordingTakenTooLong,
      hasCameraError,
      hasMediaStream,
    } = this.state
    const currentChallenge =
      challenges[currentIndex] || ({} as ChallengePayload)
    const isLastChallenge = currentIndex === challenges.length - 1
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
        {...this.props}
        webcamRef={(c: Webcam) => (this.webcam = c)}
        onUserMedia={this.handleMediaStream}
        onError={this.handleCameraError}
        renderTitle={
          !isRecording && <PageTitle title={translate('video_capture.body')} />
        }
        {...(hasTimeoutError ? { renderError: this.renderError() } : {})}
        buttonType="video"
        isRecording={isRecording}
        onButtonClick={this.handleRecordingStart}
        isButtonDisabled={disableRecording}
        video
      >
        <ToggleFullScreen />
        <FaceOverlay isWithoutHole={hasCameraError || isRecording} />
        {isRecording
          ? this.renderRecordingTimeoutMessage()
          : this.renderInactivityTimeoutMessage()}
        {isRecording && (
          <Recording
            {...{
              currentChallenge,
              isLastChallenge,
              hasError: hasTimeoutError || hasCameraError,
              disableInteraction: hasTimeoutError || hasCameraError, // on any error
            }}
            onNext={this.handleNextChallenge}
            onStop={this.handleRecordingStop}
          />
        )}
      </Camera>
    )
  }
}

export default localised<FaceVideoProps>(withChallenges(FaceVideo))
