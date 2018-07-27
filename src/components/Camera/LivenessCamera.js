// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import Error from '../Error'
import {preventDefaultOnClick} from '../utils'
import { CameraPure, CaptureActions } from './index.js'
import Challenge from '../Liveness/Challenge'
import type { CameraType } from './CameraTypes'
import type { ChallengeType } from '../Liveness/Challenge'

type Props = {
  i18n: Object,
  challenges: ChallengeType[],
  onRedo: void => void,
  timeoutSeconds: number,
} & CameraType;

type State = {
  currentIndex: number,
  hasTimedOut: boolean,
  isRecording: boolean,
};

const initialState = {
  currentIndex: 0,
  isRecording: false,
  hasTimedOut: false,
}

export default class LivenessCamera extends React.Component<Props, State> {
  static defaultProps = {
    timeoutSeconds: 20,
  }

  timeout: TimeoutID
  webcam = null

  state: State = { ...initialState }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.challenges !== this.props.challenges) {
      this.resetTimeout()
    }
  }

  startRecording = () => {
    this.webcam && this.webcam.startRecording()
    this.setState({isRecording: true})
  }

  stopRecording = () => {
    this.webcam && this.webcam.stopRecording()
    this.setState({isRecording: false})
  }

  resetTimeout = () => {
    this.setState({hasTimedOut: false})
    clearTimeout(this.timeout)
  }

  handleRecordingStart = () => {
    this.startRecording()
    this.timeout = setTimeout(this.handleTimeout, this.props.timeoutSeconds * 1000)
  }

  handleRecordingStop = () => {
    const { hasTimedOut } = this.state
    this.stopRecording()
    if (this.webcam && !hasTimedOut) {
      this.props.onVideoRecorded(this.webcam.getVideoBlob(), this.props.challenges)
    }
  }

  handleTimeout = () => {
    this.setState({ hasTimedOut: true })
    this.stopRecording();
  }

  handleNextChallenge = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
  }

  render = () => {
    const { i18n, challenges = [] } = this.props
    const { isRecording, hasTimedOut, currentIndex } = this.state
    const { type, value } = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1

    return (
      <div className={style.livenessCamera}>
        {
          hasTimedOut ?
            <div className={style.errorContainer}>
               <Error
                {...{i18n}}
                className={style.errorMessage}
                error={{ name: 'LIVENESS_TIMEOUT', type: 'warning' }}
                renderAction={() => (
                  <button
                    onClick={preventDefaultOnClick(this.props.onRedo)}
                    className={classNames(theme.btn, theme['btn-ghost'], style.errorActionBtn)}
                  >{i18n.t('capture.liveness.challenges.redo_video')}</button>
                )}
                smaller
              />
            </div> :
            null
        }
        <CameraPure {...{
          ...this.props,
          video: true,
          isFullScreen: true,
          isFullScreenDesktop: true,
          isWithoutHole: isRecording,
          webcamRef: c => this.webcam = c,
          title: '',
          subTitle: '',
        }} />
        <div className={style.caption}>
        {
          isRecording ?
            <div>
              <div className={style.recordingIndicator}>
                {i18n.t('capture.liveness.recording')}
              </div>
              <Challenge {...{i18n, type, value}} />
            </div> :
            i18n.t('capture.face.webcam')
        }
        </div>
        <CaptureActions>
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
        </CaptureActions>
      </div>
    )
  }
}
