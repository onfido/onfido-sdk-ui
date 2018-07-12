// @flow
import * as React from 'react'
import { h, Fragment } from 'preact'
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
      <ul className={style.introBullets}>
      {
        ['two_actions', 'speak_out_loud'].map(key =>
          <li key={key} className={style.introBullet}>
            <span className={classNames(style.introIcon, style[`${key}Icon`])} />
            {i18n.t(`capture.liveness.intro.${key}`)}
          </li>
        )
      }
      </ul>
    </div>
    <div className={theme.thickWrapper}>
      <button
        className={classNames(theme.btn, theme['btn-primary'], theme['btn-centered'])}
        onClick={preventDefaultOnClick(onNext)}>
        {i18n.t('capture.liveness.intro.continue')}
      </button>
    </div>
  </div>
)

const Challenge = ({title, renderInstructions}) => (
  <div className={style.challenge}>
    <div className={style.challengeTitle}>{title}</div>
    <div className={style.challengeDescription}>{renderInstructions()}</div>
  </div>
)

const RepeatDigits = ({i18n, value: digits}) => (
  <Challenge
    title={i18n.t('capture.liveness.challenges.repeat_digits')}
    renderInstructions={() => 
      <span className={style.digits}>{digits.join('–')}</span>
    }
  />
)

const MoveHead = ({i18n, value: side}) => (
  <Challenge
    title={i18n.t('capture.liveness.challenges.move_head', {
      side: i18n.t(`capture.liveness.challenges.${ side }`),
    })}
    renderInstructions={() =>
      <span className={classNames(style.moveHead, style[`moveHead-${ side}`])} />
    }
  />
)

const challengeTypes = {
  repeatDigits: RepeatDigits,
  moveHead: MoveHead,
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

  renderChallenges = () => {
    const { i18n } = this.props
    const { isRecording, hasTimedOut, currentIndex, challenges = [] } = this.state
    const { type, value } = challenges[currentIndex] || {}
    const ChallengeComponent = challengeTypes[type]
    const isLastChallenge = currentIndex === challenges.length - 1

    return (
      <div className={style.livenessCamera}>
        <CameraPure {...{
          ...this.props,
          video: true,
          isFullScreen: true,
          webcamRef: c => this.webcam = c,
          title: '',
          subTitle: '',
          ...(hasTimedOut ? { error: timeoutError } : {})
        }} />
        <div className={style.caption}>
        {
          isRecording ?
            <Fragment>
              <div className={style.recordingIndicator}>
                {i18n.t('capture.liveness.recording')}
              </div>
              <ChallengeComponent {...{i18n, value}} />
            </Fragment> :
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
