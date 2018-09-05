// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Spinner from '../Spinner'
import Recorder from './Recorder'
import type { ChallengeType } from './Challenge'
import type { RecorderType } from './Recorder'
import { requestChallenges } from '../utils/onfidoApi'
import { currentMilliseconds } from '../utils'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type Props = {
  token: string,
  onVideoCapture: Function,
} & RecorderType

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

export default class Liveness extends Component<Props, State> {

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
    }
  }

  handleVideoRecordingStart = () => {
    this.setState({ startedAt: currentMilliseconds() })
  }

  handleVideoRecorded = (blob: ?Blob) => {
    const { challenges, id, switchSeconds } = this.state
    const challengeData = { challenges, id, switchSeconds }
    this.props.onVideoCapture({ blob, challengeData })
  }

  render() {
    const { hasLoaded, hasError, challenges } = this.state

    return (
      <div>{
        hasLoaded ?
          <Recorder {...{
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
