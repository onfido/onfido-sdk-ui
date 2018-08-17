// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import {preventDefaultOnClick} from '../utils'
import { CameraPure, CameraActions } from './index.js'
import Challenge from '../Liveness/Challenge'
import type { CameraType } from './CameraTypes'
import type { ChallengeType } from '../Liveness/Challenge'
import withInactivityCheck from './withInactivityCheck'

type Props = {
  i18n: Object,
  challenges: ChallengeType[],
  onRedo: void => void,
  onSwitchChallenge: void => void,
} & CameraType

type State = {
  currentIndex: number,
  isRecording: boolean,
}

const initialState = {
  currentIndex: 0,
  isRecording: false,
}

const InitialCamera = withInactivityCheck(props => <CameraPure {...props} />, { seconds: 10 })

const RecordingCamera = withInactivityCheck(props => <CameraPure {...props} />, {
  seconds: 5,
  error: { name: 'LIVENESS_TIMEOUT', type: 'warning' },
  hasBackdrop: true,
  renderAction: props => (
    <button
      onClick={preventDefaultOnClick(props.onRedo)}
      className={classNames(theme.btn, theme['btn-ghost'], style.errorActionBtn)}
    >{props.i18n.t('capture.liveness.challenges.redo_video')}</button>
  ),
})

export default class LivenessCamera extends React.Component<Props, State> {
  webcam = null

  state: State = { ...initialState }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.challenges !== this.props.challenges) {
      this.setState({currentIndex: 0})
    }
  }

  recordUserMedia = () => {
    this.webcam.startRecording()
    this.props.onUserMedia()
  }

  handleRecordingStartClick = () => {
    this.setState({isRecording: true})
  }

  handleRecordingStopClick = () => {
    this.setState({isRecording: false})
    if (this.webcam) {
      this.webcam.stopRecording()
      this.props.onVideoRecorded(this.webcam.getVideoBlob(), this.props.challenges)
    }
  }

  handleNextChallengeClick = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
  }

  render = () => {
    const { i18n, challenges = [] } = this.props
    const { isRecording, currentIndex } = this.state
    const { type, value } = challenges[currentIndex] || {}
    const isLastChallenge = currentIndex === challenges.length - 1
    const title = isRecording ? '' : i18n.t('capture.liveness.challenges.position_face')
    const CameraComponent = isRecording ? RecordingCamera : InitialCamera

    return (
      <div className={style.livenessCamera}>
        <CameraComponent {
          ...{
            ...this.props,
            video: true,
            isWithoutHole: isRecording,
            onTimedOut: isRecording ? this.stopRecording : () => {},
            onUserMedia: isRecording ? this.recordUserMedia : () => {},
            webcamRef: c => this.webcam = c,
            title,
            subTitle: '',
          }
        }
        />
        <div className={style.caption}>
        {
          isRecording &&
            <div>
              <div className={style.recordingIndicator}>
                {i18n.t('capture.liveness.recording')}
              </div>
              <Challenge {...{i18n, type, value}} />
            </div>
        }
        </div>
        <CameraActions>
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
                onClick={this.handleNextChallengeClick}>
                {this.props.i18n.t('capture.liveness.challenges.next')}
              </button> :
              <button
                className={classNames(style.btn, {
                  [style.stopRecording]: isRecording,
                  [style.startRecording]: !isRecording,
                })}
                onClick={isRecording ? this.handleRecordingStopClick : this.handleRecordingStartClick}
                disabled={this.props.hasError}
              />
          }
        </CameraActions>
      </div>
    )
  }
}
