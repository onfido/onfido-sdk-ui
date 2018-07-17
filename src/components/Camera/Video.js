// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import type { CameraType } from './CameraTypes'
import style from './style.css'
import Spinner from '../Spinner'
import theme from '../Theme/style.css'
import Error from '../Error'
import Title from '../Title'
import {preventDefaultOnClick} from '../utils'
import { getLivenessChallenges } from '../utils/onfidoApi'
import { CameraPure, CaptureActions } from './index.js'
import Intro from '../Liveness/Intro'
import Challenge from '../Liveness/Challenge'
import type { ChallengeType } from './Liveness/Challenge'

const noop = () => {}
const timeoutError = { name: 'LIVENESS_TIMEOUT' }
const serverError = { name: 'SERVER_ERROR', type: 'error' }

type Props = {
  i18n: Object,
  onVideoRecorded: (?Blob, ?ChallengeType[]) => void,
  timeoutSeconds: number,
} & CameraType;

type State = {
  challenges: ChallengeType[],
  currentIndex: number,
  hasLoaded: boolean,
  hasError: boolean,
  hasSeenIntro: boolean,
  hasTimedOut: boolean,
  isRecording: boolean,
};

const initialState = {
  challenges: [],
  currentIndex: 0,
  isRecording: false,
  hasLoaded: false,
  hasError: false,
  hasTimedOut: false,
}

export default class Video extends React.Component<Props, State> {
  static defaultProps = {
    timeoutSeconds: 60,
  }

  timeout: TimeoutID
  webcam = null

  state: State = {
    hasSeenIntro: false,
    ...initialState,
  }

  componentDidMount() {
    this.loadChallenges()
  }

  loadChallenges() {
    const { hasSeenIntro } = this.state
    this.setState({...initialState, hasSeenIntro})
    getLivenessChallenges()
      .then(challenges =>  this.setState({challenges, hasLoaded: true}))
      .catch(error => this.setState({ hasLoaded: true, hasError: true }))
  }

  startRecording = () => {
    this.webcam && this.webcam.startRecording()
    this.setState({isRecording: true})
  }

  stopRecording = () => {
    this.webcam && this.webcam.stopRecording()
    this.setState({isRecording: false})
  }

  handleIntroNext = () => {
    this.setState({hasSeenIntro: true})
  }

  handleRecordingStart = () => {
    this.startRecording()
    this.timeout = setTimeout(this.handleTimeout, this.props.timeoutSeconds * 1000)
  }

  handleRecordingStop = () => {
    const { challenges, hasTimedOut } = this.state
    this.stopRecording()
    if (this.webcam && !hasTimedOut) {
      this.props.onVideoRecorded(this.webcam.getVideoBlob(), challenges)
    }
  }

  handleTimeout = () => {
    this.setState({ hasTimedOut: true })
  }

  handleRedoVideo = () => {
    this.loadChallenges()
  }

  handleNextChallenge = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
  }

  renderRedoAction = () => (
    <button
      onClick={preventDefaultOnClick(this.handleRedoVideo)}
      className={classNames(theme.btn, theme['btn-ghost'])}
    >{this.props.i18n.t('capture.liveness.challenges.redo_video')}</button>
  )

  renderChallenges = () => {
    const { i18n } = this.props
    const { isRecording, hasTimedOut, currentIndex, challenges = [] } = this.state
    const { type, value } = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1

    return (
      <div className={style.livenessCamera}>
        <CameraPure {...{
          ...this.props,
          video: true,
          isFullScreen: true,
          isLiveness: true,
          webcamRef: c => this.webcam = c,
          title: '',
          subTitle: '',
          ...(hasTimedOut ? { error: timeoutError } : {})
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
        <CaptureActions
          hint={ isRecording ? i18n.t(`capture.liveness.challenges.done_${ isLastChallenge ? 'stop' : 'next' }`) : '' }
        >
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

  render() {
    const { i18n } = this.props
    const { hasSeenIntro, hasLoaded, hasError } = this.state

    return (
      hasSeenIntro ?
        hasLoaded ?
          hasError ?
            <Error {...{error: serverError, i18n}} /> :
            this.renderChallenges()
          :
            <Spinner />
        :
        <Intro i18n={i18n} onNext={this.handleIntroNext} />
    )
  }
}
