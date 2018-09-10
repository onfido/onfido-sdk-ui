// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import type { ChallengeType, ChallengeResultType } from './Challenge'
import Camera from '../Camera'
import CameraError from '../CameraError'
import Title from '../Title'
import ToggleFullScreen from '../ToggleFullScreen'
import { FaceOverlay } from '../Overlay'
import { currentMilliseconds } from '../utils'
import { sendScreen } from '../../Tracker'
import Recording from './Recording'
import NotRecording from './NotRecording'
import withChallenges from './withChallenges'

type Props = {
  i18n: Object,
  challenges: ChallengeType[],
  onRedo: void => void,
  onVideoRecorded: (?Blob, ?ChallengeResultType) => void,
  onVideoRecordingStart: void => void,
  onSwitchChallenge: void => void,
  renderFallback: Function,
  trackScreen: Function,
  useFullScreen: Function,
}

type State = {
  currentIndex: number,
  isRecording: boolean,
  hasBecomeInactive: boolean,
  hasRecordingTakenTooLong: boolean,
  startedAt: number,
  switchSeconds?: number,
}

const initialState = {
  startedAt: undefined,
  switchSeconds: undefined,
  currentIndex: 0,
  isRecording: false,
  hasBecomeInactive: false,
  hasRecordingTakenTooLong: false,
}

const inactiveError = { name: 'CAMERA_INACTIVE', type: 'warning' }
const recordingTooLongError = { name: 'LIVENESS_TIMEOUT', type: 'warning' }

class Video extends Component<Props, State> {
  webcam = null

  state: State = { ...initialState }

  componentWillReceiveProps(nextProps: RecorderType) {
    if (nextProps.challenges !== this.props.challenges) {
      this.setState({ ...initialState })
    }
  }

  startRecording = () => {
    this.webcam && this.webcam.startRecording()
    this.setState({isRecording: true, hasBecomeInactive: false})
  }

  stopRecording = () => {
    this.webcam && this.webcam.stopRecording()
    this.setState({isRecording: false})
  }

  handleRecordingStart = () => {
    this.startRecording()
    this.setState({ startedAt: currentMilliseconds() })
    sendScreen(['face_video_capture_step_1'])
  }

  handleRecordingStop = () => {
    const { challenges, id, switchSeconds, hasRecordingTakenTooLong } = this.state
    this.stopRecording()
    if (this.webcam && !hasRecordingTakenTooLong) {
      const challengeData = { challenges, id, switchSeconds }
      this.props.onVideoCapture({ blob: this.webcam.getVideoBlob(), challengeData })
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

  handleInactivityTimeout = () => {
    this.setState({ hasBecomeInactive: true })
  }

  handleRecordingTimeout = () => {
    this.setState({ hasRecordingTakenTooLong: true })
    this.stopRecording()
  }

  redoActionsFallback = (text: string) => <span onClick={this.props.onRedo}>{text}</span>

  renderError = () => {
    const { i18n, trackScreen, renderFallback } = this.props
    return  (
      <CameraError
        {...{i18n, trackScreen }}
        {...(this.state.hasRecordingTakenTooLong ? {
          error: recordingTooLongError,
          renderFallback: this.redoActionsFallback,
          hasBackdrop: true,
        } : {
          error: inactiveError,
          renderFallback,
        }) }
      />
    )
  }

  render = () => {
    const { i18n, challenges = [], useFullScreen } = this.props
    const { isRecording, currentIndex, hasBecomeInactive, hasRecordingTakenTooLong } = this.state
    const currentChallenge = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1
    const hasError = hasBecomeInactive || hasRecordingTakenTooLong

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderTitle={ !isRecording &&
            <Title title={i18n.t('capture.liveness.challenges.position_face')} isFullScreen />}
          {...(hasError ? { renderError: this.renderError() } : {}) }
          video
        >
          <ToggleFullScreen {...{useFullScreen}} />
          <FaceOverlay isFullScreen isWithoutHole={ hasError || isRecording } />
          { isRecording ?
            <Recording
              {...{i18n, currentChallenge, isLastChallenge, hasError}}
              onNext={this.handleNextChallenge}
              onStop={this.handleRecordingStop}
              onTimeout={this.handleRecordingTimeout}
            /> :
            <NotRecording
              {...{i18n, hasError}}
              onStart={this.handleRecordingStart}
              onTimeout={this.handleInactivityTimeout}
            />
          }
        </Camera>
      </div>
    )
  }
}

export default withChallenges(Video)
