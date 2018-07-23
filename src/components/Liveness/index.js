// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Error from '../Error'
import Spinner from '../Spinner'
import { performHttpReq } from '../utils/http'
import LivenessCamera from '../Camera/LivenessCamera'
import type { CameraType } from '../Camera/CameraTypes'
import type { ChallengeType } from './Challenge'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type State = {
  id: string,
  challenges: ChallengeType[],
  hasError: boolean,
  hasLoaded: boolean,
  switchedAt?: boolean,
};

const initialState = {
  id: '',
  challenges: [],
  hasLoaded: false,
  hasError: false,
};

export default class Liveness extends Component<CameraType, State> {

  state: State = {
    ...initialState,
  }

  componentDidMount() {
    this.loadChallenges()
  }

  loadChallenges = () => {
    this.setState({...initialState})
    this.handleResponse({
      id: 'abcde123',
      challenge: [
        {
          type: 'movement',
          query: 'turnLeft',
        },
        {
          type: 'recite',
          query: [1, 3, 4],
        }
      ]
    })
    /*const options = {
      endpoint: `${process.env.FACE_TORII_URL}/v1/challenge`,
      contentType: 'application/json',
      token: `Bearer ${this.props.token}`
    }
    performHttpReq(options, this.handleResponse, this.handleError)*/
  }

  handleResponse = ({ challenge: challenges, id }) => {
    this.setState({ challenges, id, hasLoaded: true })
  }

  handleError = () => {
    this.setState({ hasLoaded: true, hasError: true })
  }

  handleChallengeSwitch = () => {
    this.setState({ switchedAt: Date.now() / 1000 | 0 })
  }

  handleVideoRecorded = (blob: ?Blob) => {
    const { challenges, id, switchedAt } = this.state
    this.props.onVideoRecorded(blob, {
      challenges, id, switchedAt,
    })
  }

  render() {
    const { i18n = {} } = this.props
    const { hasLoaded, hasError, challenges } = this.state

    return (
      hasLoaded ?
        hasError ?
          <Error {...{error: serverError, i18n}} /> :
          <LivenessCamera {...{
            ...this.props,
            challenges,
            onVideoRecorded: this.handleVideoRecorded,
            onSwitchChallenge: this.handleChallengeSwitch,
            onRedo: this.loadChallenges,
          }} />
        :
          <Spinner />
    )
  }
}
