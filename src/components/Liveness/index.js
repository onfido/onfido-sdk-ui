// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import Error from '../Error'
import Spinner from '../Spinner'
import theme from '../Theme/style.css'
import { preventDefaultOnClick } from '../utils'
import { getLivenessChallenges } from '../utils/onfidoApi'
import LivenessCamera from '../Camera/LivenessCamera'
import Challenge from './Challenge'
import type { CameraType } from '../Camera/CameraTypes'
import type { ChallengeType } from './Challenge'

const noop = () => {}
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
}

export default class Liveness extends React.Component<CameraType, State> {

  state: State = {
    ...initialState,
  }

  componentDidMount() {
    this.loadChallenges()
  }

  loadChallenges = () => {
    this.setState({...initialState})
    getLivenessChallenges(
      challenges =>  this.setState({ challenges, hasLoaded: true }),
      error => this.setState({ hasLoaded: true, hasError: true })
    )
  }

  handleVideoRecorded = (blob: ?Blob) => {
    this.props.onVideoRecorded(blob, this.state.challenges)
  }

  render() {
    const { i18n = {} } = this.props
    const { hasSeenIntro, hasLoaded, hasError, challenges } = this.state

    return (
      hasLoaded ?
        hasError ?
          <Error {...{error: serverError, i18n}} /> :
          <LivenessCamera {...{
            ...this.props,
            challenges,
            onRedo: this.loadChallenges,
            timeoutSeconds: 5,
          }} /> 
        :
          <Spinner />
    )
  }
}
