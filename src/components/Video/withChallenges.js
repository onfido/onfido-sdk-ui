// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Spinner from '../Spinner'
import type { ChallengeType } from './Challenge'
import { requestChallenges } from '../utils/onfidoApi'

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type Props = {
  token: string,
  onVideoCapture: Function,
}

type State = {
  id: string,
  challenges: Array<ChallengeType>,
  hasError: boolean,
  hasLoaded: boolean,
};

const initialState = {
  id: '',
  challenges: [],
  hasLoaded: false,
  hasError: false,
};

const withChallenges = Video =>
  class VideoWithChallenges extends Component<Props, State> {

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
      const {challenge, id} = response.data
      this.setState({ challenges: challenge, id, hasLoaded: true })
    }

    handleError = () => {
      this.setState({ hasLoaded: true, hasError: true })
    }

    renderError = () => <CameraError error={serverError} hasBackdrop />

    render() {
      const { hasLoaded, hasError, challenges, id } = this.state

      return (
        <div>{
          hasLoaded ?
            <Video
              {...{...this.props}}
              id={id}
              challenges={challenges}
              onRedo={this.loadChallenges}
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
