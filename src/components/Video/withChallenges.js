// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Spinner from '../Spinner'
import CameraError from '../CameraError'
import type { ChallengeType } from './Challenge'
import { requestChallenges } from '../utils/onfidoApi'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type InjectedProps = {
  token: string,
  i18n: Object,
  renderFallback: Function,
  trackScreen: Function,
}

type State = {
  challengesId: string,
  challenges: ChallengeType[],
  hasError: boolean,
  hasLoaded: boolean,
};

const initialState = {
  challengesId: '',
  challenges: [],
  hasLoaded: false,
  hasError: false,
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
      this.setState({...initialState}, () =>
        requestChallenges(this.props.token, this.handleResponse, this.handleError)
      )
    }

    handleResponse = (response: Object) => {
      const challenges: ChallengeType[] = response.data.challenge
      const challengesId: string = String(response.data.id)
      this.setState({ challenges, challengesId, hasLoaded: true })
    }

    handleError = () => {
      this.setState({ hasLoaded: true, hasError: true })
    }

    renderError = () => {
      const { i18n, trackScreen, renderFallback } = this.props
      return (
        <CameraError
          {...{ i18n, trackScreen, renderFallback }}
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
