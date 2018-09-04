// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import Camera from '../Camera'
import CameraError from '../CameraError'
import Challenge from '../Liveness/Challenge'
import { CameraPure } from './index.js'
import type { CameraType } from './CameraTypes'
import type { ChallengeType } from '../Liveness/Challenge'
import Timeout from '../Timeout'
import Title from '../Title'
import ToggleFullScreen from '../ToggleFullScreen'
import { FaceOverlay } from '../Overlay'
import style from './style.css'

type Props = {
  i18n: Object,
  challenges: ChallengeType[],
  onRedo: void => void,
  onVideoRecordingStart: void => void,
  onSwitchChallenge: void => void,
  timeoutSeconds: number,
} & CameraType

type State = {
  currentIndex: number,
  isRecording: boolean,
  hasBecomeInactive: boolean,
  hasRecordingTakenTooLong: boolean,
}

const initialState = {
  currentIndex: 0,
  isRecording: false,
  hasBecomeInactive: false,
  hasRecordingTakenTooLong: false,
}

const inactiveError = { name: 'CAMERA_INACTIVE', type: 'warning' }
const recordingTooLongError = { name: 'LIVENESS_TIMEOUT', type: 'warning' }

export default class LivenessCamera extends React.Component<Props, State> {
  static defaultProps = {
    timeoutSeconds: 20,
  }

  timeout: TimeoutID
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
    this.startRecording()
    this.props.onVideoRecordingStart()
  }

  handleRecordingStop = () => {
    const { hasRecordingTakenTooLong } = this.state
    this.stopRecording()
    if (this.webcam && !hasRecordingTakenTooLong) {
      this.props.onVideoRecorded(this.webcam.getVideoBlob())
    }
  }

  handleNextChallenge = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
    this.props.onSwitchChallenge()
  }

  handleInactivityTimeout = () => {
    this.setState({ hasBecomeInactive: true })
  }

  handleRecordingTimeout = () => {
    this.setState({ hasRecordingTakenTooLong: true })
    this.stopRecording()
  }

  redoActionsFallback = (text: string) =>
    <span onClick={this.props.onRedo}>{text}</span>

  renderError = () => {
    const { hasRecordingTakenTooLong, hasBecomeInactive } = this.state
    const { i18n, trackScreen } = this.props

    if (hasBecomeInactive) {
      return (
        <CameraError
          error={inactiveError}
          onUploadFallback={this.props.onUploadFallback}
          hasBackdrop
          {...{i18n, trackScreen}}
        />
      )
    }

    if (hasRecordingTakenTooLong) {
      return (
        <CameraError
          error={recordingTooLongError}
          fallback={ this.redoActionsFallback }
          hasBackdrop
          {...{i18n, trackScreen}}
        />
      )
    }

    return null
  }

  render = () => {
    const { i18n, challenges = [], useFullScreen } = this.props
    const { isRecording, currentIndex, hasBecomeInactive, hasRecordingTakenTooLong } = this.state
    const currentChallenge = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1
    const title = isRecording ? '' : i18n.t('capture.liveness.challenges.position_face')
    const hasError = hasBecomeInactive || hasRecordingTakenTooLong

    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderTitle={ !isRecording ?
            <Title title={i18n.t('capture.liveness.challenges.position_face')} isFullScreen /> :
            null
          }
          renderError={ hasError ? this.renderError() : undefined }
          video
        >
          <ToggleFullScreen {...{useFullScreen}} />
          {
            isRecording ?
              <Timeout key="recording" seconds={ 20 } onTimeout={ this.handleRecordingTimeout } /> :
              <Timeout key="notRecording" seconds={ 2 } onTimeout={ this.handleInactivityTimeout } />
          }
          <FaceOverlay isFullScreen isWithoutHole={ hasError } />
          <div className={style.caption}>
          {
            isRecording &&
              <div>
                <div className={style.recordingIndicator}>
                  {i18n.t('capture.liveness.recording')}
                </div>
                <Challenge {...{i18n, ...currentChallenge }} />
              </div>
          }
          </div>
          <div className={style.actions}>
            <div className={classNames(style.captureActionsHint, {
              [style.recordAction]: !isRecording,
            })}>
              { isRecording ?
                i18n.t(`capture.liveness.challenges.done_${ isLastChallenge ? 'stop' : 'next' }`) :
                i18n.t('capture.liveness.press_record')
              }
            </div>
            {
              !isLastChallenge && isRecording ?
                <button
                  className={`${theme.btn} ${theme['btn-centered']} ${theme['btn-primary']}`}
                  onClick={this.handleNextChallenge}>
                  {this.props.i18n.t('capture.liveness.challenges.next')}
                </button> :
                <button
                  className={classNames(style.btn, {
                    [style.stopRecording]: isRecording,
                    [style.startRecording]: !isRecording,
                  })}
                  onClick={isRecording ? this.handleRecordingStop : this.handleRecordingStart}
                  disabled={this.props.hasError}
                />
            }
          </div>
        </Camera>
      </div>
    )
  }
}
