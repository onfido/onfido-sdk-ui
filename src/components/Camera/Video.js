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
import {preventDefaultOnClick} from 'components/utils'
import { getLivenessChallenges } from '../utils/onfidoApi'
import { CameraPure, CaptureActions } from './index.js'

const noop = () => {}
const timeoutError = { name: 'LIVENESS_TIMEOUT' }
const serverError = { name: 'SERVER_ERROR', type: 'error' }

type Challenge = {
  value: string,
  type: 'repeatDigits' | 'moveHead',
};

type Props = CameraType & {
  i18n: Object,
  onRestart: void => void,
  onVideoRecorded: (Blob, Object) => void,
  timeoutSeconds?: Number,
};

type State = {
  challenges: Challenge[],
  currentIndex: Number,
  hasLoaded: boolean,
  hasError: boolean,
  hasSeenIntro: boolean,
  hasTimedOut: boolean,
  isRecording: boolean,
};

const Intro = ({ i18n, onNext }) => (
  <div className={theme.fullHeightContainer}>
    <Title title={i18n.t('capture.liveness.intro.title')} />
    <div className={theme.thickWrapper}>
      <ul className={style.bullets}>
      {
        ['two_actions', 'speak_out_loud'].map(key =>
          <li key={key} className={style.bullet}>
            <span className={style[`${key}Icon`]} />
            {i18n.t(`capture.liveness.intro.${key}`)}
          </li>
        )
      }
      </ul>
    </div>
    <div className={theme.thickWrapper}>
      <button
        className={classNames(style.button, theme.btn, theme['btn-primary'])}
        onClick={preventDefaultOnClick(onNext)}>
        {i18n.t('capture.liveness.intro.continue')}
      </button>
    </div>
  </div>
)

const renderChallenge = {
  'repeatDigits': {
    title: i18n => i18n.t('capture.liveness.challenges.repeat_digits'),
    subTitle: (i18n, digits) => digits.join('–'),
  },
  'moveHead': {
    title: (i18n, side) => i18n.t('capture.liveness.challenges.move_head', {
      side: i18n.t(`capture.liveness.challenges.${ side }`),
    }),
    subTitle: noop,
  },
}

const initialChallengesState = {
  challenges: [],
  currentIndex: 0,
  isRecording: false,
  hasLoaded: false,
  hasError: false,
  hasTimedOut: false,
}

export default class Video extends React.Component<Props, State> {
  timeout: Timeout
  webcam = null

  static defaultProps: Props = {
    timeoutSeconds: 60,
  }

  state: State = {
    hasSeenIntro: false,
    ...initialChallengesState,
  }

  componentDidMount() {
    this.loadChallenges()
  }

  loadChallenges() {
    this.setState({...initialChallengesState})
    getLivenessChallenges()
      .then(challenges =>  this.setState({challenges, hasLoaded: true}))
      .catch(error => this.setState({ hasError: true }))
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
    this.stopRecording()
    if (!this.state.hasTimedOut) {
      const blob = this.webcam ? this.webcam.getVideoBlob() : null
      this.props.onVideoRecorded(blob, this.state.challenges)
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

  renderNext = () => (
    <div className={style.livenessNextContainer}>
      {this.props.i18n.t('capture.liveness.challenges.when_ready')}
      <button
        className={`${theme.btn} ${theme['btn-centered']} ${theme['btn-primary']}`}
        onClick={this.handleNextChallenge}>
        {this.props.i18n.t('capture.liveness.challenges.next')}
      </button>
    </div>
  )

  renderChallenges = () => {
    const { i18n } = this.props
    const { isRecording, hasTimedOut, currentIndex, challenges = [] } = this.state
    const { type, value } = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1

    return (
      <div>
        {
          isRecording ?
            <div className={style.recordingIndicator}>
              {i18n.t('capture.liveness.recording')}
            </div> :
            null
        }
        <CameraPure {...{
          ...this.props,
          video: true,
          isFullScreen: true,
          webcamRef: c => this.webcam = c,
          ...(isRecording ? {
            title: renderChallenge[type].title(i18n, value),
            subTitle: renderChallenge[type].subTitle(i18n, value),
          } : {}),
          ...(hasTimedOut ? { error: timeoutError } : {})
        }} />
        {
          isRecording && !isLastChallenge ?
            this.renderNext() :
            <CaptureActions {...this.props}
              btnText={i18n.t(`capture.liveness.${ isRecording ? 'stop' : 'start' }`)}
              handleClick={isRecording ? this.handleRecordingStop : this.handleRecordingStart}
              btnClass={classNames({
                [style.stopRecording]: isRecording,
                [style.startRecording]: !isRecording,
              })}
              btnDisabled={!!this.props.hasError}
            />
        }
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
