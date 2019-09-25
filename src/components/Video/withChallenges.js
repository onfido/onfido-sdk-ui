// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Spinner from '../Spinner'
import CameraError from '../CameraError'
import type { ChallengeType } from './Challenge'
import { requestChallenges } from '~utils/onfidoApi'
import { currentMilliseconds } from '~utils'
import { sendScreen } from '../../Tracker'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type InjectedProps = {
  token: string,
  renderFallback: Function,
  trackScreen: Function,
}

type State = {
  challengesId: string,
  challenges: ChallengeType[],
  hasError: boolean,
  hasLoaded: boolean,
  challengeRequestedAt: number
};

const initialState = {
  challengesId: '',
  challenges: [],
  hasLoaded: false,
  hasError: false,
  challengeRequestedAt: 0
};

const withChallenges = <Props: *>(
    WrappedVideo: React.ComponentType<Props>
  ): React.ComponentType<Props & InjectedProps> =>
  class WithChallenges extends Component<Props, State> {

    state: State = {...initialState}

    componentDidMount() {
      this.loadChallenges()
    }

    loadChallenges = () => {
      this.setState({...initialState, challengeRequestedAt: currentMilliseconds()}, () => {
        const url = this.props.urls.onfido_api_url
        requestChallenges(url, this.props.token, this.handleResponse, this.handleError)
        sendScreen(['face_video_challenge_requested'])
      })
    }

    handleResponse = (response: Object) => {
      const challenges: ChallengeType[] = response.data.challenge
      const challengesId: string = String(response.data.id)
      this.setState({ challenges, challengesId, hasLoaded: true })
      sendScreen(['face_video_challenge_loaded'], {challenge_loading_time: this.challengeLoadingTime()})
    }

    handleError = (error) => {
      this.setState({ hasLoaded: true, hasError: true })
      this.props.triggerOnError(error)
      sendScreen(['face_video_challenge_load_failed'], {challenge_loading_time: this.challengeLoadingTime()})
    }

    challengeLoadingTime = () => currentMilliseconds() - this.state.challengeRequestedAt

    renderError = () => {
      const { trackScreen, renderFallback } = this.props
      return (
        <CameraError
          {...{ trackScreen, renderFallback }}
          error={serverError}
          hasBackdrop
        />
      )
    }

    render() {
      const { hasLoaded, hasError, challenges, challengesId } = this.state

      return (
        <div>
        {
          hasLoaded ?
            <WrappedVideo
              {...{...this.props, challengesId, challenges, onRedo: this.loadChallenges}}
              {...(hasError ? { renderError: this.renderError() } : {}) }
            />
            :
            <Spinner />
        }
        </div>
      )
    }
  }

export default withChallenges
