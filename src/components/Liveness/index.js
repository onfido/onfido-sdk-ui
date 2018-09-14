// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Spinner from '../Spinner'
import LivenessCamera from '../Camera/LivenessCamera'
import type { CameraType } from '../Camera/CameraTypes'
import type { ChallengeType } from './Challenge'
import { requestChallenges } from '../utils/onfidoApi'
import { currentMilliseconds } from '../utils'
import { sendScreen } from '../../Tracker'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type State = {
  id: string,
  challenges: Array<ChallengeType>,
  hasError: boolean,
  hasLoaded: boolean,
  startedAt: number,
  switchSeconds?: number,
};

const initialState = {
  id: '',
  challenges: [],
  hasLoaded: false,
  hasError: false,
  startedAt: 0
};

export default class Liveness extends Component<CameraType, State> {

  state: State = {
    ...initialState,
  }

  componentDidMount() {
    this.loadChallenges()
  }

  loadChallenges = () => {
    this.setState({...initialState}, () =>
      requestChallenges(this.props.token, this.handleResponse, this.handleError)
    )
    this.setState({...initialState})

  }

  handleResponse = (response: Object) => {
    const {challenge, id} = response.data
    this.setState({ challenges: challenge, id, hasLoaded: true })
  }

  handleError = () => {
    this.setState({ hasLoaded: true, hasError: true })
  }

  handleChallengeSwitch = () => {
    if (this.state.startedAt) {
      this.setState({ switchSeconds: currentMilliseconds() - this.state.startedAt })
      sendScreen(['face_video_capture_step_2'])
    }
  }

  handleVideoRecordingStart = () => {
    this.setState({ startedAt: currentMilliseconds() })
    sendScreen(['face_video_capture_step_1'])
  }

  handleVideoRecorded = (blob: ?Blob) => {
    const { challenges, id, switchSeconds } = this.state
    this.props.onVideoRecorded(blob, {
      challenges, id, switchSeconds,
    })
  }

  render() {
    const { hasLoaded, hasError, challenges } = this.state

    return (
      <div>{
        hasLoaded ?
          <LivenessCamera {...{
            ...this.props,
            hasError,
            cameraError: hasError ? serverError : undefined,
            challenges,
            onVideoRecorded: this.handleVideoRecorded,
            onVideoRecordingStart: this.handleVideoRecordingStart,
            onSwitchChallenge: this.handleChallengeSwitch,
            onRedo: this.loadChallenges,
          }} />
          :
          <Spinner />
      }
      </div>
    )
  }
}
