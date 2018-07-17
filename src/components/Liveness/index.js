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
import Video from '../Camera/Video'
import Intro from './Intro'
import Challenge from './Challenge'
import type { CameraType } from '../Camera/CameraTypes'
import type { ChallengeType } from './Challenge'

const noop = () => {}
const serverError = { name: 'SERVER_ERROR', type: 'error' }

type State = {
  challenges: ChallengeType[],
  hasError: boolean,
  hasLoaded: boolean,
  hasSeenIntro: boolean,
};

const initialState = {
  challenges: [],
  hasLoaded: false,
  hasError: false,
  hasSeenIntro: false,
}

export default class Liveness extends React.Component<CameraType, State> {

  state: State = {
    hasSeenIntro: false,
    ...initialState,
  }

  componentDidMount() {
    this.loadChallenges()
  }

  loadChallenges = () => {
    const { hasSeenIntro } = this.state
    this.setState({...initialState, hasSeenIntro})
    getLivenessChallenges()
      .then(challenges =>  this.setState({ challenges, hasLoaded: true }))
      .catch(error => this.setState({ hasLoaded: true, hasError: true }))
  }

  handleIntroNext = () => {
    this.setState({ hasSeenIntro: true })
  }

  handleVideoRecorded = (blob: ?Blob) => {
    this.props.onVideoRecorded(blob, this.state.challenges)
  }

  render() {
    const { i18n = {} } = this.props
    const { hasSeenIntro, hasLoaded, hasError, challenges } = this.state

    return (
      hasSeenIntro ?
        hasLoaded ?
          hasError ?
            <Error {...{error: serverError, i18n}} /> :
            <Video {...{
              ...this.props,
              challenges,
              onRedo: this.loadChallenges,
              timeoutSeconds: 15,
            }} /> 
          :
            <Spinner />
        :
        <Intro {...{ i18n, onNext: this.handleIntroNext }} />
    )
  }
}
