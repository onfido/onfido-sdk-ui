// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Error from '../Error'
import Spinner from '../Spinner'
import { getLivenessChallenges } from '../utils/onfidoApi'
import LivenessCamera from '../Camera/LivenessCamera'
import type { CameraType } from '../Camera/CameraTypes'
import type { ChallengeType } from './Challenge'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type State = {
  challenges: ChallengeType[],
  hasError: boolean,
  hasLoaded: boolean,
};

const initialState = {
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
    this.setState({...initialState}, () =>
      getLivenessChallenges(
        challenges =>  this.setState({ challenges, hasLoaded: true }),
        () => this.setState({ hasLoaded: true, hasError: true })
      )
    )
  }

  handleVideoRecorded = (blob: ?Blob) => {
    this.props.onVideoRecorded(blob, this.state.challenges)
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
            onRedo: this.loadChallenges,
          }} />
        :
          <Spinner />
    )
  }
}
