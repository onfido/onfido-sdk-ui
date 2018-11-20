// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import type { ChallengeType, ChallengeResultType } from './Challenge'
import Camera from '../Camera'
import CameraError from '../CameraError'
import Title from '../Title'
import { ToggleFullScreen } from '../FullScreen'
import { FaceOverlay } from '../Overlay'
import { currentMilliseconds } from '../utils'
import { sendScreen } from '../../Tracker'
import Recording from './Recording'
import NotRecording from './NotRecording'
import withChallenges from './withChallenges'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  challenges: ChallengeType[],
  challengesId: any,
  onRedo: void => void,
  onVideoCapture: ({ blob: ?Blob, challengeData: ?ChallengeResultType }) => void,
  onSwitchChallenge: void => void,
  renderFallback: Function,
  trackScreen: Function,
  uploadFallbackDisabled: boolean,
} & LocalisedType

type State = {
  currentIndex: number,
  isRecording: boolean,
  hasMediaStream: boolean,
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
  hasMediaStream: false,
  hasBecomeInactive: false,
  hasRecordingTakenTooLong: false,
}

const inactiveError = { name: 'CAMERA_INACTIVE', type: 'warning' }
const inactiveErrorNoFallback = { name: 'CAMERA_INACTIVE_NO_FALLBACK', type: 'warning' }
const renderInactiveError = (noFallback) => noFallback ? inactiveErrorNoFallback : inactiveError
const recordingTooLongError = { name: 'LIVENESS_TIMEOUT', type: 'warning' }

class Video extends Component<Props, State> {
  webcam = null

  state: State = { ...initialState }

  componentWillReceiveProps(nextProps: Props) {
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
    if (this.state.hasMediaStream) {
      this.startRecording()
      this.setState({ startedAt: currentMilliseconds() })
      sendScreen(['face_video_capture_step_1'])
    }
  }

  handleRecordingStop = () => {
    const { switchSeconds, hasRecordingTakenTooLong } = this.state
    const { challenges, challengesId: id } = this.props
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

  redoActionsFallback = (text: string) => <span onClick={this.props.onRedo}>{text}</span>

  renderError = () => {
    const { trackScreen, renderFallback } = this.props
    return  (
      <CameraError
        {...{ trackScreen }}
        {...(this.state.hasRecordingTakenTooLong ? {
          error: recordingTooLongError,
          renderFallback: this.redoActionsFallback,
          hasBackdrop: true,
        } : {
          error: renderInactiveError(this.props.uploadFallbackDisabled),
          isDismissible: true,
          renderFallback,
        }) }
      />
    )
  }

  render = () => {
    const { translate, challenges = [] } = this.props
    const { isRecording, currentIndex, hasBecomeInactive, hasRecordingTakenTooLong } = this.state
    const currentChallenge = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1
    const hasError = hasBecomeInactive || hasRecordingTakenTooLong

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          onUserMedia={ this.handleMediaStream }
          renderTitle={ !isRecording &&
            <Title title={translate('capture.liveness.challenges.position_face')} />}
          {...(hasError ? { renderError: this.renderError() } : {}) }
          video
        >
          <ToggleFullScreen />
          <FaceOverlay isWithoutHole={ hasError || isRecording } />
          { isRecording ?
            <Recording
              {...{currentChallenge, isLastChallenge, hasError}}
              onNext={this.handleNextChallenge}
              onStop={this.handleRecordingStop}
              onTimeout={this.handleRecordingTimeout}
            /> :
            <NotRecording
              {...{hasError}}
              onStart={this.handleRecordingStart}
              onTimeout={this.handleInactivityTimeout}
            />
          }
        </Camera>
      </div>
    )
  }
}

export default localised(withChallenges(Video))
